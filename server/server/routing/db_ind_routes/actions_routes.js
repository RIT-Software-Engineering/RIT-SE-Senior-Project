const express = require("express");
const router = express.Router();
const UserAuth = require("../user_auth");
const { body, validationResult } = require("express-validator");
const moment = require("moment");
const fileSizeParser = require("filesize-parser");
const DB_CONFIG = require("../database/db_config");

module.exports = (db) => {
  router.post(
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
          return res.status(200).send();
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.post(
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
          return res.status(200).send();
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  return router;
};
