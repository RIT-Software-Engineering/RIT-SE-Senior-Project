const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const {
  getProposalPdfNames,
  getProposalPdf,
  getProposalAttachmentNames,
  getProposalAttachment,
  submitProposal,
} = require("../functions/proposals-func");

module.exports = (db) => {
  const UserAuth = require("../user_auth");

  // Get list of proposal PDF names
  router.get("/getProposalPdfNames", UserAuth.isSignedIn, (req, res, next) => {
    getProposalPdfNames()
      .then((fileLinks) => {
        res.send(fileLinks);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
      });
  });

  // Get proposal PDF
  router.get("/getProposalPdf", UserAuth.isSignedIn, (req, res, next) => {
    getProposalPdf(req.query.project_id)
      .then((filePath) => {
        res.sendFile(filePath);
      })
      .catch((err) => {
        console.error(err);
        res.send("File not found");
      });
  });

  // Get list of proposal attachment names
  router.get(
    "/getProposalAttachmentNames",
    UserAuth.isSignedIn,
    (req, res, next) => {
      getProposalAttachmentNames(req.query.project_id)
        .then((fileLinks) => {
          res.send(fileLinks);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  // Get proposal attachment
  router.get(
    "/getProposalAttachment",
    UserAuth.isSignedIn,
    (req, res, next) => {
      getProposalAttachment(req.query.project_id, req.query.name)
        .then((filePath) => {
          res.sendFile(filePath);
        })
        .catch((err) => {
          console.error(err);
          res.send("File not found");
        });
    },
  );

  // Submit a new proposal
  router.post(
    "/submitProposal",
    [
      UserAuth.isSignedIn,
      UserAuth.canWrite,
      body("title")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 50 })
        .withMessage("Title must be under 50 characters"),
      body("organization")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("primary_contact")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("contact_email")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("contact_phone")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("background_info")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("project_description")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("project_scope")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("project_challenges")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("sponsor_provided_resources")
        .trim()
        .escape()
        .isLength({ max: 5000 }),
      body("constraints_assumptions")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("sponsor_deliverables")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
      body("proprietary_info").trim().escape().isLength({ max: 5000 }),
      body("sponsor_alternate_time").trim().escape().isLength({ max: 5000 }),
      body("sponsor_avail_checked")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("project_agreements_checked")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty"),
      body("assignment_of_rights")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Cannot be empty")
        .isLength({ max: 5000 }),
    ],
    async (req, res, next) => {
      let result = validationResult(req);

      if (result.errors.length !== 0) {
        const errorMessages = result.errors
          .map((error) => `${error.param}: ${error.msg}`)
          .join(", ");
        const error = new Error(`Validation failed: ${errorMessages}`);
        error.statusCode = 400;
        return next(error);
      }

      submitProposal(db, req.body, req.files)
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
