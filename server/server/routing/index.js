/**
 * Index of routing.
 */

"use strict";

// Imports
const router = require("express").Router();
const path = require("path");
const CONFIG = require("../config");
const db_router = require("./db_routes");

//#region Page routes
router.get("/", (req, res) => {
    res.sendFile(path.join(CONFIG.www_path, "/html/index.html"));
});

router.get("/admin", CONFIG.authAdmin, (req, res) => {
    res.sendFile(path.join(CONFIG.www_path, "/html/admin.html"));
});

router.get("/sponsor", (req, res) => {
    res.sendFile(path.join(CONFIG.www_path, "/html/sponsor.html"));
});

router.get("/proposalForm", (req, res) => {
    res.sendFile(path.join(CONFIG.www_path, "/html/proposalForm.html"));
});

//#endregion

// Database routes
router.use("/db", db_router);

module.exports = router;
