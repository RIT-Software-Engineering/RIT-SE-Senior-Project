const express = require("express");
const router = express.Router();
const UserAuth = require("../user_auth");
const { body, validationResult } = require("express-validator");
const {
  getActions,
  getTimelineActions,
  getLateSubmission,
  getActionLogs,
  getAllActionLogs,
  submitAction,
  getCoachFeedback,
  createAction,
  editAction,
} = require("../functions/actions-func");

module.exports = (db) => {
  // Get all actions (admin only)
  router.get("/getActions", [UserAuth.isAdmin], (req, res, next) => {
    getActions(db)
      .then((values) => {
        res.send(values);
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get timeline actions for a project
  router.get(
    "/getTimelineActions",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      getTimelineActions(db, req.query.project_id, req.user)
        .then((values) => {
          res.send(values);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Get late submission info for an action log
  router.get("/getLateSubmission", [UserAuth.isSignedIn], (req, res, next) => {
    getLateSubmission(db, req.query.log_id)
      .then((values) => {
        res.send(values);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get action logs for a specific action
  router.get("/getActionLogs", [UserAuth.isSignedIn], (req, res, next) => {
    getActionLogs(db, req.user, req.query.action_id, req.query.project_id)
      .then((values) => {
        res.send(values);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get all action logs with pagination
  router.get(
    "/getAllActionLogs",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { resultLimit, offset } = req.query;

      getAllActionLogs(db, req.user, resultLimit, offset)
        .then(({ actionLogCount, actionLogs }) => {
          res.send({
            actionLogCount: actionLogCount,
            actionLogs: actionLogs,
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Submit an action with file attachments
  router.post(
    "/submitAction",
    [UserAuth.isSignedIn, UserAuth.canWrite, body("*").trim()],
    async (req, res, next) => {
      let result = validationResult(req);

      if (result.errors.length !== 0) {
        return res.status(400).send("Input is invalid");
      }

      submitAction(db, req.user, req.body, req.files, __dirname)
        .then(() => {
          return res.sendStatus(200);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = err.statusCode || 500;
          return next(error);
        });
    },
  );

  // Get coach feedback for a project
  router.get(
    "/getCoachFeedback",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      getCoachFeedback(db, req.query.project_id)
        .then((feedback) => {
          res.send(feedback);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Create a new action template
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

  // Edit an existing action template
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
