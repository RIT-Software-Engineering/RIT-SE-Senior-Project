const DB_CONFIG = require("../database/db_config");

/**
 * Get all error logs with pagination
 */
const getErrorLogs = (db, resultLimit, offset) => {
  return new Promise((resolve, reject) => {
    let skipNum = offset * resultLimit;
    let logsQuery = `SELECT * FROM ${DB_CONFIG.tableNames.action_log} ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
    let countQuery = `SELECT COUNT(*) FROM ${DB_CONFIG.tableNames.action_log}`;

    const logsPromise = db.query(logsQuery, [resultLimit, skipNum]);
    const countPromise = db.query(countQuery);

    Promise.all([countPromise, logsPromise])
      .then(([[count], logs]) => {
        resolve({
          totalLogs: count[Object.keys(count)[0]],
          logs: logs,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  getErrorLogs,
};
