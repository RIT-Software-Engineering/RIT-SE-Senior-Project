const moment = require("moment");
const CONSTANTS = require("../consts");
const { ROLES } = require("../consts");

/**
 * Get average time logged per user for a project
 */
const avgTime = (db, projectId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT ROUND(AVG(CASE WHEN active != 0 THEN time_amount ELSE NULL END), 2) AS avgTime, system_id FROM time_log WHERE project = ? GROUP BY system_id";

    db.query(sql, [projectId])
      .then((time) => {
        resolve(time);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Create a new time log entry
 */
const createTimeLog = (db, user, body) => {
  return new Promise((resolve, reject) => {
    // Validate that the work date is not in the future
    const workDate = new Date(body.date);
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
      reject(new Error("Cannot log time for future dates"));
      return;
    }

    // Validate that the work date is within the past 14 days
    const twoWeeksAgo = new Date(currentDateOnly);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    if (workDateOnly < twoWeeksAgo) {
      reject(new Error("Cannot log time for dates older than 14 days"));
      return;
    }

    let mock_id = user.mock ? user.mock.system_id : "";

    const sql = `INSERT INTO time_log
      (semester, system_id, project, mock_id, work_date, time_amount, work_comment)
      VALUES (?,?,?,?,?,?,?)`;

    const params = [
      user.semester_group,
      user.system_id,
      user.project,
      mock_id,
      body.date,
      body.time_amount,
      body.comment,
    ];

    db.query(sql, params)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Remove a time log entry
 */
const removeTime = (db, timeLogId) => {
  return new Promise((resolve, reject) => {
    if (!timeLogId) {
      reject(new Error("No Id Provided"));
      return;
    }

    const sql = "UPDATE time_log SET active=0 WHERE time_log_id = ?";

    db.query(sql, [timeLogId])
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get time logs for a project based on user role
 */
const getTimeLogs = (db, user, projectId) => {
  return new Promise((resolve, reject) => {
    let getTimeLogQuery = "";
    let params = [];

    switch (user.type) {
      case ROLES.STUDENT:
        getTimeLogQuery = `SELECT time_log.time_log_id, time_log.submission_datetime, time_log.time_amount, time_log.system_id, time_log.mock_id, time_log.project, time_log.work_date, time_log.work_comment,time_log.active,
          (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.system_id) name,
          (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.mock_id) mock_name
          FROM time_log
          WHERE time_log.project = ?
          ORDER BY time_log.work_date DESC`;
        params = [user.project];
        break;
      case ROLES.COACH:
      case ROLES.ADMIN:
        getTimeLogQuery = `SELECT time_log.*,
          (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.system_id) AS name,
          (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.mock_id) AS mock_name
          FROM time_log
          WHERE time_log.project = ?`;
        params = [projectId];
        break;

      default:
        reject(new Error("Unknown Role"));
        return;
    }

    db.query(getTimeLogQuery, params)
      .then((values) => {
        resolve(values);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all time logs with pagination
 */
const getAllTimeLogs = (db, user, resultLimit, offset) => {
  return new Promise((resolve, reject) => {
    let getTimeLogQuery = "";
    let queryParams = [];
    let getTimeLogCount = "";
    let countParams = [];

    switch (user.type) {
      case ROLES.STUDENT:
        getTimeLogQuery = `SELECT time_log.*,
          projects.display_name, projects.title,
          (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.system_id) name,
          (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.mock_id) mock_name
          FROM time_log
          JOIN projects ON projects.project_id = time_log.project
          WHERE time_log.project = ?
          ORDER BY time_log.work_date DESC`;
        queryParams = [user.project];
        getTimeLogCount = `SELECT COUNT(*) FROM time_log
          WHERE time_log.project = ?
          AND time_log.system_id in (SELECT users.system_id FROM users WHERE users.project = ?)`;
        countParams = [user.project, user.project];
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
        queryParams = [user.system_id];
        getTimeLogCount = `SELECT COUNT(*) FROM time_log WHERE time_log.project IN (SELECT project_id FROM project_coaches WHERE coach_id = ?)`;
        countParams = [user.system_id];
        break;
      case ROLES.ADMIN:
        getTimeLogQuery = `SELECT time_log.*,
          projects.display_name, projects.title,
          (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.system_id) name,
          (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = time_log.mock_id) mock_name
          FROM time_log
          JOIN projects ON projects.project_id = time_log.project
          ORDER BY time_log.work_date DESC`;
        queryParams = [resultLimit, offset * resultLimit];
        getTimeLogCount = `SELECT COUNT(*) FROM time_log`;
        countParams = [];
        break;
      default:
        reject(new Error("Unknown Role"));
        return;
    }

    queryParams.push(resultLimit, offset * resultLimit);

    const timeLogsPromise = db.query(getTimeLogQuery, queryParams);
    const timeLogsCountPromise = db.query(getTimeLogCount, countParams);

    Promise.all([timeLogsCountPromise, timeLogsPromise])
      .then(([[timeLogCount], timeLogs]) => {
        resolve({
          timeLogCount: timeLogCount[Object.keys(timeLogCount)[0]],
          timeLogs: timeLogs,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  avgTime,
  createTimeLog,
  removeTime,
  getTimeLogs,
  getAllTimeLogs,
};
