const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const {
  createArchive,
  getActiveArchiveProjects,
  getArchiveProjects,
  getArchiveProject,
  getArchiveFromSlug,
  getArchiveFromProject,
  searchForArchive,
} = require("../db_ind_routes_func/archives-func");

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
    (req, res, next) => {
      createArchive(db, req.body, req.user)
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
