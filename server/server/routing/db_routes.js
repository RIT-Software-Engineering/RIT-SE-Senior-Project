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
  /**
   * /getAllUsersForLogin ENDPOINT SHOULD ONLY BE HIT IN DEVELOPMENT ONLY
   *
   * THIS IS USED BY THE DEVELOPMENT LOGIN AND SHOULD NOT BE USED FOR ANYTHING ELSE
   */
  if (process.env.NODE_ENV !== "production") {
    // gets all users
    db_router.get("/DevOnlyGetAllUsersForLogin", (req, res) => {
      db.query(`SELECT ${CONSTANTS.SIGN_IN_SELECT_ATTRIBUTES} FROM users`).then(
        (users) => res.send(users),
      );
    });
    //Redeploy database
    db_router.put("/DevOnlyRedeployDatabase", async (req, res) => {
      try {
        await redeployDatabase();
        res
          .status(200)
          .json({ success: true, message: "Database redeployed successfully" });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to redeploy database",
          error: error.message,
        });
      }
    });
  }

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

  db_router.post(
    "/submitAction",
    [UserAuth.isSignedIn, UserAuth.canWrite, body("*").trim()],
    async (req, res, next) => {
      let result = validationResult(req);

      if (result.errors.length !== 0) {
        return res.status(400).send("Input is invalid");
      }

      let body = req.body;

      const query = `SELECT * FROM actions WHERE action_id = ?;`;
      const [action] = await db.query(query, [body.action_template]);

      const startDate = new Date(action.start_date);
      if (startDate > Date.now()) {
        const error = new Error("Action start date is in the future");
        error.statusCode = 400;
        return next(error);
      }

      switch (action.action_target) {
        case ACTION_TARGETS.ADMIN:
          if (req.user.type !== ROLES.ADMIN) {
            const error = new Error("Only admins can submit admin actions");
            error.statusCode = 401;
            return next(error);
          }
          break;
        case ACTION_TARGETS.COACH:
          if (req.user.type !== ROLES.COACH && req.user.type !== ROLES.ADMIN) {
            const error = new Error("Only coaches can submit coach actions");
            error.statusCode = 401;
            return next(error);
          }
          break;
        case ACTION_TARGETS.INDIVIDUAL:
          if (req.user.type !== ROLES.STUDENT) {
            const error = new Error(
              "Only students can submit individual actions",
            );
            error.statusCode = 401;
            return next(error);
          }
          break;
        //TODO: Add case for PEER_EVALUATION
        case ACTION_TARGETS.PEER_EVALUATION:
          if (
            req.user.type !== ROLES.COACH &&
            req.user.type !== ROLES.STUDENT
          ) {
            const error = new Error(
              "Only coaches and students can submit peer evaluations",
            );
            error.statusCode = 401;
            return next(error);
          }
          break;
        case ACTION_TARGETS.COACH_ANNOUNCEMENT:
        case ACTION_TARGETS.STUDENT_ANNOUNCEMENT:
          const error = new Error("You cannot submit an announcement");
          error.statusCode = 401;
          return next(error);
        case ACTION_TARGETS.TEAM:
          // Anyone can submit team actions
          break;
        case ACTION_TARGETS.PEER_EVALUATION:
          if (req.user.type !== ROLES.STUDENT) {
            const error = new Error(
              "Only students can submit peer evaluations.",
            );
            error.statusCode = 401;
            return next(error);
          }
          break;
        default:
          error = new Error("Invalid action target");
          error.statusCode = 400;
          return next(error);
      }

      let date = new Date();
      let timeString = `${date.getFullYear()}-${date.getUTCMonth()}-${date.getDate()}`;
      const submission = `${timeString}_${nanoid()}`;

      let baseURL = path.join(
        __dirname,
        `../project_docs/${body.project}/${action.action_target}/${action.action_id}/${req.user.system_id}/${submission}`,
      );

      // Attachment Handling
      let filenamesCSV = "";
      if (req.files && req.files.attachments) {
        // If there is only one attachment, then it does not come as a list
        if (req.files.attachments.length === undefined) {
          req.files.attachments = [req.files.attachments];
        }

        if (req.files.attachments.length > 5) {
          // Don't allow more than 5 files
          const error = new Error("Maximum of 5 files allowed");
          error.statusCode = 400;
          return next(error);
        }

        fs.mkdirSync(baseURL, { recursive: true });

        for (let x = 0; x < req.files.attachments.length; x++) {
          if (
            req.files.attachments[x].size >
            (action.file_size || defaultFileSizeLimit)
          ) {
            // 15mb limit exceeded
            const responseText =
              "File exceeded submission size limit of: " +
              humanFileSize(action.file_size || defaultFileSizeLimit, false, 0);
            const error = new Error(responseText);
            error.statusCode = 400;
            return next(error);
          }
          if (
            !action.file_types
              .split(",")
              .includes(
                path.extname(req.files.attachments[x].name).toLocaleLowerCase(),
              )
          ) {
            // send an error if the file is not an accepted type
            const error = new Error("file type not accepted");
            error.statusCode = 400;
            return next(error);
          }

          // Append the file name to the CSV string, begin with a comma if x is not 0
          filenamesCSV +=
            x === 0
              ? `${submission}/${req.files.attachments[x].name}`
              : `,${submission}/${req.files.attachments[x].name}`;

          req.files.attachments[x].mv(
            `${baseURL}/${req.files.attachments[x].name}`,
            function (err) {
              if (err) {
                console.error(err);
                const error = new Error(err);
                error.statusCode = 500;
                return next(error);
              }
            },
          );
        }
      }

      let insertAction = `
            INSERT INTO action_log(
                action_template,
                system_id,
                project,
                form_data,
                files
                ${(req.user.mock && ",mock_id") || ""}
                )
            VALUES (?,?,?,?,?${(req.user.mock && ",?") || ""})
        `;

      let params = [
        body.action_template,
        req.user.system_id,
        body.project,
        body.form_data,
        filenamesCSV,
      ];
      if (req.user.mock) {
        params.push(req.user.mock.system_id);
      }

      db.query(insertAction, params)
        .then(() => {
          return res.sendStatus(200);
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

  db_router.get("/getActions", [UserAuth.isAdmin], (req, res, next) => {
    let getActionsQuery = `
            SELECT *
            FROM actions
            ORDER BY action_id desc
        `;
    db.query(getActionsQuery)
      .then((values) => {
        res.send(values);
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.get(
    "/getTimelineActions",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      if (
        req.user.type === ROLES.STUDENT &&
        req.query.project_id !== req.user.project
      ) {
        const error = new Error("trying to acces project that is not yours");
        error.statusCode = 401;
        return next(error);
      }

      // Add a case for when the action target is 'peer_evaluation'
      // The action is not done unless compelted by all students, AND the coach has passed it through
      //   - For better UI/UX, if the coach has not passed it through and the students have; the peer evaluation visual on the dashboard should be red INSTEAD of directly falling onto the UNHANDLED-CASE
      let getTimelineActions = `SELECT action_title, action_id, start_date, due_date, semester, action_target, date_deleted, short_desc, file_types, file_size, page_html,
                    CASE
                        WHEN action_target IS 'admin' AND system_id IS NOT NULL THEN 'green'
                        WHEN action_target IS 'coach' AND system_id IS NOT NULL THEN 'green'
                        WHEN action_target IS 'team' AND system_id IS NOT NULL THEN 'green'
                        WHEN action_target = 'peer_evaluation' AND COUNT(DISTINCT system_id) IS (SELECT COUNT(DISTINCT system_id) FROM users WHERE users.project = ?) + 1 THEN 'green'
                        WHEN action_target = 'peer_evaluation' THEN 'red'
                        WHEN action_target IS 'individual' AND COUNT(DISTINCT system_id) IS (SELECT COUNT(DISTINCT system_id) FROM users WHERE users.project = ?) THEN 'green'
                        WHEN start_date <= date('now') AND due_date >= date('now') THEN 'yellow'
                        WHEN date('now') > due_date AND system_id IS NULL THEN 'red'
                        WHEN date('now') > due_date AND action_target IS 'individual' AND COUNT(DISTINCT system_id) != (SELECT COUNT(DISTINCT system_id) FROM users WHERE users.project = ?) THEN 'red'
                        WHEN date('now') < start_date THEN 'grey'
                    ELSE 'UNHANDLED-CASE'
                END AS 'state'
            FROM actions
            LEFT JOIN action_log
                ON action_log.action_template = actions.action_id AND action_log.project = ?
                WHERE actions.date_deleted = '' AND actions.semester = (SELECT distinct projects.semester FROM projects WHERE projects.project_id = ?)
                AND actions.action_target NOT IN ('${ACTION_TARGETS.COACH_ANNOUNCEMENT}', '${ACTION_TARGETS.STUDENT_ANNOUNCEMENT}')
            GROUP BY actions.action_id`;

      db.query(getTimelineActions, [
        req.query.project_id,
        req.query.project_id,
        req.query.project_id,
        req.query.project_id,
        req.query.project_id,
      ])
        .then((values) => {
          res.send(values);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  /*
   * This will join between the action and action_log tables. It returns the due date from
   * a specific log_id's action_template # = action_id.
   */
  db_router.get(
    "/getLateSubmission",
    [UserAuth.isSignedIn],
    (req, res, next) => {
      let getLateSubmissionQuery = `SELECT actions.due_date
                                      FROM action_log
                                      JOIN actions ON actions.action_id = action_log.action_template
                                      WHERE action_log.action_log_id = ?`;
      let params = [req.query.log_id];
      db.query(getLateSubmissionQuery, params)
        .then((values) => {
          res.send(values);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get("/getActionLogs", [UserAuth.isSignedIn], (req, res, next) => {
    let getActionLogQuery = "";
    let params = [];

    switch (req.user.type) {
      case ROLES.STUDENT:
        // NOTE: Technically, users are able to see if coaches submitted actions to other projects, but they should not be able to see the actual submission content form this query so that should be fine
        //          This is because of the "OR users.type = '${ROLES.COACH}'" part of the following query.
        getActionLogQuery = `SELECT action_log.action_log_id, action_log.submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id, action_log.project,
                        actions.action_title, actions.due_date,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) name,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) mock_name,
                        (SELECT users.type FROM users WHERE users.system_id = action_log.system_id) AS user_type,
                        (SELECT users.type FROM users WHERE users.system_id = action_log.mock_id) AS mock_type
                    FROM action_log
                        JOIN actions ON actions.action_id = action_log.action_template
                        WHERE action_log.action_template = ? AND action_log.project = ?`;
        params = [req.query.action_id, req.user.project];
        break;
      case ROLES.COACH:
      case ROLES.ADMIN:
        getActionLogQuery = `SELECT action_log.*, actions.action_title, actions.due_date,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) AS name,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) AS mock_name,
                        (SELECT users.type FROM users WHERE users.system_id = action_log.system_id) AS user_type,
                        (SELECT users.type FROM users WHERE users.system_id = action_log.mock_id) AS mock_type
                    FROM action_log
                    JOIN actions ON actions.action_id = action_log.action_template
                    WHERE action_log.action_template = ? AND action_log.project = ?`;
        params = [req.query.action_id, req.query.project_id];
        break;

      default:
        const error = new Error("Unknown Role");
        error.statusCode = 401;
        return next(error);
    }
    db.query(getActionLogQuery, params)
      .then((values) => {
        res.send(values);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.get(
    "/getAllActionLogs",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { resultLimit, offset } = req.query;

      let getActionLogQuery = "";
      let queryParams = [];
      let getActionLogCount = "";
      let countParams = [];

      switch (req.user.type) {
        case ROLES.STUDENT:
          getActionLogQuery = `SELECT action_log.action_log_id, action_log.submission_datetime AS submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id,  action_log.project,
            actions.action_target, actions.action_title, actions.semester,
            projects.display_name, projects.title,
            (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) name,
            (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) mock_name
              FROM action_log
            JOIN actions ON actions.action_id = action_log.action_template
            JOIN projects ON projects.project_id = action_log.project
            WHERE action_log.project = ?
            ORDER BY submission_datetime DESC
            LIMIT ? OFFSET ?`;
          queryParams = [req.user.project, resultLimit, offset * resultLimit];
          getActionLogCount = `SELECT COUNT(*) FROM action_log
              JOIN actions ON actions.action_id = action_log.action_template
              WHERE action_log.project = ?
              AND action_log.system_id in (SELECT users.system_id FROM users WHERE users.project = ?)`;
          countParams = [req.user.project, req.user.project];
          break;
        case ROLES.COACH:
          getActionLogQuery = `SELECT action_log.action_log_id, action_log.submission_datetime AS submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id,  action_log.project,
              actions.action_target, actions.action_title, actions.semester,
              projects.display_name, projects.title,
              (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) name,
              (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) mock_name
              FROM action_log
            JOIN actions ON actions.action_id = action_log.action_template
            JOIN projects ON projects.project_id = action_log.project
            WHERE action_log.project IN (SELECT project_id FROM project_coaches WHERE coach_id = ?)
            ORDER BY submission_datetime DESC
            LIMIT ? OFFSET ?`;
          queryParams = [req.user.system_id, resultLimit, offset * resultLimit];
          getActionLogCount = `SELECT COUNT(*) FROM action_log WHERE action_log.project IN (SELECT project_id FROM project_coaches WHERE coach_id = ?)`;
          countParams = [req.user.system_id];
          break;
        case ROLES.ADMIN:
          getActionLogQuery = `SELECT action_log.action_log_id, action_log.submission_datetime AS submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id,  action_log.project,
              actions.action_target, actions.action_title, actions.semester,
              projects.display_name, projects.title,
              (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) name,
              (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) mock_name
              FROM action_log
                JOIN actions ON actions.action_id = action_log.action_template
                JOIN projects ON projects.project_id = action_log.project
              ORDER BY submission_datetime DESC
              LIMIT ? OFFSET ?`;
          queryParams = [resultLimit, offset * resultLimit];
          getActionLogCount = `SELECT COUNT(*) FROM action_log`;
          break;
        default:
          const error = new Error("Unknown Role");
          error.statusCode = 401;
          return next(error);
      }

      const actionLogsPromise = db.query(getActionLogQuery, queryParams);
      const actionLogsCountPromise = db.query(getActionLogCount, countParams);
      Promise.all([actionLogsCountPromise, actionLogsPromise])
        .then(([[actionLogCount], projects]) => {
          res.send({
            actionLogCount: actionLogCount[Object.keys(actionLogCount)[0]],
            actionLogs: projects,
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get(
    "/getCoachFeedback",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const getFeedbackQuery = `
            SELECT form_data, a.action_title as title, a.start_date as date, a.action_id, submission_datetime
            FROM action_log
            JOIN main.users u on action_log.system_id = u.system_id
            JOIN main.actions a on action_log.action_template = a.action_id
            WHERE action_log.project = ?  AND u.type = 'coach'
        `;

      db.query(getFeedbackQuery, req.query.project_id)
        .then((feedback) => {
          res.send(feedback);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get("/getSemesters", [UserAuth.isSignedIn], (req, res, next) => {
    let getSemestersQuery = `
            SELECT *
            FROM semester_group
            ORDER BY end_date, start_date, name
        `;
    db.query(getSemestersQuery)
      .then((values) => {
        res.send(values);
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.get(
    "/getSemesterAnnouncements",
    [UserAuth.isSignedIn],
    (req, res, next) => {
      let filter = "";
      if (req.user.type === ROLES.STUDENT) {
        // req.query.semester comes in as a string and req.user.semester_group is a number so convert both to strings to compare them.
        if (`${req.query.semester}` !== `${req.user.semester_group}`) {
          const error = new Error(
            "Students can not access announcements that are not for your project",
          );
          error.statusCode = 401;
          return next(error);
        }

        filter = `AND actions.action_target IS NOT '${ACTION_TARGETS.COACH_ANNOUNCEMENT}'`;
        // Note: Since we only do this check for students, coaches can technically hack the request to see announcements for other semesters.
        // Unfortunately, coaches don't inherently have a semester like students do
        // and 1am Kevin can't think of another way of ensuring that a coach isn't lying to us about their semester ...but idk what they would gain form doing that sooo ima just leave it for now
      }

      //ToDo: make sure that the dates don't screw things up because of GMT i.e. it becomes tomorrow in GMT before it becomes tomorrow at the server's location
      let getTimelineActions = `
            SELECT action_title, action_id, start_date, due_date, semester, action_target, date_deleted, page_html
            FROM actions
            WHERE actions.date_deleted = '' AND actions.semester = ?
                AND (actions.action_target IN ('${ACTION_TARGETS.COACH_ANNOUNCEMENT}', '${ACTION_TARGETS.STUDENT_ANNOUNCEMENT}') AND actions.start_date <= date('now') AND actions.due_date >= date('now'))
                ${filter}
            ORDER BY actions.due_date ASC
        `;

      db.query(getTimelineActions, [req.query.semester])
        .then((values) => {
          res.send(values);
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.post(
    "/editSemester",
    [UserAuth.isAdmin, UserAuth.canWrite, body("*").trim()],
    (req, res, next) => {
      let body = req.body;

      let updateQuery = `
            UPDATE semester_group
            SET name = ?,
                dept = ?,
                start_date = ?,
                end_date = ?
            WHERE semester_id = ?
        `;

      let params = [
        body.name,
        body.dept,
        body.start_date,
        body.end_date,
        body.semester_id,
      ];

      db.query(updateQuery, params)
        .then(() => {
          return res.status(200).send();
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.post(
    "/createSemester",
    [
      UserAuth.isAdmin,
      UserAuth.canWrite,
      body("name")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("dept")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("start_date")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("end_date")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
    ],
    (req, res, next) => {
      let result = validationResult(req);

      if (result.errors.length !== 0) {
        const errorMessages = result.errors
          .map((error) => `${error.param}: ${error.msg}`)
          .join(", ");
        const error = new Error(`Error Creating Semester: ${errorMessages}`);
        error.statusCode = 400;
        return next(error);
      }

      let body = req.body;

      let sql = `
            INSERT INTO semester_group
            (name, dept, start_date, end_date)
            VALUES (?,?,?,?);
        `;

      let params = [body.name, body.dept, body.start_date, body.end_date];

      db.query(sql, params)
        .then(() => {
          return res.status(200).send();
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
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
