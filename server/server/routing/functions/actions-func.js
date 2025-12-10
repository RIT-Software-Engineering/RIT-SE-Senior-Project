const moment = require("moment");
const fileSizeParser = require("filesize-parser");
const path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");
const { ROLES } = require("../consts");
const ACTION_TARGETS = {
  ADMIN: "admin",
  COACH: "coach",
  INDIVIDUAL: "individual",
  TEAM: "team",
  PEER_EVALUATION: "peer_evaluation",
  COACH_ANNOUNCEMENT: "coach_announcement",
  STUDENT_ANNOUNCEMENT: "student_announcement",
};

const defaultFileSizeLimit = 15 * 1024 * 1024;

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

/**
 * Get all actions
 */
const getActions = (db) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM actions ORDER BY action_id desc`;
    db.query(query)
      .then((values) => {
        resolve(values);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get timeline actions for a project
 */
const getTimelineActions = (db, projectId, user) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT action_title, action_id, start_date, due_date, semester, action_target, date_deleted, short_desc, file_types, file_size, page_html,
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

    if (user.type === ROLES.STUDENT && projectId !== user.project) {
      reject(new Error("trying to acces project that is not yours"));
      return;
    }

    db.query(query, [projectId, projectId, projectId, projectId, projectId])
      .then((values) => {
        resolve(values);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get late submission info for an action log
 */
const getLateSubmission = (db, logId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT actions.due_date
                   FROM action_log
                   JOIN actions ON actions.action_id = action_log.action_template
                   WHERE action_log.action_log_id = ?`;

    db.query(query, [logId])
      .then((values) => {
        resolve(values);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get action logs for a specific action
 */
const getActionLogs = (db, user, actionId, projectId) => {
  return new Promise((resolve, reject) => {
    let query = "";
    let params = [];

    switch (user.type) {
      case ROLES.STUDENT:
        query = `SELECT action_log.action_log_id, action_log.submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id, action_log.project,
                        actions.action_title, actions.due_date,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) name,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) mock_name,
                        (SELECT users.type FROM users WHERE users.system_id = action_log.system_id) AS user_type,
                        (SELECT users.type FROM users WHERE users.system_id = action_log.mock_id) AS mock_type
                    FROM action_log
                        JOIN actions ON actions.action_id = action_log.action_template
                        WHERE action_log.action_template = ? AND action_log.project = ?`;
        params = [actionId, user.project];
        break;
      case ROLES.COACH:
      case ROLES.ADMIN:
        query = `SELECT action_log.*, actions.action_title, actions.due_date,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) AS name,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) AS mock_name,
                        (SELECT users.type FROM users WHERE users.system_id = action_log.system_id) AS user_type,
                        (SELECT users.type FROM users WHERE users.system_id = action_log.mock_id) AS mock_type
                    FROM action_log
                    JOIN actions ON actions.action_id = action_log.action_template
                    WHERE action_log.action_template = ? AND action_log.project = ?`;
        params = [actionId, projectId];
        break;

      default:
        reject(new Error("Unknown Role"));
        return;
    }

    db.query(query, params)
      .then((values) => {
        resolve(values);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all action logs with pagination
 */
const getAllActionLogs = (db, user, resultLimit, offset) => {
  return new Promise((resolve, reject) => {
    let query = "";
    let queryParams = [];
    let countQuery = "";
    let countParams = [];

    switch (user.type) {
      case ROLES.STUDENT:
        query = `SELECT action_log.action_log_id, action_log.submission_datetime AS submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id,  action_log.project,
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
        queryParams = [user.project, resultLimit, offset * resultLimit];
        countQuery = `SELECT COUNT(*) FROM action_log
              JOIN actions ON actions.action_id = action_log.action_template
              WHERE action_log.project = ?
              AND action_log.system_id in (SELECT users.system_id FROM users WHERE users.project = ?)`;
        countParams = [user.project, user.project];
        break;
      case ROLES.COACH:
        query = `SELECT action_log.action_log_id, action_log.submission_datetime AS submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id,  action_log.project,
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
        queryParams = [user.system_id, resultLimit, offset * resultLimit];
        countQuery = `SELECT COUNT(*) FROM action_log WHERE action_log.project IN (SELECT project_id FROM project_coaches WHERE coach_id = ?)`;
        countParams = [user.system_id];
        break;
      case ROLES.ADMIN:
        query = `SELECT action_log.action_log_id, action_log.submission_datetime AS submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id,  action_log.project,
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
        countQuery = `SELECT COUNT(*) FROM action_log`;
        break;
      default:
        reject(new Error("Unknown Role"));
        return;
    }

    const actionLogsPromise = db.query(query, queryParams);
    const actionLogsCountPromise = db.query(countQuery, countParams);

    Promise.all([actionLogsCountPromise, actionLogsPromise])
      .then(([[actionLogCount], actionLogs]) => {
        resolve({
          actionLogCount: actionLogCount[Object.keys(actionLogCount)[0]],
          actionLogs: actionLogs,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Submit an action with file attachments
 */
const submitAction = (db, user, body, files, __dirname) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `SELECT * FROM actions WHERE action_id = ?;`;
      const [action] = await db.query(query, [body.action_template]);

      const startDate = new Date(action.start_date);
      if (startDate > Date.now()) {
        reject(new Error("Action start date is in the future"));
        return;
      }

      // Validate action target
      switch (action.action_target) {
        case ACTION_TARGETS.ADMIN:
          if (user.type !== ROLES.ADMIN) {
            reject(new Error("Only admins can submit admin actions"));
            return;
          }
          break;
        case ACTION_TARGETS.COACH:
          if (user.type !== ROLES.COACH && user.type !== ROLES.ADMIN) {
            reject(new Error("Only coaches can submit coach actions"));
            return;
          }
          break;
        case ACTION_TARGETS.INDIVIDUAL:
          if (user.type !== ROLES.STUDENT) {
            reject(new Error("Only students can submit individual actions"));
            return;
          }
          break;
        case ACTION_TARGETS.PEER_EVALUATION:
          if (user.type !== ROLES.COACH && user.type !== ROLES.STUDENT) {
            reject(
              new Error(
                "Only coaches and students can submit peer evaluations",
              ),
            );
            return;
          }
          break;
        case ACTION_TARGETS.COACH_ANNOUNCEMENT:
        case ACTION_TARGETS.STUDENT_ANNOUNCEMENT:
          reject(new Error("You cannot submit an announcement"));
          return;
        case ACTION_TARGETS.TEAM:
          // Anyone can submit team actions
          break;
        default:
          reject(new Error("Invalid action target"));
          return;
      }

      let date = new Date();
      let timeString = `${date.getFullYear()}-${date.getUTCMonth()}-${date.getDate()}`;
      const submission = `${timeString}_${nanoid()}`;

      let baseURL = path.join(
        __dirname,
        `../project_docs/${body.project}/${action.action_target}/${action.action_id}/${user.system_id}/${submission}`,
      );

      // Attachment Handling
      let filenamesCSV = "";
      if (files && files.attachments) {
        // If there is only one attachment, then it does not come as a list
        if (files.attachments.length === undefined) {
          files.attachments = [files.attachments];
        }

        if (files.attachments.length > 5) {
          // Don't allow more than 5 files
          reject(new Error("Maximum of 5 files allowed"));
          return;
        }

        fs.mkdirSync(baseURL, { recursive: true });

        for (let x = 0; x < files.attachments.length; x++) {
          if (
            files.attachments[x].size >
            (action.file_size || defaultFileSizeLimit)
          ) {
            // 15mb limit exceeded
            const responseText =
              "File exceeded submission size limit of: " +
              humanFileSize(action.file_size || defaultFileSizeLimit, false, 0);
            reject(new Error(responseText));
            return;
          }
          if (
            !action.file_types
              .split(",")
              .includes(
                path.extname(files.attachments[x].name).toLocaleLowerCase(),
              )
          ) {
            // send an error if the file is not an accepted type
            reject(new Error("file type not accepted"));
            return;
          }

          // Append the file name to the CSV string, begin with a comma if x is not 0
          filenamesCSV +=
            x === 0
              ? `${submission}/${files.attachments[x].name}`
              : `,${submission}/${files.attachments[x].name}`;

          files.attachments[x].mv(
            `${baseURL}/${files.attachments[x].name}`,
            function (err) {
              if (err) {
                reject(err);
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
                ${(user.mock && ",mock_id") || ""}
                )
            VALUES (?,?,?,?,?${(user.mock && ",?") || ""})
        `;

      let params = [
        body.action_template,
        user.system_id,
        body.project,
        body.form_data,
        filenamesCSV,
      ];
      if (user.mock) {
        params.push(user.mock.system_id);
      }

      db.query(insertAction, params)
        .then(() => {
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Get coach feedback for a project
 */
const getCoachFeedback = (db, projectId) => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT form_data, a.action_title as title, a.start_date as date, a.action_id, submission_datetime
            FROM action_log
            JOIN main.users u on action_log.system_id = u.system_id
            JOIN main.actions a on action_log.action_template = a.action_id
            WHERE action_log.project = ?  AND u.type = 'coach'
        `;

    db.query(query, [projectId])
      .then((feedback) => {
        resolve(feedback);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Create a new action template
 */
const createAction = (db, body) => {
  return new Promise((resolve, reject) => {
    let updateQuery = `
      INSERT into actions
      (semester, action_title, action_target, date_deleted, short_desc, start_date, due_date, page_html, file_types, file_size)
      values (?,?,?,?,?,?,?,?,?,?)`;

    const date_deleted =
      body.date_deleted === "false"
        ? moment().format("YYYY-MM-DD HH:mm:ss")
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
        resolve({ success: true });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Edit an existing action template
 */
const editAction = (db, body) => {
  return new Promise((resolve, reject) => {
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
        ? moment().format("YYYY-MM-DD HH:mm:ss")
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
        resolve({ success: true });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  getActions,
  getTimelineActions,
  getLateSubmission,
  getActionLogs,
  getAllActionLogs,
  submitAction,
  getCoachFeedback,
  createAction,
  editAction,
};
