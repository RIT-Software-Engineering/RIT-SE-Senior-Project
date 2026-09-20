// Imports
const UserAuth = require("./user_auth");
const db_router = require("express").Router();
const { validationResult, body } = require("express-validator");
const PDFDoc = require("pdfkit");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const dayjs = require("dayjs");
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

/**
 * Format: {ActionName}_{YYYY-MM-DD}_{ProjectName}_{SubmitterUserName}[-N].{ext}
 */
function sanitizeFileNameSegment(str, maxLen = 10) {
  return (str || "")
    .toString()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "")
    .slice(0, maxLen);
}

function buildSubmissionDownloadName({
  actionTitle,
  submissionDateTime,
  projectName,
  submitterUserName,
  fileIndex,
  originalFileName,
}) {
  const ext = path.extname(originalFileName || "");
  const dateStr = submissionDateTime
    ? dayjs(submissionDateTime).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");

  const segments = [
    sanitizeFileNameSegment(actionTitle),
    dateStr,
    sanitizeFileNameSegment(projectName),
    sanitizeFileNameSegment(submitterUserName),
  ].filter(Boolean);

  const increment = fileIndex > 0 ? `-${fileIndex + 1}` : "";

  return segments.join("_") + increment + ext;
}

const DB_CONFIG = require("../database/db_config");
const CONFIG = require("../config/config");
const { nanoid } = require("nanoid");
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

const {
  recordActionEditAudit,
  recordActionCreateAudit,
  recordProjectEditAudit,
  recordSemesterEditAudit,
  recordSemesterCreateAudit,
  recordArchiveEditAudit,
  recordArchiveCreateAudit,
  recordUserEditAudit,
  recordUserCreateAudit,
  recordSponsorEditAudit,
  recordSponsorCreateAudit,
  recordSponsorNoteCreateAudit,
  recordTimeLogCreateAudit,
  recordTimeLogDeleteAudit,
  recordErrorLogDeleteAudit,
  recordActionSubmissionCreateAudit,
} = require("../audit/audit_events");

function lookupNewlyInsertedId(db, table, idColumn, whereFields) {
  const columns = Object.keys(whereFields);
  const whereSql = columns.map((col) => `${col} = ?`).join(" AND ");
  const params = columns.map((col) => whereFields[col]);

  return db
    .query(
      `SELECT ${idColumn} FROM ${table} WHERE ${whereSql} ORDER BY ${idColumn} DESC LIMIT 1`,
      params,
    )
    .then((rows) => (rows && rows[0] ? rows[0][idColumn] : null));
}

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

  // get error logs
  db_router.get("/getAllErrorLogs", [UserAuth.isAdmin], (req, res, next) => {
    const getErrorLogsQuery = `
            SELECT * FROM ${DB_CONFIG.tableNames.error_log} ORDER BY error_log_id ASC
        `;
    db.query(getErrorLogsQuery)
      .then((errorLogs) => {
        res.send(errorLogs);
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.get("/getAuditLogs", [UserAuth.isAdmin], (req, res, next) => {
    const {
      entity_type,
      action_type,
      start_date,
      end_date,
      search,
      resultLimit,
      offset,
    } = req.query;

    const whereClauses = [];
    const params = [];

    if (entity_type) {
      whereClauses.push("entity_type = ?");
      params.push(entity_type);
    }
    if (action_type) {
      whereClauses.push("action_type = ?");
      params.push(action_type);
    }
    if (start_date) {
      whereClauses.push("date(audit_datetime) >= date(?)");
      params.push(start_date);
    }
    if (end_date) {
      whereClauses.push("date(audit_datetime) <= date(?)");
      params.push(end_date);
    }
    if (search) {
      whereClauses.push("(system_id LIKE ? OR message LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const limit = Number(resultLimit) || 20;
    const page = Number(offset) || 0;

    const getAuditLogsQuery = `
            SELECT * FROM ${DB_CONFIG.tableNames.audit_log}
            ${whereSql}
            ORDER BY audit_log_id DESC
            LIMIT ? OFFSET ?
        `;

    db.query(getAuditLogsQuery, [...params, limit, page * limit])
      .then((auditLogs) => {
        res.send(auditLogs);
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.delete(
    "/removeErrorLog/:id",
    [UserAuth.isAdmin],
    (req, res, next) => {
      const deleteErrorLogQuery = `
            DELETE FROM ${DB_CONFIG.tableNames.error_log} WHERE error_log_id = ?
        `;
      db.query(
        `SELECT * FROM ${DB_CONFIG.tableNames.error_log} WHERE error_log_id = ?`,
        [req.params.id],
      )
        .then((rows) => {
          const deletedRow = rows && rows[0] ? rows[0] : null;
          return db
            .query(deleteErrorLogQuery, [req.params.id])
            .then(() => deletedRow);
        })
        .then((deletedRow) => {
          recordErrorLogDeleteAudit(req, req.params.id, deletedRow);
          res.status(200).send();
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get(
    "/selectAllSponsorInfo",
    [UserAuth.isCoachOrAdmin],
    (req, res) => {
      db.selectAll(DB_CONFIG.tableNames.sponsor_info).then(function (value) {
        res.send(value);
      });
    },
  );

  db_router.get(
    "/selectAllStudentInfo",
    [UserAuth.isCoachOrAdmin],
    (req, res, next) => {
      let getStudentsQuery = `
            SELECT *
            FROM users
            LEFT JOIN semester_group
            ON users.semester_group = semester_group.semester_id
            WHERE type = 'student'
            ORDER BY semester_group desc
        `;
      db.query(getStudentsQuery)
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

  db_router.get(
    "/selectAllNonStudentInfo",
    [UserAuth.isAdmin],
    (req, res, next) => {
      let getUsersQuery = `
            SELECT *
            FROM users
            LEFT JOIN semester_group
            ON users.semester_group = semester_group.semester_id
            WHERE type != 'student'
        `;
      db.query(getUsersQuery)
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

  db_router.get(
    "/getSemesterStudents",
    [UserAuth.isSignedIn],
    (req, res, next) => {
      let query = "";
      let params = [];
      switch (req.user.type) {
        //Retrieves all users from a semester group that is similar to the student that is making the query.
        case ROLES.STUDENT:
          query = `
            SELECT users.* 
            FROM users 
            WHERE users.semester_group = (
              SELECT semester_group FROM users WHERE system_id = ?
            ) AND users.type = 'student'`;
          params = [req.user.system_id];
          break;

        case ROLES.COACH:
          query = `
            SELECT users.* FROM users
            LEFT JOIN semester_group
              ON users.semester_group = semester_group.semester_id
            WHERE users.semester_group IN (
              SELECT projects.semester FROM projects
              WHERE projects.project_id IN (
                SELECT project_coaches.project_id FROM project_coaches
                WHERE project_coaches.coach_id = ?
              )
            )`;
          params = [req.user.system_id];
          break;

        case ROLES.ADMIN:
          query = `SELECT * FROM users
                    LEFT JOIN semester_group
                    ON users.semester_group = semester_group.semester_id
                    WHERE users.type = 'student'`;
          break;
        default:
          break;
      }

      db.query(query, params)
        .then((users) => {
          if (req.user.type === ROLES.STUDENT) {
            users = users.map((user) => {
              let output = {};
              if (user.project === req.user.project) {
                output["last_login"] = user["last_login"];
                output["prev_login"] = user["prev_login"];
              }
              output["active"] = user["active"];
              output["email"] = user["email"];
              output["fname"] = user["fname"];
              output["lname"] = user["lname"];
              output["project"] = user["project"];
              output["semester_group"] = user["semester_group"];
              output["system_id"] = user["system_id"];
              output["type"] = user["type"];
              return output;
            });
          }
          res.send(users);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get("/getProjectMembers", [UserAuth.isSignedIn], (req, res) => {
    let query = `SELECT users.*, project_coaches.project_id FROM users
            LEFT JOIN project_coaches ON project_coaches.coach_id = users.system_id
            WHERE users.project = ? OR project_coaches.project_id = ?`;

    params = [req.query.project_id, req.query.project_id];

    db.query(query, params).then((users) => res.send(users));
  });

  // NOTE: This is currently used for getting user for AdminView to mock users, however, I feel that this network request will get quite large
  // as we add about 100 users every semester.
  db_router.get("/getActiveUsers", [UserAuth.isAdmin], (req, res) => {
    let query = `SELECT ${CONSTANTS.SIGN_IN_SELECT_ATTRIBUTES}
            FROM users
            WHERE active = ''`;
    db.query(query).then((users) => res.send(users));
  });

  db_router.post(
    "/createUser",
    [
      UserAuth.isAdmin,
      UserAuth.canWrite,
      body("system_id")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("fname")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("lname")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("email")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("type")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("semester_group").isLength({ max: 50 }),
      body("project").isLength({ max: 50 }),
      body("active").trim().escape().isLength({ max: 50 }),
      body("viewOnly").trim().escape().isLength({ max: 50 }),
    ],
    async (req, res, next) => {
      let result = validationResult(req);
      console.log(result);

      if (result.errors.length !== 0) {
        const error = new Error("Validation Error");
        error.statusCode = 400;
        return next(error);
      }

      let body = req.body;

      const sql = `INSERT INTO ${DB_CONFIG.tableNames.users}
                (system_id, fname, lname, email, type, semester_group, project, active, view_only, profile_info)
                VALUES (?,?,?,?,?,?,?,?,?,?)`;

      const active =
        body.active === "false"
          ? dayjs().format(CONSTANTS.datetime_format)
          : "";

      const viewOnly = body.viewOnly === "true" ? "TRUE" : "FALSE";

      // Default profile_info with required fields
      const defaultProfileInfo = JSON.stringify({
        additional_info: "",
        dark_mode: false,
        gantt_view: true,
      });

      const params = [
        body.system_id,
        body.fname,
        body.lname,
        body.email,
        body.type,
        body.semester_group === "" ? null : body.semester_group,
        body.project === "" ? null : body.project,
        active,
        viewOnly,
        defaultProfileInfo,
      ];
      db.query(sql, params)
        .then(() => {
          recordUserCreateAudit(req, body);
          return res.status(200).send();
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
    "/batchCreateUser",
    [
      UserAuth.isAdmin,
      UserAuth.canWrite,
      // TODO: Add more validation
    ],
    async (req, res, next) => {
      try {
        let users = JSON.parse(req.body.users);
        const failedUsers = [];
        const successUsers = [];

        for (const user of users) {
          // Default profile_info with required fields
          const defaultProfileInfo = JSON.stringify({
            additional_info: "",
            dark_mode: false,
            gantt_view: true,
          });

          const values = [
            user.system_id,
            user.fname,
            user.lname,
            user.email,
            user.type,
            user.semester_group === "" ? null : user.semester_group,
            user.active.toLocaleLowerCase() === "false"
              ? dayjs().format(CONSTANTS.datetime_format)
              : "",
            defaultProfileInfo,
          ];

          try {
            await db.query(
              `INSERT INTO ${DB_CONFIG.tableNames.users} 
              (system_id, fname, lname, email, type, semester_group, active, profile_info) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              values,
            );
            successUsers.push(user);
          } catch (err) {
            let errorMessage = err.message;

            // Provide more user-friendly error messages for common constraint violations
            if (err.code === "SQLITE_CONSTRAINT") {
              if (
                err.message.includes(
                  "UNIQUE constraint failed: users.system_id",
                )
              ) {
                errorMessage = `System ID '${user.system_id}' already exists`;
              } else if (
                err.message.includes("UNIQUE constraint failed: users.email")
              ) {
                errorMessage = `Email '${user.email}' already exists`;
              } else {
                errorMessage = "Duplicate data - user may already exist";
              }
            }

            failedUsers.push({ user, error: errorMessage });
          }
        }

        res.status(200).json({ successUsers, failedUsers });
      } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      }
    },
  );

  db_router.post(
    "/editUser",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      let body = req.body;

      let updateQuery = `
            UPDATE users
            SET fname = ?,
                lname = ?,
                email = ?,
                type = ?,
                semester_group = ?,
                project = ?,
                active = ?,
                view_only = ?
            WHERE system_id = ?
        `;

      const active =
        body.active === "false"
          ? dayjs().format(CONSTANTS.datetime_format)
          : "";

      const viewOnly = body.viewOnly === "true" ? "TRUE" : "FALSE";

      let params = [
        body.fname,
        body.lname,
        body.email,
        body.type,
        body.semester_group || null,
        body.project || null,
        active,
        viewOnly,
        body.system_id,
      ];

      db.query("SELECT * FROM users WHERE system_id = ?", [body.system_id])
        .then((rows) => {
          const priorUser = rows && rows[0] ? rows[0] : {};
          return db.query(updateQuery, params).then(() => priorUser);
        })
        .then((priorUser) => {
          recordUserEditAudit(req, body, priorUser, active);
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
    "/removeTime",
    [UserAuth.isSignedIn, UserAuth.canWrite],
    (req, res, next) => {
      if (!req.body.id) {
        const error = new Error("No Id Provided");
        error.statusCode = 400;
        return next(error);
      }

      const sql = "UPDATE time_log SET active=0 WHERE time_log_id = ?";

      db.query("SELECT * FROM time_log WHERE time_log_id = ?", [req.body.id])
        .then((rows) => {
          const deletedRow = rows && rows[0] ? rows[0] : null;
          return db.query(sql, [req.body.id]).then(() => deletedRow);
        })
        .then((deletedRow) => {
          recordTimeLogDeleteAudit(req, req.body.id, deletedRow);
          res.status(200).send();
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get("/avgTime", [UserAuth.isSignedIn], async (req, res, next) => {
    const sql =
      "SELECT ROUND(AVG(CASE WHEN active != 0 THEN time_amount ELSE NULL END), 2)  AS avgTime, system_id FROM time_log WHERE project = ? GROUP BY system_id";
    console.log(req.query.project_id);

    db.query(sql, [req.query.project_id])
      .then((time) => {
        console.log(time);
        res.send(time);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.post(
    "/createTimeLog",
    [UserAuth.canWrite],
    async (req, res, next) => {
      let result = validationResult(req);

      if (result.errors.length !== 0) {
        const error = new Error("Validation Error");
        error.statusCode = 400;
        return next(error);
      }

      // Validate that the work date is not in the future
      // This prevents users from logging time for dates that haven't occurred yet
      const workDate = new Date(req.body.date);
      const currentDate = new Date();
      const currentDateOnly = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      const workDateOnly = new Date(
        workDate.getFullYear(),
        workDate.getMonth(),
        workDate.getDate(),
      );

      if (workDateOnly > currentDateOnly) {
        const error = new Error("Cannot log time for future dates");
        error.statusCode = 400;
        return next(error);
      }

      // Validate that the work date is within the past 14 days (2 weeks)
      // This maintains the existing business rule about recent time logging
      const twoWeeksAgo = new Date(currentDateOnly);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      if (workDateOnly < twoWeeksAgo) {
        const error = new Error("Cannot log time for dates older than 14 days");
        error.statusCode = 400;
        return next(error);
      }

      let mock_id = req.user.mock ? req.user.mock.system_id : "";

      const sql = `INSERT INTO time_log
                (semester, system_id, project, mock_id, work_date, time_amount, work_comment)
                VALUES (?,?,?,?,?,?,?)`;

      const params = [
        req.user.semester_group,
        req.user.system_id,
        req.user.project,
        mock_id,
        req.body.date,
        req.body.time_amount,
        req.body.comment,
      ];
      db.query(sql, params)
        .then(() => {
          return db.query(
            `SELECT time_log_id FROM time_log
             WHERE system_id = ? AND project = ? AND work_date = ? AND time_amount = ?
             ORDER BY time_log_id DESC LIMIT 1`,
            [
              req.user.system_id,
              req.user.project,
              req.body.date,
              req.body.time_amount,
            ],
          );
        })
        .then((rows) => {
          const newTimeLogId = rows && rows[0] ? rows[0].time_log_id : null;
          recordTimeLogCreateAudit(req, req.body, newTimeLogId);
          return res.status(200).send();
        })
        .catch((err) => {
          console.error(err);
          let error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get(
    "/getActiveProjects",
    [UserAuth.isSignedIn],
    (req, res, next) => {
      let getProjectsQuery = `
            SELECT *
            FROM projects
            LEFT JOIN semester_group
            ON projects.semester = semester_group.semester_id
            WHERE projects.semester IS NOT NULL
        `;
      db.query(getProjectsQuery)
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

  db_router.get(
    "/getActiveCoaches",
    [UserAuth.isCoachOrAdmin],
    (req, res, next) => {
      const sql = `SELECT * FROM users WHERE type = '${ROLES.COACH}' AND active = ''`;

      db.query(sql)
        .then((coaches) => {
          res.send(coaches);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get(
    "/getProjectCoaches",
    [UserAuth.isCoachOrAdmin],
    (req, res, next) => {
      const getProjectCoaches = `SELECT users.* FROM users
            LEFT JOIN project_coaches ON project_coaches.coach_id = users.system_id
            WHERE project_coaches.project_id = ?`;

      db.query(getProjectCoaches, [req.query.project_id])
        .then((coaches) => {
          res.send(coaches);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get(
    "/getProjectStudents",
    [UserAuth.isCoachOrAdmin],
    (req, res, next) => {
      const getProjectStudents = "SELECT * FROM users WHERE users.project = ?";

      db.query(getProjectStudents, [req.query.project_id])
        .then((students) => {
          res.send(students);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get(
    "/getProjectStudentNames",
    [UserAuth.isSignedIn],
    (req, res, next) => {
      const getProjectStudents =
        "SELECT fname,lname FROM users WHERE users.project = ? and users.system_id!=?";

      db.query(getProjectStudents, [req.query.project_id, req.user.system_id])
        .then((students) => {
          res.send(students);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get(
    "/selectAllCoachInfo",
    [UserAuth.isCoachOrAdmin],
    (req, res, next) => {
      const getCoachInfoQuery = `
            SELECT users.system_id,
            users.fname,
            users.lname,
            users.email,
            users.semester_group,
            (
                SELECT "[" || group_concat(
                    "{" ||
                        """title"""         || ":" || """" || COALESCE(projects.display_name, projects.title) || """" || "," ||
                        """semester_id"""   || ":" || """" || projects.semester                               || """" || "," ||
                        """project_id"""    || ":" || """" || projects.project_id                             || """" || "," ||
                        """organization"""  || ":" || """" || projects.organization                           || """" || "," ||
                        """status"""        || ":" || """" || projects.status                                 || """" ||
                    "}"
                ) || "]"
                FROM project_coaches
                LEFT JOIN projects ON projects.project_id = project_coaches.project_id
                WHERE project_coaches.coach_id = users.system_id
            ) projects
            FROM users
            WHERE users.type = "${ACTION_TARGETS.COACH}"
        `;

      db.query(getCoachInfoQuery)
        .then((coaches) => {
          res.send(coaches);
        })
        .catch((err) => {
          console.error(error);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // used in the /projects page and home page if featured
  db_router.get("/getActiveArchiveProjects", (req, res, next) => {
    const { resultLimit, page, featured } = req.query;
    let skipNum = page * resultLimit;
    let projectsQuery;
    let rowCountQuery;
    if (featured === "true") {
      // home page - randomized order of projects
      projectsQuery = `SELECT * FROM ${DB_CONFIG.tableNames.archive} WHERE oid NOT IN
            ( SELECT oid FROM ${DB_CONFIG.tableNames.archive} ORDER BY random() LIMIT ? )
            AND inactive = '' AND featured = 1 ORDER BY random() LIMIT ?`;
      rowCountQuery = `SELECT COUNT(*) FROM ${DB_CONFIG.tableNames.archive} WHERE inactive = ''`;
    } else {
      // projects page - all archived projects data regardless if they are archived or not
      projectsQuery = `SELECT * FROM ${DB_CONFIG.tableNames.archive} WHERE oid NOT IN
            ( SELECT oid FROM ${DB_CONFIG.tableNames.archive} ORDER BY archive_id LIMIT ? )
            AND inactive = '' ORDER BY archive_id LIMIT ?`;
      rowCountQuery = `SELECT COUNT(*) FROM ${DB_CONFIG.tableNames.archive} WHERE inactive = ''`;
    }
    const projectsPromise = db.query(projectsQuery, [skipNum, resultLimit]);
    const rowCountPromise = db.query(rowCountQuery);
    Promise.all([rowCountPromise, projectsPromise])
      .then(([[rowCount], projects]) => {
        res.send({
          totalProjects: rowCount[Object.keys(rowCount)[0]],
          projects: projects,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // endpoint for getting ALL archive data to view within admin view/editor
  db_router.get("/getArchiveProjects", (req, res, next) => {
    const { resultLimit, offset } = req.query;
    let skipNum = offset * resultLimit;
    let projectsQuery = `SELECT * FROM ${DB_CONFIG.tableNames.archive} WHERE
            oid NOT IN (SELECT oid FROM ${DB_CONFIG.tableNames.archive} ORDER BY archive_id LIMIT ?)
            ORDER BY archive_id LIMIT ?`;
    let rowCountQuery = `SELECT COUNT(*) FROM ${DB_CONFIG.tableNames.archive}`;

    const projectsPromise = db.query(projectsQuery, [skipNum, resultLimit]);
    const rowCountPromise = db.query(rowCountQuery);

    Promise.all([rowCountPromise, projectsPromise])
      .then(([[rowCount], projects]) => {
        res.send({
          totalProjects: rowCount[Object.keys(rowCount)[0]],
          projects: projects,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  /**
   * Responds with projects from database
   *
   * TODO: Add pagination
   */
  db_router.get(
    "/getProjects",
    [UserAuth.isCoachOrAdmin],
    async (req, res, next) => {
      const query = "SELECT * from projects";
      db.query(query)
        .then((projects) => res.send(projects))
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get(
    "/getCandidateProjects",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const query =
        "SELECT * from projects WHERE projects.status = 'candidate';";
      db.query(query)
        .then((projects) => res.send(projects))
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get(
    "/getMyProjects",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      let query;
      let params;
      switch (req.user.type) {
        case ROLES.COACH:
          query = `SELECT projects.*
                FROM projects
                INNER JOIN project_coaches
                ON (projects.project_id = project_coaches.project_id AND project_coaches.coach_id = ?);`;
          params = [req.user.system_id];
          break;
        case ROLES.STUDENT:
          query = `SELECT users.system_id, users.semester_group, projects.*
                FROM users
                INNER JOIN projects
                ON users.system_id = ? AND projects.project_id = users.project;`;
          params = [req.user.system_id];
          break;
        case ROLES.ADMIN:
          query =
            "SELECT * FROM projects WHERE projects.status NOT IN ('completed', 'rejected', 'archive');";
          params = [];
          break;
        default:
          const error = new Error(
            "Invalid user type...something must be very very broken...",
          );
          error.statusCode = 500;
          return next(error);
      }

      db.query(query, params)
        .then((proposals) => res.send(proposals))
        .catch((err) => res.status(500).send(err));
    },
  );

  db_router.get(
    "/getSemesterProjects",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      let query;
      let params;
      switch (req.user.type) {
        case ROLES.COACH:
          query = `
                SELECT projects.*
                FROM projects
                WHERE projects.semester IN
                    (SELECT projects.semester
                    FROM projects
                    INNER JOIN project_coaches
                    ON (projects.project_id = project_coaches.project_id AND project_coaches.coach_id = ?))
                ;`;
          params = [req.user.system_id];
          break;
        case ROLES.STUDENT:
          query = `SELECT users.system_id, projects.*
                FROM users
                INNER JOIN projects
                ON users.system_id = ? AND projects.semester = users.semester_group;`;
          params = [req.user.system_id];
          break;
        case ROLES.ADMIN:
          query =
            "SELECT * FROM projects WHERE projects.status NOT IN ('in progress', 'completed', 'rejected', 'archive');";
          params = [];
          break;
        default:
          const error = new Error(
            "Invalid user type...something must be very very broken...",
          );
          error.statusCode = 500;
          return next(error);
      }

      db.query(query, params)
        .then((projects) => res.send(projects))
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.post(
    "/editArchive",
    [UserAuth.isAdmin, UserAuth.canWrite],
    async (req, res, next) => {
      let body = req.body;
      const updateArchiveQuery = `UPDATE ${DB_CONFIG.tableNames.archive}
                                    SET featured=?, outstanding=?, creative=?, priority=?,
                                        title=?, project_id=?, team_name=?,
                                        members=?, sponsor=?, coach=?,
                                        poster_thumb=?, poster_full=?, archive_image=?, synopsis=?,
                                        video=?, name=?, dept=?,
                                        start_date=?, end_date=?, keywords=?, url_slug=?, inactive=?, locked=?
                                    WHERE archive_id = ?`;
      const inactive =
        body.inactive === "true"
          ? dayjs().format(CONSTANTS.datetime_format)
          : "";

      const locked =
        body.locked === "true"
          ? req.user.fname +
            " " +
            req.user.lname +
            " locked at " +
            dayjs().format(CONSTANTS.datetime_format)
          : "";

      const checkBox = (data) => {
        if (data === "true" || data === "1") {
          return 1;
        }
        return 0;
      };

      const strToInt = (data) => {
        if (typeof data === "string") {
          return parseInt(data);
        }
        return 0;
      };

      let updateArchiveParams = [
        checkBox(body.featured),
        checkBox(body.outstanding),
        checkBox(body.creative),
        strToInt(body.priority),
        body.title,
        body.project_id,
        body.team_name,
        body.members,
        body.sponsor,
        body.coach,
        body.poster_thumb,
        body.poster_full,
        body.archive_image,
        body.synopsis,
        body.video,
        body.name,
        body.dept,
        body.start_date,
        body.end_date,
        body.keywords,
        body.url_slug,
        inactive,
        locked,
        body.archive_id,
      ];

      db.query(
        `SELECT inactive FROM ${DB_CONFIG.tableNames.archive} WHERE archive_id = ?`,
        [body.archive_id],
      )
        .then((rows) => {
          const priorInactive = rows && rows[0] ? rows[0].inactive : "";
          return db
            .query(updateArchiveQuery, updateArchiveParams)
            .then(() => priorInactive);
        })
        .then((priorInactive) => {
          recordArchiveEditAudit(req, body, priorInactive, inactive);
          return res.status(200).send();
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
    "/createArchive",
    [UserAuth.isAdmin, UserAuth.canWrite],
    body("featured")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Cannot be empty"),
    async (req, res, next) => {
      let body = req.body;
      const inactive =
        body.inactive === "true"
          ? dayjs().format(CONSTANTS.datetime_format)
          : "";
      const locked =
        body.locked === "true"
          ? req.user.fname +
            " " +
            req.user.lname +
            " locked at " +
            dayjs().format(CONSTANTS.datetime_format)
          : "";

      const updateArchiveQuery = `INSERT INTO ${DB_CONFIG.tableNames.archive}(featured, outstanding, creative,
                                    priority, title, project_id, team_name, members, sponsor, coach, poster_thumb,
                                    poster_full, archive_image, synopsis, video, name, dept, start_date, end_date,
                                    keywords, url_slug, inactive, locked)
                                    VALUES(?, ?, ?, ?, ?, ?, ?, ?,
                                           ?, ?, ?, ?, ?, ?, ?, ?,
                                           ?, ?, ?, ?, ?, ?, ?);`;

      const checkBox = (data) => {
        if (data === "true" || data === "1") {
          return 1;
        }
        return 0;
      };

      const strToInt = (data) => {
        if (typeof data === "string") {
          return parseInt(data);
        }
        return 0;
      };

      const updateArchiveParams = [
        checkBox(body.featured),
        checkBox(body.outstanding),
        checkBox(body.creative),
        strToInt(body.priority),
        body.title,
        body.project_id,
        body.team_name,
        body.members,
        body.sponsor,
        body.coach,
        body.poster_thumb,
        body.poster_full,
        body.archive_image,
        body.synopsis,
        body.video,
        body.name,
        body.dept,
        body.start_date,
        body.end_date,
        body.keywords,
        body.url_slug,
        inactive,
        locked,
      ];

      db.query(updateArchiveQuery, updateArchiveParams)
        .then((response) => {
          return lookupNewlyInsertedId(
            db,
            DB_CONFIG.tableNames.archive,
            "archive_id",
            {
              name: body.name,
            },
          ).then((newArchiveId) => {
            recordArchiveCreateAudit(req, body, newArchiveId);
            return res.status(200).send(response);
          });
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
    "/editArchiveStudent",
    [UserAuth.isSignedIn, UserAuth.canWrite],
    async (req, res, next) => {
      let body = req.body;
      let files = req.files;
      const updateArchiveQuery = `UPDATE ${DB_CONFIG.tableNames.archive}
                                    SET featured=?, outstanding=?, creative=?, priority=?,
                                        title=?, project_id=?, team_name=?,
                                        members=?, sponsor=?, coach=?,
                                        poster_thumb=?, poster_full=?, archive_image=?, synopsis=?,
                                        video=?, name=?, dept=?,
                                        start_date=?, end_date=?, keywords=?, url_slug=?, inactive=?, locked=?
                                    WHERE archive_id = ?`;
      const inactive =
        body.inactive === "true"
          ? dayjs().format(CONSTANTS.datetime_format)
          : "";

      const locked =
        body.locked === "true"
          ? req.user.fname +
            " " +
            req.user.lname +
            " locked at " +
            dayjs().format(CONSTANTS.datetime_format)
          : "";

      let files_uploaded = [];

      let poster_full = ``;
      let poster_thumb = ``;
      let archive_image = ``;
      let video = ``;
      if (!(files === undefined || files === null)) {
        if (files.poster_full === undefined) {
          poster_full = body.poster_full;
          poster_thumb = body.poster_thumb;
        } else {
          if (
            files.poster_full.mimetype == "image/png" &&
            files.poster_full.size <= 30000000
          ) {
            files.poster_full.name = body.url_slug + "-poster";
            poster_full = `${files.poster_full.name}`;
            poster_thumb = poster_full;
            let poster_URL = path.join(
              __dirname,
              `../../resource/archivePosters`,
            );
            files_uploaded.push([files.poster_full, poster_URL]);
          } else {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
          }
        }

        if (files.archive_image === undefined) {
          archive_image = body.archive_image;
        } else {
          if (
            files.archive_image.mimetype == "image/png" &&
            files.archive_image.size <= 30000000
          ) {
            files.archive_image.name = body.url_slug + "-image";
            archive_image = `${files.archive_image.name}`;
            let image_URL = path.join(
              __dirname,
              `../../resource/archiveImages`,
            );
            files_uploaded.push([files.archive_image, image_URL]);
          } else {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
          }
        }

        if (files.video === undefined) {
          video = body.video;
        } else {
          if (
            files.video.mimetype == "video/mp4" &&
            files.video.size <= 300000000
          ) {
            files.video.name = body.url_slug + "-video";
            video = `${files.video.name}`;
            let video_URL = path.join(
              __dirname,
              `../../resource/archiveVideos`,
            );
            files_uploaded.push([files.video, video_URL]);
          } else {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
          }
        }

        for (let i = 0; i < files_uploaded.length; i++) {
          fs.mkdirSync(files_uploaded[i][1], { recursive: true });
          files_uploaded[i][0].mv(
            `${files_uploaded[i][1]}/${files_uploaded[i][0].name}`,
            function (err) {
              if (err) {
                const error = new Error(err);
                error.statusCode = 500;
                return next(error);
              }
            },
          );
        }
      } else {
        poster_full = body.poster_full;
        poster_thumb = body.poster_thumb;
        archive_image = body.archive_image;
        video = body.video;
      }

      const checkBox = (data) => {
        if (data === "true" || data === "1") {
          return 1;
        }
        return 0;
      };

      const strToInt = (data) => {
        if (typeof data === "string") {
          return parseInt(data);
        }
        return 0;
      };

      let updateArchiveParams = [
        checkBox(body.featured),
        checkBox(body.outstanding),
        checkBox(body.creative),
        strToInt(body.priority),
        body.title,
        body.project_id,
        body.team_name,
        body.members,
        body.sponsor,
        body.coach,
        poster_thumb,
        poster_full,
        archive_image,
        body.synopsis,
        video,
        body.name,
        body.dept,
        body.start_date,
        body.end_date,
        body.keywords,
        body.url_slug,
        inactive,
        locked,
        body.archive_id,
      ];

      db.query(updateArchiveQuery, updateArchiveParams)
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
    "/createArchiveStudent",
    [UserAuth.isSignedIn, UserAuth.canWrite],
    body("featured")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Cannot be empty"),
    async (req, res, next) => {
      let body = req.body;
      const inactive =
        body.inactive === "true"
          ? dayjs().format(CONSTANTS.datetime_format)
          : "";
      const locked =
        body.locked === "true"
          ? req.user.fname +
            " " +
            req.user.lname +
            " locked at " +
            dayjs().format(CONSTANTS.datetime_format)
          : "";

      const name = body.url_slug; //this value needs to be unique, but isn't used, so this is a relatively safe method.

      let files = req.files;
      let files_uploaded = [];

      let poster_full = ``;
      let poster_thumb = ``;
      let archive_image = ``;
      let video = ``;
      if (!(files === undefined || files === null)) {
        if (files.poster_full === undefined) {
          poster_full = body.poster_full;
          poster_thumb = body.poster_thumb;
        } else {
          if (
            files.poster_full.mimetype == "image/png" &&
            files.poster_full.size <= 30000000
          ) {
            files.poster_full.name = body.url_slug + "-poster";
            poster_full = `${files.poster_full.name}`;
            poster_thumb = poster_full;
            let poster_URL = path.join(
              __dirname,
              `../../resource/archivePosters`,
            );
            files_uploaded.push([files.poster_full, poster_URL]);
          } else {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
          }
        }

        if (files.archive_image === undefined) {
          archive_image = body.archive_image;
        } else {
          if (
            files.archive_image.mimetype == "image/png" &&
            files.archive_image.size <= 30000000
          ) {
            files.archive_image.name = body.url_slug + "-image";
            archive_image = `${files.archive_image.name}`;
            let image_URL = path.join(
              __dirname,
              `../../resource/archiveImages`,
            );
            files_uploaded.push([files.archive_image, image_URL]);
          } else {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
          }
        }

        if (files.video === undefined) {
          video = body.video;
        } else {
          if (
            files.video.mimetype == "video/mp4" &&
            files.video.size <= 300000000
          ) {
            files.video.name = body.url_slug + "-video";
            video = `${files.video.name}`;
            let video_URL = path.join(
              __dirname,
              `../../resource/archiveVideos`,
            );
            files_uploaded.push([files.video, video_URL]);
          } else {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
          }
        }

        for (let i = 0; i < files_uploaded.length; i++) {
          fs.mkdirSync(files_uploaded[i][1], { recursive: true });
          if (
            fs.existsSync(
              `${files_uploaded[i][1]}/${files_uploaded[i][0].name}`,
            )
          ) {
            fs.unlink(`${files_uploaded[i][1]}/${files_uploaded[i][0].name}`);
          }
          files_uploaded[i][0].mv(
            `${files_uploaded[i][1]}/${files_uploaded[i][0].name}`,
            function (err) {
              if (err) {
                const error = new Error(err);
                error.statusCode = 500;
                return next(error);
              }
            },
          );
        }
      } else {
        poster_full = body.poster_full;
        poster_thumb = body.poster_thumb;
        archive_image = body.archive_image;
        video = body.video;
      }

      const updateArchiveQuery = `INSERT INTO ${DB_CONFIG.tableNames.archive}(featured, outstanding, creative,
                                    priority, title, project_id, team_name, members, sponsor, coach, poster_thumb,
                                    poster_full, archive_image, synopsis, video, name, dept, start_date, end_date,
                                    keywords, url_slug, inactive, locked)
                                    VALUES(?, ?, ?, ?, ?, ?, ?, ?,
                                           ?, ?, ?, ?, ?, ?, ?, ?,
                                           ?, ?, ?, ?, ?, ?, ?);`;

      const checkBox = (data) => {
        if (data === "true" || data === "1") {
          return 1;
        }
        return 0;
      };

      const strToInt = (data) => {
        if (typeof data === "string") {
          return parseInt(data);
        }
        return 0;
      };

      const updateArchiveParams = [
        checkBox(body.featured),
        checkBox(body.outstanding),
        checkBox(body.creative),
        strToInt(body.priority),
        body.title,
        body.project_id,
        body.team_name,
        body.members,
        body.sponsor,
        body.coach,
        poster_thumb,
        poster_full,
        archive_image,
        body.synopsis,
        video,
        name,
        body.dept,
        body.start_date,
        body.end_date,
        body.keywords,
        body.url_slug,
        inactive,
        locked,
      ];

      db.query(updateArchiveQuery, updateArchiveParams)
        .then((response) => {
          return res.status(200).send(response);
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  //Gets the start and end dates of a project based on the semester that it is associated with.
  db_router.get("/getProjectDates", UserAuth.isSignedIn, (req, res, next) => {
    const getDatesQuery = `SELECT start_date, end_date FROM semester_group WHERE semester_id = ?`;
    const getDatesParams = [req.query.semester];
    db.query(getDatesQuery, getDatesParams)
      .then((dates) => {
        res.send(dates);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.post(
    "/editProject",
    [
      UserAuth.isAdmin,
      UserAuth.canWrite,
      // TODO: Should the max length be set to something smaller than 5000?
      body("title")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("organization")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("primary_contact")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("contact_email")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("contact_phone")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("background_info")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("project_description")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("project_scope")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("project_challenges")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("constraints_assumptions")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("sponsor_provided_resources")
        .trim()
        .escape()
        .isLength({ max: 5000 }),
      body("project_search_keywords").trim().escape().isLength({ max: 5000 }),
      body("sponsor_deliverables")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("proprietary_info").trim().escape().isLength({ max: 5000 }),
      body("sponsor_alternate_time").trim().escape().isLength({ max: 5000 }),
      body("sponsor_avail_checked")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("project_agreements_checked")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("assignment_of_rights")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),

      body("team_name")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("poster")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("video")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("website")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("synopsis")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("sponsor")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("semester")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      // body("date").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
      body("projectCoaches").trim().escape().isLength({ max: 5000 }),
    ],
    async (req, res, next) => {
      let body = req.body;

      const updateProjectSql = `UPDATE ${DB_CONFIG.tableNames.senior_projects}
            SET status=?, title=?, display_name=?, organization=?, primary_contact=?, contact_email=?, contact_phone=?,
            background_info=?, project_description=?, project_scope=?, project_challenges=?,
            sponsor_provided_resources=?, project_search_keywords=?, constraints_assumptions=?, sponsor_deliverables=?,
            proprietary_info=?, sponsor_alternate_time=?, sponsor_avail_checked=?, project_agreements_checked=?, assignment_of_rights=?,
            team_name=?, poster=?, video=?, website=?, synopsis=?, sponsor=?, semester=?
            WHERE project_id = ?`;

      const updateProjectParams = [
        body.status,
        body.title,
        body.display_name ? body.display_name : null, // Empty strings should be turned to null
        body.organization,
        body.primary_contact,
        body.contact_email,
        body.contact_phone,
        body.background_info,
        body.project_description,
        body.project_scope,
        body.project_challenges,
        body.sponsor_provided_resources,
        body.project_search_keywords,
        body.constraints_assumptions,
        body.sponsor_deliverables,
        body.proprietary_info,
        body.sponsor_alternate_time,
        body.sponsor_avail_checked,
        body.project_agreements_checked,
        body.assignment_of_rights,
        body.team_name,
        body.poster,
        body.video,
        body.website,
        body.synopsis,
        body.sponsor,
        body.semester || null,
        body.project_id,
      ];

      const insertValues = body.projectCoaches
        .split(",")
        .map((coachId) => ` ('${body.project_id}', '${coachId}')`);
      const deleteValues = body.projectCoaches
        .split(",")
        .map((coachId) => `'${coachId}'`);
      const updateCoachesSql = `INSERT OR IGNORE INTO '${DB_CONFIG.tableNames.project_coaches}' ('project_id', 'coach_id') VALUES ${insertValues};`;
      const deleteCoachesSQL = `DELETE FROM '${DB_CONFIG.tableNames.project_coaches}'
                                        WHERE project_coaches.project_id = '${body.project_id}'
                                        AND project_coaches.coach_id NOT IN (${deleteValues});`;

      Promise.all([
        db.query(updateProjectSql, updateProjectParams),
        db.query(updateCoachesSql),
        db.query(deleteCoachesSQL),
      ])
        .then((values) => {
          recordProjectEditAudit(req, body);
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

  /**
   * Updates a proposal with the given information
   */
  db_router.patch(
    "/updateProposalStatus",
    [
      UserAuth.isAdmin,
      UserAuth.canWrite,
      body("*").trim().escape().isJSON().isAlphanumeric(),
    ],
    (req, res, next) => {
      const query = `UPDATE ${DB_CONFIG.tableNames.senior_projects} SET status = ? WHERE project_id = ?`;
      db.query(query, [req.body.status, req.body.project_id])
        .then(() => {
          res.sendStatus(200);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  /**
   * Responds with a list of links to pdf versions of proposal forms
   *
   * NOTE: This route is unused and untested.
   */
  db_router.get(
    "/getProposalPdfNames",
    UserAuth.isSignedIn,
    (req, res, next) => {
      fs.readdir(
        path.join(__dirname, "../proposal_docs"),
        function (err, files) {
          if (err) {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
          }
          let fileLinks = [];
          files.forEach(function (file) {
            fileLinks.push(file.toString());
          });

          res.send(fileLinks);
        },
      );
    },
  );

  db_router.get("/getProposalPdf", UserAuth.isSignedIn, (req, res) => {
    if (req.query.project_id) {
      let projectId = req.query.project_id.replace(/\\|\//g, ""); // attempt to avoid any path traversal issues
      res.sendFile(path.join(__dirname, `../proposal_docs/${projectId}.pdf`));
    } else res.send("File not found");
  });

  // NOTE: This route is unused and untested.
  db_router.get(
    "/getProposalAttachmentNames",
    UserAuth.isSignedIn,
    (req, res, next) => {
      if (req.query.project_id) {
        let projectId = req.query.project_id.replace(/\\|\//g, ""); // attempt to avoid any path traversal issues, get the name with no extension
        fs.readdir(
          path.join(__dirname, `./server/sponsor_proposal_files/${projectId}`),
          function (err, files) {
            if (err) {
              const error = new Error(err);
              error.statusCode = 500;
              return next(error);
            }
            let fileLinks = [];
            files.forEach(function (file) {
              fileLinks.push(file.toString());
            });

            res.send(fileLinks);
          },
        );
      } else {
        res.status(404).send("Bad request");
      }
    },
  );

  db_router.get("/getProposalAttachment", UserAuth.isSignedIn, (req, res) => {
    if (req.query.project_id && req.query.name) {
      let projectId = req.query.project_id.replace(/\\|\//g, ""); // attempt to avoid any path traversal issues
      let name = req.query.name.replace(/\\|\//g, ""); // attempt to avoid any path traversal issues
      res.sendFile(
        path.join(__dirname, `../sponsor_proposal_files/${projectId}/${name}`),
      );
    } else res.send("File not found");
  });

  /*
   * Route to get sponsor data, particularly for getting all sponsor
   * emails for messaging. Sent to admin sponsor tab for building a csv
   */
  db_router.get("/getSponsorData", UserAuth.isAdmin, (req, res, next) => {
    let query = `SELECT * FROM sponsors WHERE inActive = 0 AND doNotEmail = 0`;
    let params = [];
    db.query(query, params)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  /**
   * WARN: THIS IS VERY DANGEROUS AND IT CAN BE USED TO OVERWRITE SERVER FILES.
   */
  db_router.post(
    "/uploadFiles",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      let filesUploaded = [];

      // Attachment Handling
      if (req.files && req.files.files) {
        // If there is only one attachment, then it does not come as a list
        if (req.files.files.length === undefined) {
          req.files.files = [req.files.files];
        }

        const formattedPath = `resource/${req.body.path}`;
        const baseURL = path.join(__dirname, `../../${formattedPath}`);

        //If directory, exists, it won't make one, otherwise it will based on the baseUrl :/
        fs.mkdirSync(baseURL, { recursive: true });
        for (let x = 0; x < req.files.files.length; x++) {
          req.files.files[x].mv(
            `${baseURL}/${req.files.files[x].name}`,
            function (err) {
              if (err) {
                console.error(err);
                const error = new Error(err);
                error.statusCode = 500;
                return next(error);
              }
            },
          );
          filesUploaded.push(
            `${process.env.BASE_URL}/${formattedPath}/${req.files.files[x].name}`,
          );
        }
      }
      res.send({ msg: "Success!", filesUploaded: filesUploaded });
    },
  );

  /**
   * WARN: THIS IS VERY DANGEROUS AND IT CAN BE USED TO OVERWRITE SERVER FILES.
   */
  db_router.post("/uploadFilesStudent", UserAuth.canWrite, (req, res, next) => {
    let filesUploaded = [];

    // Attachment Handling
    if (req.files && req.files.files) {
      // If there is only one attachment, then it does not come as a list
      if (req.files.files.length === undefined) {
        req.files.files = [req.files.files];
      }

      const formattedPath = `resource/${req.body.path}`;
      const baseURL = path.join(__dirname, `../../${formattedPath}`);

      //If directory, exists, it won't make one, otherwise it will based on the baseUrl :/
      fs.mkdirSync(baseURL, { recursive: true });
      for (let x = 0; x < req.files.files.length; x++) {
        req.files.files[x].mv(
          `${baseURL}/${req.files.files[x].name}`,
          function (err) {
            if (err) {
              const error = new Error(err);
              error.statusCode = 500;
              return next(error);
            }
          },
        );
        filesUploaded.push(
          `${process.env.BASE_URL}/${formattedPath}/${req.files.files[x].name}`,
        );
        let fileName = req.files.files[x].name;
        let pathString = req.body.path;
        pathString = pathString.split("/");
        pathString.shift();
        pathString = '"' + pathString.join("/") + "/" + fileName + '"';
        let query = `UPDATE ${DB_CONFIG.tableNames.archive}
                     SET ${req.body.column} = ${pathString}
                     WHERE archive_id = ${req.body.archive}`;
        db.query(query).catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
      }
    }
    res.send({ msg: "Success!", filesUploaded: filesUploaded });
  });

  db_router.post(
    "/createDirectory",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      const formattedPath =
        req.query.path === "" ? `resource/` : `resource/${req.query.path}`;
      const baseURL = path.join(__dirname, `../../${formattedPath}`);
      if (!fs.existsSync(baseURL)) {
        fs.mkdirSync(baseURL, { recursive: true });
        res.send({ msg: "Success!" });
      } else {
        const error = new Error("Directory already exists");
        error.statusCode = 500;
        return next(error);
      }
    },
  );

  db_router.post(
    "/renameDirectoryOrFile",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      const { oldPath, newPath } = req.query;
      const formattedOldPath =
        oldPath === "" ? `resource/` : `resource/${oldPath}`;
      const formattedNewPath =
        newPath === "" ? `resource/` : `resource/${newPath}`;
      const baseURLOld = path.join(__dirname, `../../${formattedOldPath}`);
      const baseURLNew = path.join(__dirname, `../../${formattedNewPath}`);

      // New path already exists, so we can't rename
      if (fs.existsSync(baseURLNew)) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      }
      // Copy all files from old directory to new directory
      if (fs.lstatSync(baseURLOld).isDirectory()) {
        fse.copySync(baseURLOld, baseURLNew);
        fs.rmdirSync(baseURLOld, { recursive: true });
        res.send({ msg: "Success!" });
        // Rename file
      } else if (fs.lstatSync(baseURLOld).isFile()) {
        fs.renameSync(baseURLOld, baseURLNew);
        res.send({ msg: "Success!" });
      }
    },
  );

  db_router.get("/getFiles", UserAuth.isAdmin, (req, res, next) => {
    let fileData = [];
    // This is the path with the specified directory we want to find files in.
    const formattedPath =
      req.query.path === "" ? `resource/` : `resource/${req.query.path}`;
    const baseURL = path.join(__dirname, `../../${formattedPath}`);

    if (fs.existsSync(baseURL)) {
      // Get the files in the directory
      fs.readdir(baseURL, function (err, files) {
        if (err) {
          console.error(`Error reading directory ${baseURL}:`, err);
          // Return empty array instead of throwing error for missing directories
          res.send(fileData);
          return;
        }

        try {
          const info = fs.statSync(baseURL);
          files.forEach(function (file) {
            try {
              // Only files have sizes, directories do not. Send file size if it is a file
              const fileInfo = fs.statSync(path.join(baseURL, file));
              if (fileInfo.isFile()) {
                fileData.push({
                  file: file,
                  size: fileInfo.size,
                  lastModified: fileInfo.ctime,
                });
              } else {
                fileData.push({
                  file: file,
                  size: 0,
                  lastModified: info.ctime,
                });
              }
            } catch (fileErr) {
              console.error(`Error processing file ${file}:`, fileErr);
              // Skip files that can't be processed
            }
          });
        } catch (statErr) {
          console.error(
            `Error getting directory stats for ${baseURL}:`,
            statErr,
          );
        }

        res.send(fileData);
      });
    } else {
      console.log(`Directory does not exist: ${baseURL}`);
      res.send(fileData);
    }
  });

  db_router.get("/getProjectFiles", (req, res, next) => {
    let fileData = [];
    // This is the path with the specified directory we want to find files in.
    const formattedPath = `resource/`;
    const baseURL = path.join(__dirname, `../../${formattedPath}`);
    fs.mkdirSync(baseURL, { recursive: true });
    // Get the files in the directory
    fs.readdir(baseURL, function (err, files) {
      if (err) {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      }
      const info = fs.statSync(baseURL);
      files.forEach(function (file) {
        // Only files have sizes, directories do not. Send file size if it is a file
        const fileInfo = fs.statSync(baseURL + file);
        if (fileInfo.isFile()) {
          fileData.push({
            file: file,
            size: fileInfo.size,
            lastModified: fileInfo.ctime,
          });
        } else {
          fileData.push({
            file: file,
            size: 0,
            lastModified: info.ctime,
          });
        }
      });
      res.send(fileData);
    });
  });

  db_router.get("/getProjectFiles", (req, res, next) => {
    let fileData = [];
    // This is the path with the specified directory we want to find files in.
    const formattedPath = `resource/`;
    const baseURL = path.join(__dirname, `../../${formattedPath}`);
    fs.mkdirSync(baseURL, { recursive: true });
    // Get the files in the directory
    fs.readdir(baseURL, function (err, files) {
      if (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      }
      const info = fs.statSync(baseURL);
      files.forEach(function (file) {
        // Only files have sizes, directories do not. Send file size if it is a file
        const fileInfo = fs.statSync(baseURL + file);
        if (fileInfo.isFile()) {
          fileData.push({
            file: file,
            size: fileInfo.size,
            lastModified: fileInfo.ctime,
          });
        } else {
          fileData.push({
            file: file,
            size: 0,
            lastModified: info.ctime,
          });
        }
      });
      res.send(fileData);
    });
  });

  db_router.delete(
    "/removeFile",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      const formattedPath = `resource/${req.query.path}`;
      const baseURL = path.join(__dirname, `../../${formattedPath}`);
      fs.unlink(baseURL, (err) => {
        if (err) {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        } else {
          res.send({ msg: "Success!" });
        }
      });
    },
  );

  db_router.delete(
    "/removeDirectory",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      const formattedPath = `resource/${req.query.path}`;
      const baseURL = path.join(__dirname, `../../${formattedPath}`);
      if (fs.existsSync(baseURL)) {
        fs.rmdirSync(baseURL, { recursive: true });
        return res.status(200).send({ msg: "Success!" });
      } else {
        const error = new Error("Directory does not exist, cannot delete");
        error.statusCode = 500;
        return next(error);
      }
    },
  );

  db_router.post(
    "/submitProposal",
    [
      // TODO: Should the max length be set to something smaller than 5000?
      body("title")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 })
        .withMessage("Title must be under 50 characters"),
      body("organization")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("primary_contact")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("contact_email")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("contact_phone")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("background_info")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("project_description")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("project_scope")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("project_challenges")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("sponsor_provided_resources")
        .trim()
        .escape()
        .isLength({ max: 5000 }),
      body("constraints_assumptions")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("sponsor_deliverables")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("proprietary_info").trim().escape().isLength({ max: 5000 }),
      body("sponsor_alternate_time").trim().escape().isLength({ max: 5000 }),
      body("sponsor_avail_checked")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("project_agreements_checked")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("assignment_of_rights")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
    ],
    async (req, res, next) => {
      let result = validationResult(req);

      if (result.errors.length !== 0) {
        const errorMessages = result.errors
          .map((error) => `${error.param}: ${error.msg}`)
          .join(", ");
        const error = new Error(`Validation failed: ${errorMessages}`);
        error.statusCode = 400;
        return next(error);
      }

      // Insert into the database
      let body = req.body;

      let date = new Date();
      let timeString = `${date.getFullYear()}-${date.getUTCMonth()}-${date.getDate()}`;
      const projectId = `${timeString}_${nanoid()}`;

      let filenamesCSV = "";
      // Attachment Handling
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

        const baseURL = path.join(
          __dirname,
          `../sponsor_proposal_files/${projectId}`,
        );

        fs.mkdirSync(baseURL, { recursive: true });

        for (let x = 0; x < req.files.attachments.length; x++) {
          if (req.files.attachments[x].size > 15 * 1024 * 1024) {
            // 15mb limit exceeded
            const error = new Error("File size limit exceeded");
            error.statusCode = 400;
            return next(error);
          }
          if (
            !CONFIG.accepted_file_types.includes(
              path.extname(req.files.attachments[x].name),
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
              ? `${req.files.attachments[x].name}`
              : `, ${req.files.attachments[x].name}`;

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
      const sql = `INSERT INTO ${DB_CONFIG.tableNames.senior_projects}
                (project_id, status, title, organization, primary_contact, contact_email, contact_phone, attachments,
                background_info, project_description, project_scope, project_challenges,
                sponsor_provided_resources, constraints_assumptions, sponsor_deliverables,
                proprietary_info, sponsor_alternate_time, sponsor_avail_checked, project_agreements_checked, assignment_of_rights)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      const params = [
        projectId,
        "submitted",
        body.title.substring(0, 50),
        body.organization,
        body.primary_contact,
        body.contact_email,
        body.contact_phone,
        filenamesCSV,
        body.background_info,
        body.project_description,
        body.project_scope,
        body.project_challenges,
        body.sponsor_provided_resources,
        body.constraints_assumptions,
        body.sponsor_deliverables,
        body.proprietary_info,
        body.sponsor_alternate_time,
        body.sponsor_avail_checked,
        body.project_agreements_checked,
        body.assignment_of_rights,
      ];

      db.query(sql, params)
        .then(() => {
          let doc = new PDFDoc();
          const baseURL = path.join(__dirname, `../proposal_docs/`);
          fs.mkdirSync(baseURL, { recursive: true });
          doc.pipe(fs.createWriteStream(`${baseURL}/${projectId}.pdf`));

          doc.font("Times-Roman");

          for (let key of Object.keys(DB_CONFIG.senior_project_proposal_keys)) {
            doc
              .fill("blue")
              .fontSize(16)
              .text(DB_CONFIG.senior_project_proposal_keys[key]),
              {
                underline: true,
              };
            doc
              .fontSize(12)
              .fill("black")
              .text(convert(he.decode(body[key] || ""))); // Text value from proposal
            doc.moveDown();
            doc.save();
          }

          doc.fill("blue").fontSize(16).text("Attachments"),
            {
              underline: true,
            };
          doc.fontSize(12).fill("black").text(filenamesCSV);
          doc.moveDown();
          doc.save();

          doc.end();
          return res.status(200).send();
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get("/getArchivePoster", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../resource/archivePosters/" + req.query.fileName,
      ),
    );
  });

  db_router.get("/getArchiveVideo", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../resource/archiveVideos/" + req.query.fileName,
      ),
    );
  });

  db_router.get("/getArchiveImage", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../resource/archiveImages/" + req.query.fileName,
      ),
    );
  });

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
          return db.query(
            `SELECT action_log_id FROM action_log
             WHERE action_template = ? AND system_id = ? AND project = ?
             ORDER BY action_log_id DESC LIMIT 1`,
            [body.action_template, req.user.system_id, body.project],
          );
        })
        .then((rows) => {
          const newActionLogId = rows && rows[0] ? rows[0].action_log_id : null;
          recordActionSubmissionCreateAudit(
            req,
            newActionLogId,
            action.action_id,
            action.action_title,
          );
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
    "/getTimeLogs",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      let getTimeLogQuery = "";
      let params = [];

      switch (req.user.type) {
        case ROLES.STUDENT:
          // NOTE: Technically, users are able to see if coaches submitted time logs to other projects, but they should not be able to see the actual submission content form this query so that should be fine
          //          This is because of the "OR users.type = '${ROLES.COACH}'" part of the following query.
          getTimeLogQuery = `SELECT time_log.time_log_id, time_log.submission_datetime, time_log.time_amount, time_log.system_id, time_log.mock_id, time_log.project, time_log.work_date, time_log.work_comment,time_log.active,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.system_id) name,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.mock_id) mock_name
                    FROM time_log
                        WHERE time_log.project = ?
                        ORDER BY
                        time_log.work_date DESC`;
          params = [req.user.project];
          break;
        case ROLES.COACH:
        case ROLES.ADMIN:
          getTimeLogQuery = `SELECT time_log.*,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.system_id) AS name,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.mock_id) AS mock_name
                    FROM time_log
                    WHERE time_log.project = ?`;
          params = [req.query.project_id];
          break;

        default:
          const error = new Error("Unknown Role");
          error.statusCode = 401;
          return next(error);
      }
      db.query(getTimeLogQuery, params)
        .then((values) => {
          res.send(values);
        })
        .catch((err) => {
          console.error(err);
          error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get(
    "/getAllTimeLogs",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { resultLimit, offset } = req.query;

      let getTimeLogQuery = "";
      let queryParams = [];
      let getTimeLogCount = "";
      let countParams = [];

      switch (req.user.type) {
        case ROLES.STUDENT:
          getTimeLogQuery = `SELECT time_log.*,
                        projects.display_name, projects.title,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.system_id) name,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.mock_id) mock_name
                    FROM time_log
                        JOIN projects ON projects.project_id = time_log.project
                        WHERE time_log.project = ?
                          ORDER BY
                        time_log.work_date DESC`;
          queryParams = [req.user.project];
          getTimeLogCount = `SELECT COUNT(*) FROM time_log
                    WHERE time_log.project = ?
                    AND time_log.system_id in (SELECT users.system_id FROM users WHERE users.project = ?)`;
          countParams = [req.user.project, req.user.project];
          break;
        case ROLES.COACH:
          getTimeLogQuery = `SELECT time_log.*,
                    projects.display_name, projects.title,
                    (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.system_id) name,
                    (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.mock_id) mock_name
                    FROM time_log
                        JOIN projects ON projects.project_id = time_log.project
                        WHERE time_log.project IN (SELECT project_id FROM project_coaches WHERE coach_id = ?)
                        ORDER BY time_log.work_date DESC`;
          queryParams = [req.user.system_id];
          getTimeLogCount = `SELECT COUNT(*) FROM time_log WHERE time_log.project IN (SELECT project_id FROM project_coaches WHERE coach_id = ?)`;
          countParams = [req.user.system_id];
          break;
        case ROLES.ADMIN:
          getTimeLogQuery = `SELECT time_log.*,
                projects.display_name, projects.title,
                (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.system_id) name,
                (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.mock_id) mock_name
                FROM time_log
                    JOIN projects ON projects.project_id = time_log.project
                    ORDER BY time_log.work_date DESC`;
          queryParams = [];
          getTimeLogCount = `SELECT COUNT(*) FROM time_log`;
          break;
        default:
          const error = new Error("Unknown Role");
          error.statusCode = 401;
          return next(error);
      }

      const timeLogsPromise = db.query(getTimeLogQuery, queryParams);
      const timeLogsCountPromise = db.query(getTimeLogCount, countParams);
      Promise.all([timeLogsCountPromise, timeLogsPromise])
        .then(([[timeLogCount], projects]) => {
          res.send({
            timeLogCount: timeLogCount[Object.keys(timeLogCount)[0]],
            timeLogs: projects,
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

  db_router.get(
    "/getAllSponsors",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { resultLimit, offset } = req.query;

      let getSponsorsQuery = "";
      let queryParams = [];
      let getSponsorsCount = "";

      switch (req.user.type) {
        case ROLES.STUDENT:
          break;
        case ROLES.COACH:
        case ROLES.ADMIN:
          getSponsorsQuery = `
                    SELECT *
                    FROM sponsors
                    ORDER BY
                        sponsors.company ASC,
                        sponsors.division ASC,
                        sponsors.fname ASC,
                        sponsors.lname ASC
                    LIMIT ?
                    OFFSET ?
                `;
          queryParams = [resultLimit || -1, offset || 0];
          getSponsorsCount = `SELECT COUNT(*) FROM sponsors`;
          break;
        default:
          const error = new Error("Unknown Role");
          error.statusCode = 401;
          return next(error);
      }

      const sponsorsPromise = db.query(getSponsorsQuery, queryParams);
      const SponsorsCountPromise = db.query(getSponsorsCount);
      Promise.all([SponsorsCountPromise, sponsorsPromise])
        .then(([[sponsorsCount], sponsorsRows]) => {
          res.send({
            sponsorsCount: sponsorsCount[Object.keys(sponsorsCount)[0]],
            sponsors: sponsorsRows,
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get("/getProjectSponsor", [UserAuth.isSignedIn], (req, res) => {
    let query = `SELECT * FROM sponsors
            WHERE sponsor_id = (SELECT sponsor FROM projects WHERE project_id = ?)`;

    params = [req.query.project_id];
    db.query(query, params).then((users) => res.send(users));
  });

  /**
   * This is for getting the archive data to view/edit based on a specific ID.
   * */
  db_router.get("/getArchiveProject", [UserAuth.isAdmin], (req, res) => {
    let query = `
            SELECT *
            FROM archive
            WHERE archive_id = ?
        `;

    const params = [req.query.archive_id];
    db.query(query, params).then((project) => res.send(project));
  });

  db_router.get(
    "/getSponsorProjects",
    [UserAuth.isCoachOrAdmin],
    (req, res) => {
      let query = `
            SELECT *
            FROM projects
            WHERE sponsor = ?
        `;

      const params = [req.query.sponsor_id];
      db.query(query, params).then((projects) => res.send(projects));
    },
  );

  db_router.get(
    "/getSponsorNotes",
    [UserAuth.isCoachOrAdmin],
    (req, res, next) => {
      let getSponsorNotesQuery = `
            SELECT sponsor_notes.*, 
                   users.fname, users.lname, users.email, users.type,
                   (SELECT users.fname || ' ' || users.lname FROM users WHERE users.system_id = sponsor_notes.mock_id) AS mock_name
            FROM sponsor_notes
            JOIN users
            ON users.system_id = sponsor_notes.author
            WHERE sponsor_notes.sponsor = ?
            ORDER BY creation_date
        `;

      const queryParams = [req.query.sponsor_id];

      db.query(getSponsorNotesQuery, queryParams)
        .then((sponsorNotes) => {
          res.send(sponsorNotes);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get("/getSubmission", [UserAuth.isSignedIn], (req, res, next) => {
    let getSubmissionQuery = "";
    let params = [];

    switch (req.user.type) {
      case ROLES.STUDENT:
        getSubmissionQuery = `SELECT action_log.form_data, action_log.files
                    FROM action_log
                    JOIN actions ON actions.action_id = action_log.action_template
                    WHERE action_log.action_log_id = ? AND (actions.action_target = '${ACTION_TARGETS.TEAM}' OR action_log.system_id = ?)`;
        params = [req.query.log_id, req.user.system_id];
        break;
      case ROLES.COACH:
        getSubmissionQuery = `SELECT action_log.form_data, action_log.files
                    FROM action_log
                    JOIN project_coaches ON project_coaches.project_id = action_log.project
                    WHERE action_log.action_log_id = ? AND project_coaches.coach_id = ?`;
        params = [req.query.log_id, req.user.system_id];
        break;
      case ROLES.ADMIN:
        getSubmissionQuery = `SELECT action_log.form_data, action_log.files
                    FROM action_log
                    WHERE action_log.action_log_id = ?`;
        params = [req.query.log_id];
        break;
      default:
        const error = new Error("Unknown Role");
        error.statusCode = 401;
        return next(error);
    }

    db.query(getSubmissionQuery, params)
      .then((submissions) => {
        res.send(submissions);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.get(
    "/getSubmissionFile",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      let getSubmissionQuery = "";
      let params = [];

      const submissionFileSelect = `
        SELECT action_log.files, action_log.project, action_log.system_id,
               action_log.submission_datetime,
               actions.action_id, actions.action_target, actions.action_title,
               COALESCE(projects.display_name, projects.title) AS project_name
        FROM action_log
        JOIN actions ON actions.action_id = action_log.action_template
        JOIN projects ON projects.project_id = action_log.project`;

      switch (req.user.type) {
        case ROLES.STUDENT:
          getSubmissionQuery = `${submissionFileSelect}
                    WHERE action_log.action_log_id = ? AND (actions.action_target = '${ACTION_TARGETS.TEAM}' OR action_log.system_id = ?)`;
          params = [req.query.log_id, req.user.system_id];
          break;
        case ROLES.COACH:
          getSubmissionQuery = `${submissionFileSelect}
                    JOIN project_coaches ON project_coaches.project_id = action_log.project
                    WHERE action_log.action_log_id = ? AND project_coaches.coach_id = ?`;
          params = [req.query.log_id, req.user.system_id];
          break;
        case ROLES.ADMIN:
          getSubmissionQuery = `${submissionFileSelect}
                    WHERE action_log.action_log_id = ?`;
          params = [req.query.log_id];
          break;
        default:
          const error = new Error("Unknown Role");
          error.statusCode = 401;
          return next(error);
      }

      const {
        files,
        project,
        action_target,
        system_id,
        action_id,
        action_title,
        project_name,
        submission_datetime,
      } = (await db.query(getSubmissionQuery, params))[0] || {};

      let fileList = [];
      if (files) {
        fileList = files.split(",");
      }

      if (
        fileList.includes(req.query.file) &&
        project &&
        action_target &&
        system_id &&
        action_id
      ) {
        return res.download(
          path.join(
            __dirname,
            `../project_docs/${project}/${action_target}/${action_id}/${system_id}/${req.query.file}`,
          ),
          buildSubmissionDownloadName({
            actionTitle: action_title,
            submissionDateTime: submission_datetime,
            projectName: project_name,
            submitterUserName: system_id,
            fileIndex: fileList.indexOf(req.query.file),
            originalFileName: req.query.file,
          }),
        );
      }
      const error = new Error(
        "File not found or you are unauthorized to view file",
      );
      error.statusCode = 404;
      return next(error);
    },
  );

  db_router.post(
    "/editAction",
    [UserAuth.isAdmin, UserAuth.canWrite, body("page_html").unescape()],
    (req, res, next) => {
      let body = req.body;

      let updateQuery = `
            UPDATE actions
            SET semester = ?,
                action_title = ?,
                action_target = ?,
                date_deleted = ?,
                short_desc = ?,
                start_date = ?,
                due_date = ?,
                page_html = ?,
                file_types = ?,
                file_size = ?
            WHERE action_id = ?
        `;

      const date_deleted =
        body.date_deleted === "false"
          ? dayjs().format(CONSTANTS.datetime_format)
          : "";
      const parsedFileSize = body.file_size
        ? fileSizeParser(body.file_size)
        : null;

      let params = [
        body.semester,
        body.action_title,
        body.action_target,
        date_deleted,
        body.short_desc,
        body.start_date,
        body.due_date,
        body.page_html,
        body.file_types,
        parsedFileSize,
        body.action_id,
      ];

      db.query(updateQuery, params)
        .then(() => {
          recordActionEditAudit(req, body);
          return res.status(200).send();
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  db_router.get(
    "/searchForSponsor",
    [UserAuth.isCoachOrAdmin, body("page_html").escape()],
    (req, res, next) => {
      const { resultLimit, offset, searchQuery } = req.query;

      let getSponsorsQuery = "";
      let queryParams = [];
      let getSponsorsCount = "";
      let sponsorCountParams = [];

      switch (req.user.type) {
        case ROLES.STUDENT:
          break;
        case ROLES.COACH:
        case ROLES.ADMIN:
          getSponsorsQuery = `
                    SELECT *
                    FROM sponsors
                    WHERE sponsors.OID NOT IN (
                        SELECT OID
                        FROM sponsors
                        WHERE
                              company LIKE ?
                            OR division LIKE ?
                            OR fname LIKE ?
                        OR lname LIKE ?
                        ORDER BY
                            company,
                            division,
                            fname,
                            lname
                        LIMIT ?
                        ) AND (
                                sponsors.company LIKE ?
                            OR sponsors.division LIKE ?
                            OR sponsors.fname LIKE ?
                            OR sponsors.lname LIKE ?
                        )
                    ORDER BY
                        sponsors.company,
                        sponsors.division,
                        sponsors.fname,
                        sponsors.lname
                    LIMIT ?
                `;
          getSponsorsCount = `SELECT COUNT(*)
                                    FROM sponsors
                                    WHERE
                                        company LIKE ?
                                       OR division LIKE ?
                                       OR fname LIKE ?
                                       OR lname LIKE ?
                                       `;
          const searchQueryParam = searchQuery || "";
          queryParams = [
            "%" + searchQueryParam + "%",
            "%" + searchQueryParam + "%",
            "%" + searchQueryParam + "%",
            "%" + searchQueryParam + "%",
            offset || 0,
            "%" + searchQueryParam + "%",
            "%" + searchQueryParam + "%",
            "%" + searchQueryParam + "%",
            "%" + searchQueryParam + "%",
            resultLimit || 0,
          ];
          sponsorCountParams = [
            "%" + searchQueryParam + "%",
            "%" + searchQueryParam + "%",
            "%" + searchQueryParam + "%",
            "%" + searchQueryParam + "%",
          ];

          break;
        default:
          const error = new Error("Unknown Role");
          error.statusCode = 401;
          return next(error);
      }

      const sponsorsPromise = db.query(getSponsorsQuery, queryParams);
      const SponsorsCountPromise = db.query(
        getSponsorsCount,
        sponsorCountParams,
      );
      Promise.all([SponsorsCountPromise, sponsorsPromise])
        .then(([[sponsorsCount], sponsorsRows]) => {
          res.send({
            sponsorsCount: sponsorsCount[Object.keys(sponsorsCount)[0]],
            sponsors: sponsorsRows,
          });
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    },
  );

  db_router.get("/searchForArchive", (req, res, next) => {
    const { resultLimit, offset, searchQuery, inactive } = req.query;
    let skipNum = offset * resultLimit;
    let getProjectsQuery = "";
    let queryParams = [];
    let getProjectsCount = "";
    let projectCountParams = [];

    // allow inactive projects in search
    if (inactive === "true") {
      getProjectsQuery = `SELECT * FROM  archive WHERE
                            archive.OID NOT IN (
                SELECT OID
                FROM archive
                WHERE title like ?
                   OR sponsor like ?
                   OR members like ?
                   OR coach like ?
                   OR keywords like ?
                   OR synopsis like ?
                   OR url_slug like ?
                ORDER BY title,
                         sponsor,
                         members,
                         coach,
                         keywords,
                         synopsis,
                         url_slug
            LIMIT ?
            ) AND (
                archive.title like ?
                OR archive.sponsor like ?
                OR archive.members like ?
                OR archive.coach like ?
                OR archive.keywords like ?
                OR archive.synopsis like ?
                OR archive.url_slug like ?
                )
            ORDER BY
                archive.title,
                archive.sponsor,
                archive.members,
                archive.coach,
                archive.keywords,
                archive.synopsis,
                archive.url_slug
            LIMIT ?`;

      getProjectsCount = `SELECT COUNT(*)
                            FROM archive
                            WHERE
                                title like ?
                                OR sponsor like ?
                                OR members like ?
                                OR coach like ?
                                OR keywords like ?
                                OR synopsis like ?
                                OR url_slug like ?
                                `;
    } else {
      getProjectsQuery = `SELECT * FROM  archive WHERE
                            archive.OID NOT IN (
                SELECT OID
                FROM archive
                WHERE title like ?
                   OR sponsor like ?
                   OR members like ?
                   OR coach like ?
                   OR keywords like ?
                   OR synopsis like ?
                   OR url_slug like ?
                   AND inactive = ''
                ORDER BY title,
                         sponsor,
                         members,
                         coach,
                         keywords,
                         synopsis,
                         url_slug
            LIMIT ?
            ) AND (
                archive.title like ?
                OR archive.sponsor like ?
                OR archive.members like ?
                OR archive.coach like ?
                OR archive.keywords like ?
                OR archive.synopsis like ?
                OR archive.url_slug like ?
                AND inactive = ''
                )
            ORDER BY
                archive.title,
                archive.sponsor,
                archive.members,
                archive.coach,
                archive.keywords,
                archive.synopsis,
                archive.url_slug
            LIMIT ?`;

      getProjectsCount = `SELECT COUNT(*)
                            FROM archive
                            WHERE
                                title like ?
                                OR sponsor like ?
                                OR members like ?
                                OR coach like ?
                                OR keywords like ?
                                OR synopsis like ?
                                OR url_slug like ?
                                AND (inactive = '' OR inactive IS NULL)
                                `;
    }

    const searchQueryParam = searchQuery || "";

    queryParams = [
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      skipNum || 0,
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      resultLimit || 0,
    ];
    projectCountParams = [
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
    ];

    const projectPromise = db.query(getProjectsQuery, queryParams);
    const projectCountPromise = db.query(getProjectsCount, projectCountParams);
    Promise.all([projectCountPromise, projectPromise])
      .then(([[projectCount], projectRows]) => {
        res.send({
          projectCount: projectCount[Object.keys(projectCount)[0]],
          projects: projectRows,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.get("/getArchiveFromSlug", (req, res, next) => {
    let query = `SELECT * FROM archive WHERE url_slug=?`;
    let params = [req.query.url_slug];
    db.query(query, params)
      .then((values) => {
        res.status(200).send(values);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.get("/getArchiveFromProject", (req, res) => {
    let query = `SELECT * FROM archive WHERE archive.project_id=?`;
    let params = [req.query.project_id];
    db.query(query, params)
      .then((values) => {
        res.status(200).send(values);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  db_router.post(
    "/createSponsor",
    [UserAuth.isCoachOrAdmin, UserAuth.canWrite, body("page_html").unescape()],
    (req, res, next) => {
      let body = req.body;

      let createSponsorQuery = `
            INSERT into sponsors(
                fname,
                lname,
                company,
                division,
                email,
                phone,
                association,
                type
            )
            values (?,?,?,?,?,?,?,?)
        `;

      let createSponsorParams = [
        body.fname,
        body.lname,
        body.company,
        body.division,
        body.email,
        body.phone,
        body.association,
        body.type,
      ];

      let createSponsorQueryPromise = db
        .query(createSponsorQuery, createSponsorParams)
        .then(() => {
          return lookupNewlyInsertedId(db, "sponsors", "sponsor_id", {
            fname: body.fname,
            lname: body.lname,
            company: body.company,
            email: body.email,
          }).then((newSponsorId) => [200, null, newSponsorId]);
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });

      let note_content = "Sponsor created by " + req.user.system_id;

      let createSponsorNoteParams = [
        note_content,
        body.sponsor_id,
        req.user.system_id,
        null,
      ];

      let createSponsorNotePromise = createSponsorNote(createSponsorNoteParams);

      Promise.all([createSponsorQueryPromise, createSponsorNotePromise]).then(
        ([
          [createSponsorQueryStatusCode, createSponsorError, newSponsorId],
          [createNoteStatusCode, createNoteError],
        ]) => {
          if (createSponsorError) {
            res.status(createSponsorQueryStatusCode).send(createSponsorError);
          } else if (createNoteError) {
            res.status(createNoteStatusCode).send(createNoteError);
          } else if (createSponsorQueryStatusCode !== createNoteStatusCode) {
            const error = new Error(
              "status code mismatch in editing sponsor, please contact an admin to investigate",
            );
            error.statusCode = 500;
            return next(error);
          } else {
            recordSponsorCreateAudit(req, body, newSponsorId);
            res.status(createSponsorQueryStatusCode).send();
          }
        },
      );
    },
  );

  db_router.post(
    "/editSponsor",
    [UserAuth.isCoachOrAdmin, UserAuth.canWrite, body("page_html").unescape()],
    (req, res, next) => {
      let body = req.body;

      let updateSponsorQuery = `
            UPDATE sponsors
            SET fname       = ?,
                lname       = ?,
                company     = ?,
                division    = ?,
                email       = ?,
                phone       = ?,
                association = ?,
                type        = ?,
                inActive    = ?,
                doNotEmail  = ?
            WHERE sponsor_id = ?
        `;

      /**
       * This is done so that the sponsors table boolean (int) columns can be updated correctly, without them working
       * against the existing code inside of DatabaseTableEditor.js
       **/
      let inActive = body.inActive === "true" || body.inActive === "1";
      let doNotEmail = body.doNotEmail === "true" || body.doNotEmail === "1";

      let updateSponsorParams = [
        body.fname,
        body.lname,
        body.company,
        body.division,
        body.email,
        body.phone,
        body.association,
        body.type,
        inActive,
        doNotEmail,
        body.sponsor_id,
      ];

      let updateQueryPromise = db
        .query(updateSponsorQuery, updateSponsorParams)
        .then(() => {
          return [200, null];
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });

      let changedFieldsMessageFirstPart = [];
      let changedFieldsMessageSecondPart = [];
      let changedFieldsMessageThirdPart = [];

      body.changed_fields = JSON.parse(body.changed_fields);

      for (const field of Object.keys(body.changed_fields)) {
        changedFieldsMessageFirstPart.push(field);
        changedFieldsMessageSecondPart.push(body.changed_fields[field][0]);
        changedFieldsMessageThirdPart.push(body.changed_fields[field][1]);
      }

      let note_content =
        "Fields: " +
        changedFieldsMessageFirstPart.join(", ") +
        " were changed from: " +
        changedFieldsMessageSecondPart.join(", ") +
        " to: " +
        changedFieldsMessageThirdPart.join(", ");

      let createSponsorNoteParams = [
        note_content,
        body.sponsor_id,
        req.user.system_id,
        null,
      ];

      let createSponsorNotePromise = createSponsorNote(createSponsorNoteParams);

      Promise.all([updateQueryPromise, createSponsorNotePromise]).then(
        ([
          [updateQueryStatusCode, updateSponsorError],
          [createNoteStatusCode, createNoteError],
        ]) => {
          if (updateSponsorError) {
            res.status(updateQueryStatusCode).send(updateSponsorError);
          } else if (createNoteError) {
            res.status(createNoteStatusCode).send(createNoteError);
          } else if (updateQueryStatusCode !== createNoteStatusCode) {
            const error = new Error(
              "status code mismatch in editing sponsor, please contact an admin to investigate",
            );
            error.statusCode = 500;
            return next(error);
          } else {
            recordSponsorEditAudit(req, body);
            res.status(updateQueryStatusCode).send();
          }
        },
      );
    },
  );

  async function createSponsorNote(queryParams) {
    let insertQuery = `
            INSERT into sponsor_notes
                (note_content, sponsor, author, mock_id, previous_note)
            values (?, ?, ?, ?, ?)`;

    let status = 500;
    let error = null;

    await db
      .query(insertQuery, queryParams)
      .then(() => {
        status = 200;
      })
      .catch((err) => {
        status = 500;
        error = err;
      });
    return [status, error];
  }

  db_router.post(
    "/createSponsorNote",
    [UserAuth.isCoachOrAdmin, UserAuth.canWrite, body("page_html").unescape()],
    (req, res, next) => {
      let body = req.body;
      let mock_id = req.user.mock ? req.user.mock.system_id : null;

      params = [
        body.note_content,
        body.sponsor_id,
        req.user.system_id,
        mock_id,
        body.previous_note,
      ];

      createSponsorNote(params).then(([status, err]) => {
        if (err) {
          const error = new Error(err);
          error.statusCode = status;
          return next(error);
        } else {
          db.query("SELECT fname, lname FROM sponsors WHERE sponsor_id = ?", [
            body.sponsor_id,
          ])
            .then((rows) => {
              const sponsorName =
                rows && rows[0]
                  ? `${rows[0].fname} ${rows[0].lname}`
                  : "Unknown";
              recordSponsorNoteCreateAudit(req, body, sponsorName);
            })
            .catch(() => {
              recordSponsorNoteCreateAudit(req, body, "Unknown");
            });
          res.status(status).send();
        }
      });
    },
  );

  db_router.post(
    "/createAction",
    [UserAuth.isAdmin, UserAuth.canWrite, body("page_html").unescape()],
    (req, res, next) => {
      let body = req.body;

      let updateQuery = `
            INSERT into actions
            (semester, action_title, action_target, date_deleted, short_desc, start_date, due_date, page_html, file_types, file_size)
            values (?,?,?,?,?,?,?,?,?,?)`;

      const date_deleted =
        body.date_deleted === "false"
          ? dayjs().format(CONSTANTS.datetime_format)
          : "";
      const parsedFileSize = body.file_size
        ? fileSizeParser(body.file_size)
        : null;

      let params = [
        body.semester,
        body.action_title,
        body.action_target,
        date_deleted,
        body.short_desc,
        body.start_date,
        body.due_date,
        body.page_html,
        body.file_types,
        parsedFileSize,
      ];

      db.query(updateQuery, params)
        .then(() => {
          return lookupNewlyInsertedId(db, "actions", "action_id", {
            semester: body.semester,
            action_title: body.action_title,
            start_date: body.start_date,
            due_date: body.due_date,
          });
        })
        .then((newActionId) => {
          recordActionCreateAudit(req, body, newActionId);
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
    "/duplicateSemesterActions",
    [UserAuth.isAdmin, UserAuth.canWrite],
    async (req, res, next) => {
      const {
        sourceSemester,
        targetSemester,
        offsetDays = 0,
        actionIds,
      } = req.body;

      if (!sourceSemester || !targetSemester) {
        return res.status(400).send("Missing semesters.");
      }

      try {
        let query = `
          SELECT *
          FROM actions
          WHERE semester = ?
        `;

        let params = [sourceSemester];

        // Optional checkbox support
        if (actionIds && actionIds.length > 0) {
          query += ` AND action_id IN (${actionIds.map(() => "?").join(",")})`;
          params.push(...actionIds);
        }

        const actions = await db.query(query, params);

        for (const action of actions) {
          await db.query(
            `
            INSERT INTO actions
            (
              semester,
              action_title,
              action_target,
              date_deleted,
              short_desc,
              start_date,
              due_date,
              page_html,
              file_types,
              file_size
            )
            VALUES
            (?, ?, ?, ?, ?, DATE_ADD(?, INTERVAL ? DAY),
                DATE_ADD(?, INTERVAL ? DAY),
                ?, ?, ?)
          `,
            [
              targetSemester,
              action.action_title,
              action.action_target,
              action.date_deleted,
              action.short_desc,
              action.start_date,
              offsetDays,
              action.due_date,
              offsetDays,
              action.page_html,
              action.file_types,
              action.file_size,
            ],
          );
        }

        res.json({
          copied: actions.length,
        });
      } catch (err) {
        next(err);
      }
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
    "/getSemesterActions",
    [UserAuth.isSignedIn],
    (req, res, next) => {
      const semester = req.query.semester;

      if (!semester) {
        return res.status(400).send("Missing semester");
      }

      db.query(
        `
      SELECT *
      FROM actions
      WHERE semester = ?
      ORDER BY start_date
      `,
        [semester],
      )
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
    "/duplicateActions",
    [UserAuth.isAdmin],
    async (req, res, next) => {
      const { actions, source_semester, target_semester, day_offset } =
        req.body;

      if (!actions || !target_semester || !source_semester) {
        return res.status(400).send("Missing required fields");
      }

      const parsedActions = JSON.parse(actions);
      const offset = parseInt(day_offset) || 0;
      const MS_PER_DAY = 24 * 60 * 60 * 1000;

      try {
        const semesterResults = await db.query(
          `
      SELECT semester_id, start_date
      FROM semester_group
      WHERE semester_id IN (?, ?)
      `,
          [source_semester, target_semester],
        );

        const sourceSem = semesterResults.find(
          (s) => s.semester_id == source_semester,
        );

        const targetSem = semesterResults.find(
          (s) => s.semester_id == target_semester,
        );

        if (!sourceSem || !targetSem) {
          return res.status(400).send("Semester not found");
        }

        const sourceStart = new Date(sourceSem.start_date);
        const targetStart = new Date(targetSem.start_date);

        for (const action of parsedActions) {
          // Calculate start_date relative to source semester start
          let startDate = null;
          if (action.start_date) {
            const originalStart = new Date(action.start_date);
            const daysFromStart = Math.round(
              (originalStart - sourceStart) / MS_PER_DAY,
            );
            startDate = new Date(
              targetStart.getTime() + (daysFromStart + offset) * MS_PER_DAY,
            )
              .toISOString()
              .split("T")[0];
          }

          // Calculate due_date relative to source semester start
          let dueDate = null;
          if (action.due_date) {
            const originalDue = new Date(action.due_date);

            const daysFromStart = Math.round(
              (originalDue - sourceStart) / MS_PER_DAY,
            );

            dueDate = new Date(
              targetStart.getTime() + (daysFromStart + offset) * MS_PER_DAY,
            )
              .toISOString()
              .split("T")[0];
          }

          await db.query(
            `INSERT INTO actions (
          action_title, short_desc, page_html, action_target,
          start_date, due_date, semester, file_types, file_size
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              action.action_title,
              action.short_desc,
              action.page_html,
              action.action_target,
              startDate,
              dueDate,
              target_semester,
              action.file_types || null,
              action.file_size || null,
            ],
          );
        }

        res.status(200).send("Actions duplicated successfully");
      } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      }
    },
  );

  db_router.get("/getArchive", [UserAuth.isAdmin], (req, res, next) => {
    let getArchiveQuery = `
            SELECT *
            FROM archive`;
    db.query(getArchiveQuery)
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
          recordSemesterEditAudit(req, body);
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
          return lookupNewlyInsertedId(db, "semester_group", "semester_id", {
            name: body.name,
            dept: body.dept,
            start_date: body.start_date,
            end_date: body.end_date,
          });
        })
        .then((newSemesterId) => {
          recordSemesterCreateAudit(req, body, newSemesterId);
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
