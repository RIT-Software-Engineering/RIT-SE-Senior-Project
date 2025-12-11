// Imports
const UserAuth = require("./user_auth");
const db_router = require("express").Router();
const { validationResult, body } = require("express-validator");
const PDFDoc = require("pdfkit");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const moment = require("moment");
const fileSizeParser = require("filesize-parser");
const he = require("he");
const { convert } = require("html-to-text");
const redeployDatabase = require("../../db_setup");

function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

const defaultFileSizeLimit = 15 * 1024 * 1024;

const DB_CONFIG = require("../database/db_config");
const CONFIG = require("../config/config");
const { nanoid } = require("nanoid");
// Split route modules (kept mounted here so existing API paths remain available)
const sponsorsRoutes = require("./routes/sponsors_routes");
const actionsRoutes = require("./routes/actions_routes");
const projectsRoutes = require("./routes/projects_routes");
const archivesRoutes = require("./routes/archives_routes");
const errorLogsRoutes = require("./routes/error_logs_routes");
const usersRoutes = require("./routes/users_routes");
const timeLoggingRoutes = require("./routes/time_logging_routes");
const submissionsRoutes = require("./routes/submissions_routes");
const proposalsRoutes = require("./routes/proposals_routes");
const filesRoutes = require("./routes/files_routes");
const semesterRoutes = require("./routes/semester_routes");
const devOnlyRoutes = require("./routes/dev_only_routes");
const dashboardRoutes = require("./routes/dashboard_routes");

// Mount split routers early so they take precedence over the large monolithic definitions
db_router.use("/", sponsorsRoutes(db));
db_router.use("/", actionsRoutes(db));
db_router.use("/", projectsRoutes(db));
db_router.use("/", archivesRoutes(db));
db_router.use("/", errorLogsRoutes(db));
db_router.use("/", usersRoutes(db));
db_router.use("/", timeLoggingRoutes(db));
db_router.use("/", submissionsRoutes(db));
db_router.use("/", proposalsRoutes(db));
db_router.use("/", filesRoutes(db));
db_router.use("/", semesterRoutes(db));
db_router.use("/", devOnlyRoutes(db));
db_router.use("/", dashboardRoutes(db));
const CONSTANTS = require("../consts");
const { ROLES } = require("../consts");
const { off } = require("process");
const USERAuth = require("./user_auth");

const ACTION_TARGETS = {
  ADMIN: "admin",
  COACH: "coach",
  TEAM: "team",
  INDIVIDUAL: "individual",
  COACH_ANNOUNCEMENT: "coach_announcement",
  STUDENT_ANNOUNCEMENT: "student_announcement",
  PEER_EVALUATION: "peer_evaluation",
};

// Routes
module.exports = (db) => {
  db_router.get(
    "/getActiveTimelines",
    [UserAuth.isSignedIn],
    (req, res, next) => {
      calculateActiveTimelines(req.user)
        .then((timelines) => {
          res.json(timelines);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get("/getHtml", (req, res, next) => {
    let getHtmlQuery = `SELECT * FROM page_html`;
    let queryParams = [];
    //If there is a query parameter, then select html from specified table.
    if (typeof req.query.name !== "undefined" && req.query.name) {
      getHtmlQuery = `SELECT html FROM page_html WHERE name = ?`;
      queryParams = [req.query.name];
    }
    db.query(getHtmlQuery, queryParams)
      .then((html) => {
        // Replace placeholder with actual server base URL
        const serverBaseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.PRODUCTION_SERVER_URL ||
              process.env.BASE_URL ||
              `${req.protocol}://${req.get("host")}`
            : `${req.protocol}://${req.get("host")}`;

        // Process HTML to replace placeholders
        if (Array.isArray(html)) {
          html = html.map((item) => {
            if (item.html) {
              item.html = item.html.replace(
                /__SERVER_BASE_URL__/g,
                serverBaseUrl,
              );
            }
            return item;
          });
        } else if (html && html.html) {
          html.html = html.html.replace(/__SERVER_BASE_URL__/g, serverBaseUrl);
        }

        res.send(html);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.post(
    "/editPage",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      let editPageQuery = `UPDATE page_html
        SET html = ?
        WHERE name = ?
        `;
      let promises = [];
      //Individually update all html tables from the body of the req.
      Object.keys(req.body).forEach((key) => {
        let queryParams = [req.body[key], key];
        promises.push(
          db
            .query(editPageQuery, queryParams)
            .then(() => {
              //do nothing
            })
            .catch((err) => {
              console.error(err);
              const error = new Error(err);
              error.statusCode = 500;
              return next(error);
            }),
        );
      });
      Promise.all(promises).then(() => {
        res.send({ msg: "Success!" });
      });
    },
  );

  function calculateActiveTimelines(user) {
    let projectFilter;
    switch (user.type) {
      case ROLES.ADMIN:
        projectFilter = "";
        break;
      case ROLES.STUDENT:
        projectFilter = `WHERE projects.status = 'in progress' AND projects.project_id IN (SELECT project FROM users WHERE users.system_id = "${user.system_id}")`;
        break;
      case ROLES.COACH:
        projectFilter = `WHERE projects.status = 'in progress' AND projects.project_id IN (SELECT project_id FROM project_coaches WHERE coach_id = "${user.system_id}")`;
        break;
      default:
        throw new Error("Unhandled user role");
    }

    return new Promise((resolve, reject) => {
      // WARN: If any field in an action is null, group_concat will remove that entire action...
      let getTeams = `
                SELECT  projects.display_name,
                        projects.title,
                        projects.project_id,
                        semester_group.name AS 'semester_name',
                        semester_group.semester_id AS 'semester_id',
                        semester_group.start_date AS 'start_date',
                        semester_group.end_date AS 'end_date',
                        (
                            SELECT group_concat(fname || ' ' || lname || ' (' || email || ')')
                            FROM users
                            WHERE projects.project_id = users.project
                        ) team_members,
                        (
                            SELECT group_concat(fname || ' ' || lname || ' (' || email || ')')
                            FROM project_coaches
                            LEFT JOIN users ON project_coaches.coach_id = users.system_id
                            WHERE projects.project_id = project_coaches.project_id
                        ) coach
                FROM projects
                LEFT JOIN semester_group
                    ON projects.semester = semester_group.semester_id
                    ${projectFilter}
                ORDER BY projects.semester DESC
            `;
      db.query(getTeams)
        .then((values) => {
          resolve(values);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  return db_router;
};
