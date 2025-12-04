const moment = require("moment");
const fileSizeParser = require("filesize-parser");

/**
 * Create a new action
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
 * Edit an existing action
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
  createAction,
  editAction,
};
