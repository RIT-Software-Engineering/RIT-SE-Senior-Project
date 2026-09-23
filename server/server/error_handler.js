// This is a general purpose error handler for the backend,
// when the backend encounters errors this handler redirects to an error page where necessary next steps can be taken.

const DBHandler = require("./database/db");
const DB_CONFIG = require("./database/db_config");
let db = new DBHandler();

function errorHandler(err, req, res, next) {
  console.error("\n CAUGHT ERROR: ", err, "\n");
  // Send the error to the client so that error can be displayed on error page

  if (!err.statusCode) err.statusCode = 500;
  if (!err.message) err.message = "Internal Server Error";

  let error_sql = `
        INSERT INTO ${DB_CONFIG.tableNames.error_log} 
          (error_datetime, status_code, user_role, url, stack_trace)
        VALUES (datetime('now'), ?, ?, ?, ?);
    `;

  let values = [
    err.statusCode,
    req.user ? req.user.type : "unknown",
    req.url,
    err.stack ? err.stack : "no stack trace",
  ];

  db.query(error_sql, values);

  res.status(err.statusCode).json({
    error: err.message,
    statusCode: err.statusCode,
    user_role: req.user.type,
    url: req.url,
    timestamp: Date(Date.now()).toString(),
    componentStack: err.stack ? err.stack : undefined, // Normally sending the stack trace to the frontend is not good practice
  });
}

module.exports = errorHandler;
