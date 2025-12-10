const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const {
  selectAllStudentInfo,
  selectAllNonStudentInfo,
  getSemesterStudents,
  getProjectMembers,
  getActiveUsers,
  createUser,
  batchCreateUser,
  editUser,
} = require("../functions/users-func");

module.exports = (db) => {
  const UserAuth = require("../user_auth");

  // Get all student information
  router.get(
    "/selectAllStudentInfo",
    [UserAuth.isCoachOrAdmin],
    (req, res, next) => {
      selectAllStudentInfo(db)
        .then((values) => {
          return res.send(values);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Get all non-student information
  router.get(
    "/selectAllNonStudentInfo",
    [UserAuth.isAdmin],
    (req, res, next) => {
      selectAllNonStudentInfo(db)
        .then((values) => {
          return res.send(values);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Get semester students
  router.get(
    "/getSemesterStudents",
    [UserAuth.isSignedIn],
    (req, res, next) => {
      getSemesterStudents(db, req.user, req.query.project_id)
        .then((users) => {
          res.send(users);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Get project members
  router.get("/getProjectMembers", [UserAuth.isSignedIn], (req, res, next) => {
    getProjectMembers(db, req.query.project_id)
      .then((users) => {
        res.send(users);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get all active users
  router.get("/getActiveUsers", [UserAuth.isAdmin], (req, res, next) => {
    getActiveUsers(db)
      .then((users) => {
        res.send(users);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Create a new user
  router.post(
    "/createUser",
    [
      UserAuth.isAdmin,
      UserAuth.canWrite,
      body("system_id")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("fname")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("lname")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("email")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("type")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 }),
      body("semester_group").isLength({ max: 50 }),
      body("project").isLength({ max: 50 }),
      body("active").trim().escape().isLength({ max: 50 }),
      body("viewOnly").trim().escape().isLength({ max: 50 }),
    ],
    async (req, res, next) => {
      let result = validationResult(req);
      console.log(result);

      if (result.errors.length !== 0) {
        const error = new Error("Validation Error");
        error.statusCode = 400;
        return next(error);
      }

      createUser(db, req.body)
        .then(() => {
          return res.status(200).send();
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Batch create users
  router.post(
    "/batchCreateUser",
    [UserAuth.isAdmin, UserAuth.canWrite],
    async (req, res, next) => {
      try {
        let users = JSON.parse(req.body.users);

        batchCreateUser(db, users)
          .then(({ successUsers, failedUsers }) => {
            res.status(200).json({ successUsers, failedUsers });
          })
          .catch((err) => {
            console.error(err);
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
          });
      } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      }
    },
  );

  // Edit user information
  router.post(
    "/editUser",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      editUser(db, req.body)
        .then(() => {
          return res.status(200).send();
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
