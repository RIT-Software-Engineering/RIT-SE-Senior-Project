const express = require("express");
const router = express.Router();

const moment = require("moment");
const path = require("path");
const fs = require("fs");
const { body } = require("express-validator");
const DB_CONFIG = require("../database/db_config");
const CONSTANTS = require("../consts");

module.exports = (db) => {
  router.post(
    "/createArchive",
    [
      require("../user_auth").isAdmin,
      require("../user_auth").canWrite,
      body("featured")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
    ],
    async (req, res, next) => {
      let body = req.body;
      const inactive =
        body.inactive === "true"
          ? moment().format(CONSTANTS.datetime_format)
          : "";
      const locked =
        body.locked === "true"
          ? req.user.fname +
            " " +
            req.user.lname +
            " locked at " +
            moment().format(CONSTANTS.datetime_format)
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
          return res.status(200).send(response);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  return router;
};
