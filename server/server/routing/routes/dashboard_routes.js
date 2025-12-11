const express = require("express");
const router = express.Router();
const UserAuth = require("../user_auth");
const {
  getAdditionalInfo,
  editAdditionalInfo,
  setDarkMode,
  getDarkMode,
  getPeerEvals,
  setGanttView,
  getGanttView,
  setCalendarView,
  getCalendarView,
  setMilestoneView,
  getMilestoneView,
} = require("../functions/dashboard-func");

module.exports = (db) => {
  // Get additional user info
  router.get(
    "/getAdditionalInfo",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const requestedUserId = req.query.system_id;

      if (!requestedUserId) {
        return res.status(400).send({ error: "User ID is required" });
      }

      getAdditionalInfo(db, requestedUserId)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          const error = new Error(err.message);
          error.statusCode = err.message.includes("not found") ? 404 : 500;
          next(error);
        });
    },
  );

  // Edit additional user info
  router.post(
    "/editAdditionalInfo",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id, additional_info } = req.body;

      if (!system_id || additional_info === undefined) {
        return res.status(400).send({
          error: "system_id and additional_info are required",
        });
      }

      editAdditionalInfo(db, system_id, additional_info)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          const error = new Error(err.message);
          error.statusCode = 500;
          next(error);
        });
    },
  );

  // Set dark mode preference
  router.post("/setDarkMode", [UserAuth.isSignedIn], async (req, res, next) => {
    const { system_id, dark_mode } = req.body;

    setDarkMode(db, system_id, dark_mode)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        const error = new Error(err.message);
        error.statusCode = 500;
        next(error);
      });
  });

  // Get dark mode preference
  router.get("/getDarkMode", [UserAuth.isSignedIn], async (req, res, next) => {
    const { system_id } = req.query;

    getDarkMode(db, system_id)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        const error = new Error(err.message);
        error.statusCode = err.message.includes("not found") ? 404 : 500;
        next(error);
      });
  });

  // Get peer evaluations
  router.get("/getPeerEvals", [UserAuth.isCoachOrAdmin], (req, res, next) => {
    const semesterNumber = req.query.semester;

    getPeerEvals(db, semesterNumber)
      .then((logs) => {
        res.send(logs);
      })
      .catch((err) => {
        const error = new Error(err.message);
        error.statusCode = 500;
        next(error);
      });
  });

  // Set gantt view preference
  router.post(
    "/setGanttView",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id, gantt_view } = req.body;

      setGanttView(db, system_id, gantt_view)
        .then((result) => {
          console.log(
            "Gantt view preference updated successfully",
            gantt_view,
            system_id,
          );
          res.status(200).send(result);
        })
        .catch((err) => {
          const error = new Error(err.message);
          error.statusCode = 500;
          next(error);
        });
    },
  );

  // Get gantt view preference
  router.get("/getGanttView", [UserAuth.isSignedIn], async (req, res, next) => {
    const { system_id } = req.query;

    getGanttView(db, system_id)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        const error = new Error(err.message);
        error.statusCode = err.message.includes("not found") ? 404 : 500;
        next(error);
      });
  });

  // Set calendar view preference
  router.post(
    "/setCalendarView",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id, calendar_view } = req.body;

      setCalendarView(db, system_id, calendar_view)
        .then((result) => {
          console.log(
            "Calendar view preference updated successfully",
            calendar_view,
            system_id,
          );
          res.status(200).send(result);
        })
        .catch((err) => {
          const error = new Error(err.message);
          error.statusCode = 500;
          next(error);
        });
    },
  );

  // Get calendar view preference
  router.get(
    "/getCalendarView",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id } = req.query;

      getCalendarView(db, system_id)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          const error = new Error(err.message);
          error.statusCode = err.message.includes("not found") ? 404 : 500;
          next(error);
        });
    },
  );

  // Set milestone view preference
  router.post(
    "/setMilestoneView",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id, milestone_view } = req.body;

      setMilestoneView(db, system_id, milestone_view)
        .then((result) => {
          console.log(
            "Milestone view preference updated successfully",
            milestone_view,
            system_id,
          );
          res.status(200).send(result);
        })
        .catch((err) => {
          const error = new Error(err.message);
          error.statusCode = 500;
          next(error);
        });
    },
  );

  // Get milestone view preference
  router.get(
    "/getMilestoneView",
    [UserAuth.isSignedIn],
    async (req, res, next) => {
      const { system_id } = req.query;

      getMilestoneView(db, system_id)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          const error = new Error(err.message);
          error.statusCode = err.message.includes("not found") ? 404 : 500;
          next(error);
        });
    },
  );

  return router;
};
