const express = require("express");
const router = express.Router();
const UserAuth = require("../user_auth");
const { body, validationResult } = require("express-validator");
const { createAction, editAction } = require("../functions/actions-func");

module.exports = (db) => {
  router.post(
    "/createAction",
    [UserAuth.isAdmin, UserAuth.canWrite, body("page_html").unescape()],
    (req, res, next) => {
      createAction(db, req.body)
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
      editAction(db, req.body)
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
