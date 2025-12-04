const express = require("express");
const router = express.Router();
const UserAuth = require("../user_auth");
const { body, validationResult } = require("express-validator");
const {
  createSponsor,
  editSponsor,
  createSponsorNote,
  getAllSponsors,
  getProjectSponsor,
  getSponsorProjects,
  getSponsorNotes,
  searchForSponsor,
  selectAllSponsorInfo,
  getSponsorData,
} = require("../db_ind_routes_func/sponsors-func");

module.exports = (db) => {
  router.get("/selectAllSponsorInfo", [UserAuth.isCoachOrAdmin], (req, res) => {
    selectAllSponsorInfo(db)
      .then((value) => {
        res.send(value);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  router.get("/getSponsorData", UserAuth.isAdmin, (req, res, next) => {
    getSponsorData(db)
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

      createSponsor(db, body)
        .then(() => {
          let note_content = "Sponsor created by " + req.user.system_id;
          return createSponsorNote(db, {
            note_content,
            sponsor_id: body.sponsor_id,
            author: req.user.system_id,
            mock_id: req.user.mock ? req.user.mock.system_id : null,
            previous_note: null,
          });
        })
        .then(() => {
          res.status(200).send();
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.post(
    "/editSponsor",
    [UserAuth.isCoachOrAdmin, UserAuth.canWrite, body("page_html").unescape()],
    (req, res, next) => {
      let body = req.body;

      editSponsor(db, body)
        .then(() => {
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

          return createSponsorNote(db, {
            note_content,
            sponsor_id: body.sponsor_id,
            author: req.user.system_id,
            mock_id: req.user.mock ? req.user.mock.system_id : null,
            previous_note: null,
          });
        })
        .then(() => {
          res.status(200).send();
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.post(
    "/createSponsorNote",
    [UserAuth.isCoachOrAdmin, UserAuth.canWrite, body("page_html").unescape()],
    (req, res, next) => {
      let body = req.body;
      let mock_id = req.user.mock ? req.user.mock.system_id : null;

      createSponsorNote(db, {
        note_content: body.note_content,
        sponsor_id: body.sponsor_id,
        author: req.user.system_id,
        mock_id: mock_id,
        previous_note: body.previous_note,
      })
        .then(() => {
          res.status(200).send();
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get("/getAllSponsors", [UserAuth.isSignedIn], (req, res, next) => {
    const { resultLimit, offset } = req.query;

    getAllSponsors(db, req.user.type, resultLimit, offset)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  router.get("/getProjectSponsor", [UserAuth.isSignedIn], (req, res) => {
    getProjectSponsor(db, req.query.project_id)
      .then((users) => {
        res.send(users);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  router.get("/getSponsorProjects", [UserAuth.isCoachOrAdmin], (req, res) => {
    getSponsorProjects(db, req.query.sponsor_id)
      .then((projects) => {
        res.send(projects);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  router.get(
    "/getSponsorNotes",
    [UserAuth.isCoachOrAdmin],
    (req, res, next) => {
      getSponsorNotes(db, req.query.sponsor_id)
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

      searchForSponsor(db, req.user.type, resultLimit, offset, searchQuery)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    },
  );

  return router;
};
