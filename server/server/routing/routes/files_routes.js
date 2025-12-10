const express = require("express");
const router = express.Router();

const {
  uploadFiles,
  uploadFilesStudent,
  createDirectory,
  renameDirectoryOrFile,
  getFiles,
  getProjectFiles,
  removeFile,
  removeDirectory,
} = require("../functions/files-func");

module.exports = (db) => {
  const UserAuth = require("../user_auth");

  // Upload files (admin only)
  router.post(
    "/uploadFiles",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      uploadFiles(req.files, req.body.path)
        .then(({ msg, filesUploaded }) => {
          res.send({ msg: msg, filesUploaded: filesUploaded });
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Upload files for student
  router.post("/uploadFilesStudent", UserAuth.canWrite, (req, res, next) => {
    uploadFilesStudent(
      db,
      req.files,
      req.body.path,
      req.body.archive,
      req.body.column,
    )
      .then(({ msg, filesUploaded }) => {
        res.send({ msg: msg, filesUploaded: filesUploaded });
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Create a directory
  router.post(
    "/createDirectory",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      createDirectory(req.query.path)
        .then(({ msg }) => {
          res.send({ msg: msg });
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Rename directory or file
  router.post(
    "/renameDirectoryOrFile",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      renameDirectoryOrFile(req.query.oldPath, req.query.newPath)
        .then(({ msg }) => {
          res.send({ msg: msg });
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Get files in a directory
  router.get("/getFiles", UserAuth.isAdmin, (req, res, next) => {
    getFiles(req.query.path)
      .then((fileData) => {
        res.send(fileData);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get project files
  router.get("/getProjectFiles", (req, res, next) => {
    getProjectFiles()
      .then((fileData) => {
        res.send(fileData);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Remove a file
  router.delete(
    "/removeFile",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      removeFile(req.query.path)
        .then(({ msg }) => {
          res.send({ msg: msg });
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Remove a directory
  router.delete(
    "/removeDirectory",
    [UserAuth.isAdmin, UserAuth.canWrite],
    (req, res, next) => {
      removeDirectory(req.query.path)
        .then(({ msg }) => {
          res.send({ msg: msg });
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
