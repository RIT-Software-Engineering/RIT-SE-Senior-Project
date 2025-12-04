const express = require("express");
const router = express.Router();
const {
  getActiveProjects,
  getActiveCoaches,
  getProjectCoaches,
  getProjectStudents,
  getProjectStudentNames,
  selectAllCoachInfo,
  getProjects,
  getCandidateProjects,
  getMyProjects,
  getSemesterProjects,
  getProjectDates,
  editProject,
  updateProposalStatus,
} = require("../functions/projects-func");

module.exports = (db) => {
  router.get(
    "/getActiveProjects",
    [require("../user_auth").isSignedIn],
    (req, res, next) => {
      getActiveProjects(db)
        .then((values) => {
          res.send(values);
        })
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getActiveCoaches",
    [require("../user_auth").isCoachOrAdmin],
    (req, res, next) => {
      getActiveCoaches(db)
        .then((coaches) => {
          res.send(coaches);
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
    "/getProjectCoaches",
    [require("../user_auth").isCoachOrAdmin],
    (req, res, next) => {
      getProjectCoaches(db, req.query.project_id)
        .then((coaches) => {
          res.send(coaches);
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
    "/getProjectStudents",
    [require("../user_auth").isCoachOrAdmin],
    (req, res, next) => {
      getProjectStudents(db, req.query.project_id)
        .then((students) => {
          res.send(students);
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
    "/getProjectStudentNames",
    [require("../user_auth").isSignedIn],
    (req, res, next) => {
      getProjectStudentNames(db, req.query.project_id, req.user.system_id)
        .then((students) => {
          res.send(students);
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
    "/selectAllCoachInfo",
    [require("../user_auth").isCoachOrAdmin],
    (req, res, next) => {
      selectAllCoachInfo(db)
        .then((coaches) => {
          res.send(coaches);
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
    "/getProjects",
    [require("../user_auth").isCoachOrAdmin],
    (req, res, next) => {
      getProjects(db)
        .then((projects) => res.send(projects))
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getCandidateProjects",
    [require("../user_auth").isSignedIn],
    (req, res, next) => {
      getCandidateProjects(db)
        .then((projects) => res.send(projects))
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getMyProjects",
    [require("../user_auth").isSignedIn],
    (req, res, next) => {
      getMyProjects(db, req.user)
        .then((proposals) => res.send(proposals))
        .catch((err) => res.status(500).send(err));
    },
  );

  router.get(
    "/getSemesterProjects",
    [require("../user_auth").isSignedIn],
    (req, res, next) => {
      getSemesterProjects(db, req.user)
        .then((projects) => res.send(projects))
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getProjectDates",
    require("../user_auth").isSignedIn,
    (req, res, next) => {
      getProjectDates(db, req.query.semester)
        .then((dates) => {
          res.send(dates);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.post(
    "/editProject",
    [require("../user_auth").isAdmin, require("../user_auth").canWrite, ...[]],
    (req, res, next) => {
      editProject(db, req.body)
        .then(() => {
          return res.sendStatus(200);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.patch(
    "/updateProposalStatus",
    [require("../user_auth").isAdmin, require("../user_auth").canWrite, ...[]],
    (req, res, next) => {
      updateProposalStatus(db, req.body.status, req.body.project_id)
        .then(() => {
          res.sendStatus(200);
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
