/**
 * Index of routing.
 */

"use strict";

// Imports

require("../config/passport");
const router = require("express").Router();
const DBHandler = require("../database/db");
let db = new DBHandler();


const saml_router = require("./saml_routes")(router, db);
const db_router = require("./db_routes")(db);

// Database routes
router.use("/saml", saml_router);
router.use("/db", db_router);

module.exports = router;
