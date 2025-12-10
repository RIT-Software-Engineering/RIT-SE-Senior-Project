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

  db_router.get(
    "/getAdditionalInfo",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const requestedUserId = req.query.system_id;

      if (!requestedUserId) {
        return res.status(400).send({ error: "User ID is required" });
      }

      try {
        const result = await db.query(
          `SELECT json_extract(profile_info, '$.additional_info') AS additional_info
             FROM users WHERE system_id = ?`,
          [requestedUserId],
        );

        if (result.length === 0) {
          const error = new Error("User not found");
          error.statusCode = 404;
          return next(error);
        }

        res.send(result[0]);
      } catch (err) {
        const error = new Error("Database query failed");
        error.statusCode = 500;
        error.details = err.message;
        next(error);
      }
    },
  );

  db_router.post(
    "/editAdditionalInfo",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id, additional_info } = req.body;

      if (!system_id || additional_info === undefined) {
        return res
          .status(400)
          .send({ error: "system_id and additional_info are required" });
      }

      const updateQuery = `
        UPDATE users
        SET profile_info = json_set(profile_info, '$.additional_info', ?)
        WHERE system_id = ?
    `;

      try {
        await db.query(updateQuery, [additional_info, system_id]);
        res
          .status(200)
          .send({ message: "Additional info updated successfully" });
      } catch (err) {
        const error = new Error("Database update failed");
        error.statusCode = 500;
        error.details = err.message;
        next(error);
      }
    },
  );

  db_router.post(
    "/setDarkMode",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id, dark_mode } = req.body;

      const updateQuery = `
        UPDATE users
        SET profile_info = json_set(profile_info, '$.dark_mode', ?)
        WHERE system_id = ?
    `;

      try {
        await db.query(updateQuery, [dark_mode, system_id]);
        res
          .status(200)
          .send({ message: "Dark mode preference updated successfully" });
      } catch (err) {
        const error = new Error("Database update failed");
        error.statusCode = 500;
        error.details = err.message;
        next(error);
      }
    },
  );

  db_router.get(
    "/getDarkMode",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id } = req.query;

      const query = `
      SELECT JSON_EXTRACT(profile_info, '$.dark_mode') AS dark_mode
      FROM users
      WHERE system_id = ?
    `;

      try {
        const result = await db.query(query, [system_id]);
        if (result.length === 0) {
          const error = new Error("User not found");
          error.statusCode = 404;
          return next(error);
        }

        const darkModeRaw = result[0].dark_mode;
        const dark_mode = Boolean(darkModeRaw);

        res.status(200).send({ dark_mode });
      } catch (err) {
        const error = new Error("Database query failed");
        error.statusCode = 500;
        error.details = err.message;
        next(error);
      }
    },
  );

  db_router.get(
    "/getPeerEvals",
    [UserAuth.isCoachOrAdmin],
    (req, res, next) => {
      const semesterNumber = req.query.semester;

      let getPeerEvalsQuery = `
      SELECT action_id 
      FROM actions
      WHERE action_target = 'peer_evaluation'
    `;

      let queryParams = [];
      if (semesterNumber) {
        getPeerEvalsQuery += ` AND semester = ?`;
        queryParams.push(semesterNumber);
      }

      db.query(getPeerEvalsQuery, queryParams)
        .then((values) => {
          const actionIds = values.map((row) => row.action_id);

          if (actionIds.length === 0) {
            return res.send([]);
          }

          let getPeerEvalLogsQuery = `
          SELECT action_log.*, users.fname, users.lname, users.type
          FROM action_log
          LEFT JOIN users ON action_log.system_id = users.system_id
          WHERE action_template IN (${actionIds.join(",")})
          ORDER BY submission_datetime DESC
        `;

          return db.query(getPeerEvalLogsQuery);
        })
        .then((logs) => {
          if (logs) res.send(logs);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error("Error fetching peer evaluations");
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.post(
    "/setGanttView",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id, gantt_view } = req.body;

      const updateQuery = `
        UPDATE users
        SET profile_info = json_set(profile_info, '$.gantt_view', ?)
        WHERE system_id = ?
    `;

      try {
        await db.query(updateQuery, [gantt_view, system_id]);
        console.log(
          "Gantt view preference updated successfully",
          gantt_view,
          system_id,
        );
        res
          .status(200)
          .send({ message: "Gantt view preference updated successfully" });
      } catch (err) {
        const error = new Error("Database update failed");
        error.statusCode = 500;
        error.details = err.message;
        next(error);
      }
    },
  );

  db_router.get(
    "/getGanttView",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id } = req.query;

      const query = `
      SELECT JSON_EXTRACT(profile_info, '$.gantt_view') AS gantt_view
      FROM users
      WHERE system_id = ?
    `;

      try {
        const result = await db.query(query, [system_id]);

        if (result.length === 0) {
          const error = new Error("User not found");
          error.statusCode = 404;
          return next(error);
        }

        const ganttViewRaw = result[0].gantt_view;
        // Handle both boolean and string values from JSON
        const gantt_view =
          ganttViewRaw === true ||
          ganttViewRaw === "true" ||
          ganttViewRaw === 1 ||
          ganttViewRaw === "1";

        res.status(200).send({ gantt_view });
      } catch (err) {
        const error = new Error("Database query failed");
        error.statusCode = 500;
        error.details = err.message;
        next(error);
      }
    },
  );

  // Calendar View preferences
  db_router.post(
    "/setCalendarView",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id, calendar_view } = req.body;

      const updateQuery = `
        UPDATE users
        SET profile_info = json_set(profile_info, '$.calendar_view', ?)
        WHERE system_id = ?
    `;

      try {
        await db.query(updateQuery, [calendar_view, system_id]);
        console.log(
          "Calendar view preference updated successfully",
          calendar_view,
          system_id,
        );
        res
          .status(200)
          .send({ message: "Calendar view preference updated successfully" });
      } catch (err) {
        const error = new Error("Database update failed");
        error.statusCode = 500;
        error.details = err.message;
        next(error);
      }
    },
  );

  db_router.get(
    "/getCalendarView",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id } = req.query;

      const query = `
      SELECT JSON_EXTRACT(profile_info, '$.calendar_view') AS calendar_view
      FROM users
      WHERE system_id = ?
    `;

      try {
        const result = await db.query(query, [system_id]);

        if (result.length === 0) {
          const error = new Error("User not found");
          error.statusCode = 404;
          return next(error);
        }
        const calendarViewRaw = result[0].calendar_view;
        // Handle both boolean and string values from JSON
        const calendar_view =
          calendarViewRaw === true ||
          calendarViewRaw === "true" ||
          calendarViewRaw === 1 ||
          calendarViewRaw === "1";

        res.status(200).send({ calendar_view });
      } catch (err) {
        const error = new Error("Database query failed");
        error.statusCode = 500;
        error.details = err.message;
        next(error);
      }
    },
  );

  // Milestone View preferences
  db_router.post(
    "/setMilestoneView",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id, milestone_view } = req.body;

      const updateQuery = `
        UPDATE users
        SET profile_info = json_set(profile_info, '$.milestone_view', ?)
        WHERE system_id = ?
    `;

      try {
        await db.query(updateQuery, [milestone_view, system_id]);
        console.log(
          "Milestone view preference updated successfully",
          milestone_view,
          system_id,
        );
        res
          .status(200)
          .send({ message: "Milestone view preference updated successfully" });
      } catch (err) {
        const error = new Error("Database update failed");
        error.statusCode = 500;
        error.details = err.message;
        next(error);
      }
    },
  );

  db_router.get(
    "/getMilestoneView",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id } = req.query;

      const query = `
      SELECT JSON_EXTRACT(profile_info, '$.milestone_view') AS milestone_view
      FROM users
      WHERE system_id = ?
    `;

      try {
        const result = await db.query(query, [system_id]);

        if (result.length === 0) {
          const error = new Error("User not found");
          error.statusCode = 404;
          return next(error);
        }
        const milestoneViewRaw = result[0].milestone_view;
        // Handle both boolean and string values from JSON
        const milestone_view =
          milestoneViewRaw === true ||
          milestoneViewRaw === "true" ||
          milestoneViewRaw === 1 ||
          milestoneViewRaw === "1";

        res.status(200).send({ milestone_view });
      } catch (err) {
        const error = new Error("Database query failed");
        error.statusCode = 500;
        error.details = err.message;
        next(error);
      }
    },
  );

  return db_router;
};
