const express = require("express");
const router = express.Router();
const UserAuth = require("../user_auth");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const DB_CONFIG = require("../database/db_config");

module.exports = (db) => {
  router.get("/selectAllSponsorInfo", [UserAuth.isCoachOrAdmin], (req, res) => {
    db.selectAll(DB_CONFIG.tableNames.sponsor_info).then(function (value) {
      res.send(value);
    });
  });

  router.get("/getSponsorData", UserAuth.isAdmin, (req, res, next) => {
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

  router.post(
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
          return [200, null];
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
          [createSponsorQueryStatusCode, createSponsorError],
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
            res.status(createSponsorQueryStatusCode).send();
          }
        },
      );
    },
  );

  router.post(
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

  router.post(
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
          res.status(status).send();
        }
      });
    },
  );

  router.get(
    "/getAllSponsors",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { resultLimit, offset } = req.query;

      let getSponsorsQuery = "";
      let queryParams = [];
      let getSponsorsCount = "";

      switch (req.user.type) {
        case "student":
          break;
        case "coach":
        case "admin":
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

  router.get("/getProjectSponsor", [UserAuth.isSignedIn], (req, res) => {
    let query = `SELECT * FROM sponsors
            WHERE sponsor_id = (SELECT sponsor FROM projects WHERE project_id = ?)`;

    params = [req.query.project_id];
    db.query(query, params).then((users) => res.send(users));
  });

  router.get("/getSponsorProjects", [UserAuth.isCoachOrAdmin], (req, res) => {
    let query = `
            SELECT *
            FROM projects
            WHERE sponsor = ?
        `;

    const params = [req.query.sponsor_id];
    db.query(query, params).then((projects) => res.send(projects));
  });

  router.get(
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

  router.get(
    "/searchForSponsor",
    [UserAuth.isCoachOrAdmin, body("page_html").escape()],
    (req, res, next) => {
      const { resultLimit, offset, searchQuery } = req.query;

      let getSponsorsQuery = "";
      let queryParams = [];
      let getSponsorsCount = "";
      let sponsorCountParams = [];

      switch (req.user.type) {
        case "student":
          break;
        case "coach":
        case "admin":
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

  return router;
};
