/**
 * Index of routing.
 */

"use strict";

// Imports

require("../config/passport");
const router = require("express").Router();
const DBHandler = require("../database/db");
let db = new DBHandler();


module.exports = (app) => {

    const db_router = require("./db_routes")(db);
    const saml_router = require("./saml_routes")(app, db);

    // Database routes
    router.use("/db", db_router);
    router.use("/saml", saml_router);
    return router;
};
