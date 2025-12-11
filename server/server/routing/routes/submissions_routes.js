const express = require("express");
const router = express.Router();

const {
  getSubmission,
  getSubmissionFile,
} = require("../functions/submissions-func");

module.exports = (db) => {
  const UserAuth = require("../user_auth");

  // Get submission form data and files
  router.get("/getSubmission", [UserAuth.isSignedIn], (req, res, next) => {
    getSubmission(db, req.user, req.query.log_id)
      .then((submissions) => {
        res.send(submissions);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get submission file
  router.get(
    "/getSubmissionFile",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      getSubmissionFile(db, req.user, req.query.log_id, req.query.file)
        .then((filePath) => {
          return res.sendFile(filePath);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 404;
          return next(error);
        });
    },
  );

  return router;
};
