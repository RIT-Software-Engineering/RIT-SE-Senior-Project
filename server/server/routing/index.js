/**
 * Index of routing.
 */

"use strict";

// Imports
const router = require("express").Router();
const db_router = require("./db_routes");

// Database routes
router.use("/db", db_router);

module.exports = router;
