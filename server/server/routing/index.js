/**
 * Index of routing.
 */

"use strict";

// Imports

require("../config/passport");
const CONFIG = require("../config/config");
const session = require("express-session");
const passport = require("passport");
const router = require("express").Router();
const DBHandler = require("../database/db");
let db = new DBHandler();
const db_router = require("./db_routes")(db);
const saml_router = require("./saml_routes")(db);

//#endregion

// Database routes
router.use("/db", db_router);
/** Parse the body of the request / Passport */
router.use(session(CONFIG.session));
router.use(passport.initialize());
router.use(passport.session());

// SAML Routes
router.get(
    "/login",
    passport.authenticate("saml", CONFIG.saml.options, (req, res, next) => {
        console.log(req);
        res.redirect("http://localhost:3000/dashboard");
    })
);

router.post(
    "/login/callback",
    passport.authenticate("saml", CONFIG.saml.options, (req, res, next) => {
        res.redirect("http://localhost:3000/dashboard");
    })
);
router.use("/saml", saml_router);

module.exports = router;
