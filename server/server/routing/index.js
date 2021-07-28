/**
 * Index of routing.
 */

"use strict";

// Imports
const router = require("express").Router();
const DBHandler = require("../database/db");
let db = new DBHandler();
const db_router = require("./db_routes")(db);
const saml_router = require("./saml_routes")(db);

// Database routes
router.use("/db", db_router);
router.use("/saml", saml_router);

module.exports = router;
