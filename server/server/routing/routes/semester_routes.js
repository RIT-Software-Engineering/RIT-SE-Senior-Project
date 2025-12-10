const express = require("express");
const router = express.Router();
const UserAuth = require("../user_auth");
const { body, validationResult } = require("express-validator");
const {
  getSemesters,
  getSemesterAnnouncements,
  editSemester,
  createSemester,
} = require("../functions/semester-func");

module.exports = (db) => {
  // Get all semesters
  router.get("/getSemesters", [UserAuth.isSignedIn], (req, res, next) => {
    getSemesters(db)
      .then((values) => {
        res.send(values);
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get semester announcements
  router.get(
    "/getSemesterAnnouncements",
    [UserAuth.isSignedIn],
    (req, res, next) => {
      getSemesterAnnouncements(db, req.user, req.query.semester)
        .then((values) => {
          res.send(values);
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = err.statusCode || 500;
          return next(error);
        });
    },
  );

  // Edit an existing semester
  router.post(
    "/editSemester",
    [UserAuth.isAdmin, UserAuth.canWrite, body("*").trim()],
    (req, res, next) => {
      editSemester(db, req.body)
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

  // Create a new semester
  router.post(
    "/createSemester",
    [
      UserAuth.isAdmin,
      UserAuth.canWrite,
      body("name")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("dept")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("start_date")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("end_date")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
    ],
    (req, res, next) => {
      let result = validationResult(req);

      if (result.errors.length !== 0) {
        const errorMessages = result.errors
          .map((error) => `${error.param}: ${error.msg}`)
          .join(", ");
        const error = new Error(`Error Creating Semester: ${errorMessages}`);
        error.statusCode = 400;
        return next(error);
      }

      createSemester(db, req.body)
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
