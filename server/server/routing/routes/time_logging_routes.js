const express = require("express");
const router = express.Router();

const {
  avgTime,
  createTimeLog,
  removeTime,
  getTimeLogs,
  getAllTimeLogs,
} = require("../functions/time_logging-func");

module.exports = (db) => {
  const UserAuth = require("../user_auth");

  // Get average time per user for a project
  router.get("/avgTime", [UserAuth.isSignedIn], async (req, res, next) => {
    avgTime(db, req.query.project_id)
      .then((time) => {
        console.log(time);
        res.send(time);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Create a new time log
  router.post("/createTimeLog", [UserAuth.canWrite], async (req, res, next) => {
    createTimeLog(db, req.user, req.body)
      .then(() => {
        return res.status(200).send();
      })
      .catch((err) => {
        console.error(err);
        let error = new Error(err);
        error.statusCode = 400;
        return next(error);
      });
  });

  // Remove a time log
  router.post(
    "/removeTime",
    [UserAuth.isSignedIn, UserAuth.canWrite],
    (req, res, next) => {
      removeTime(db, req.body.id)
        .then(() => {
          res.status(200).send();
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 400;
          return next(error);
        });
    },
  );

  // Get time logs for a project
  router.get("/getTimeLogs", [UserAuth.isSignedIn], async (req, res, next) => {
    getTimeLogs(db, req.user, req.query.project_id)
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

  // Get all time logs with pagination
  router.get(
    "/getAllTimeLogs",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { resultLimit, offset } = req.query;

      getAllTimeLogs(db, req.user, resultLimit, offset)
        .then(({ timeLogCount, timeLogs }) => {
          res.send({
            timeLogCount: timeLogCount,
            timeLogs: timeLogs,
          });
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
