const express = require("express");
const router = express.Router();
const path = require("path");

const { body } = require("express-validator");
const {
  createArchive,
  getActiveArchiveProjects,
  getArchiveProjects,
  getArchiveProject,
  getArchiveFromSlug,
  getArchiveFromProject,
  searchForArchive,
  editArchive,
  editArchiveStudent,
  createArchiveStudent,
  getArchive,
  getArchivePoster,
  getArchiveVideo,
  getArchiveImage,
} = require("../functions/archives-func");

module.exports = (db) => {
  const UserAuth = require("../user_auth");

  // Create archive (admin only)
  router.post(
    "/createArchive",
    [
      UserAuth.isAdmin,
      UserAuth.canWrite,
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

  // Get all archives (admin only)
  router.get("/getArchive", [UserAuth.isAdmin], (req, res, next) => {
    getArchive(db)
      .then((values) => {
        res.send(values);
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get active archive projects for display (featured or all)
  router.get("/getActiveArchiveProjects", (req, res, next) => {
    const { resultLimit, page, featured } = req.query;
    getActiveArchiveProjects(db, resultLimit, page, featured)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get all archive projects for admin view
  router.get("/getArchiveProjects", (req, res, next) => {
    const { resultLimit, offset } = req.query;
    getArchiveProjects(db, resultLimit, offset)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get specific archive project by ID (admin only)
  router.get("/getArchiveProject", [UserAuth.isAdmin], (req, res, next) => {
    getArchiveProject(db, req.query.archive_id)
      .then((project) => {
        res.send(project);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Edit archive (admin only)
  router.post(
    "/editArchive",
    [UserAuth.isAdmin, UserAuth.canWrite],
    async (req, res, next) => {
      editArchive(db, req.body, req.user)
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

  // Edit archive as student with file uploads
  router.post(
    "/editArchiveStudent",
    [UserAuth.isSignedIn, UserAuth.canWrite],
    async (req, res, next) => {
      const files = req.files;
      editArchiveStudent(db, req.body, req.user, files)
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

  // Create archive as student with optional file uploads
  router.post(
    "/createArchiveStudent",
    [
      UserAuth.isSignedIn,
      UserAuth.canWrite,
      body("featured")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
    ],
    async (req, res, next) => {
      const files = req.files;
      createArchiveStudent(db, req.body, req.user, files)
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

  // Get archive poster file
  router.get("/getArchivePoster", (req, res, next) => {
    try {
      const filePath = getArchivePoster(req.query.fileName);
      res.sendFile(filePath);
    } catch (err) {
      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    }
  });

  // Get archive video file
  router.get("/getArchiveVideo", (req, res, next) => {
    try {
      const filePath = getArchiveVideo(req.query.fileName);
      res.sendFile(filePath);
    } catch (err) {
      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    }
  });

  // Get archive image file
  router.get("/getArchiveImage", (req, res, next) => {
    try {
      const filePath = getArchiveImage(req.query.fileName);
      res.sendFile(filePath);
    } catch (err) {
      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    }
  });

  // Search archive projects
  router.get("/searchForArchive", (req, res, next) => {
    const { resultLimit, offset, searchQuery, inactive } = req.query;
    searchForArchive(db, resultLimit, offset, searchQuery, inactive)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get archive by URL slug
  router.get("/getArchiveFromSlug", (req, res, next) => {
    getArchiveFromSlug(db, req.query.url_slug)
      .then((values) => {
        res.status(200).send(values);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get archives for a project
  router.get("/getArchiveFromProject", (req, res, next) => {
    getArchiveFromProject(db, req.query.project_id)
      .then((values) => {
        res.status(200).send(values);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  return router;
};
