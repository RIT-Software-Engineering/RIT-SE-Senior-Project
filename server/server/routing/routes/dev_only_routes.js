const express = require("express");
const router = express.Router();
const {
  devOnlyGetAllUsersForLogin,
  devOnlyRedeployDatabase,
} = require("../functions/dev-only-func");

module.exports = (db) => {
  // Development only: Get all users for login
  router.get("/DevOnlyGetAllUsersForLogin", (req, res) => {
    devOnlyGetAllUsersForLogin(db)
      .then((users) => {
        res.send(users);
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Failed to fetch users",
          error: err.message,
        });
      });
  });

  // Development only: Redeploy database
  router.put("/DevOnlyRedeployDatabase", async (req, res) => {
    devOnlyRedeployDatabase()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });

  return router;
};
