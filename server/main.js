/**
 * Main entry point for the SE Senior Project web server
 * @author Tom Amaral <txa2269@rit.edu>
 */

"use strict";

/**
 *
 * FOR DEVELOPMENT USE ONLY
 *
 * UNCOMMENT THIS TO RESET DATABASE
 */
// const redeployDatabase = require("./db_setup");
// redeployDatabase();

// Imports
const express = require("express");
const cors = require("cors");
const app = express();
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
// Constants
const port = 3001;

// Setup CORS policies
// TODO-IMPORTANT: LOOK FOR BEST PRACTICE CORS POLICIES
// Basic setup found here: https://www.positronx.io/express-cors-tutorial/
app.use(function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Required for SSO authentication
    // TODO: This may no longer be needed because of our cors policy lower down "credentials: true".
    res.header("Access-Control-Allow-Credentials", "true");

    next();
});
app.use(
    cors({
        // TODO/FIXME: process.env.NODE_ENV is not set ever
        origin: process.env.NODE_ENV === "production" ? "https://seniorproject.se.rit.edu" : "http://localhost:3000",
        credentials: true,
    })
);

 // Set up body parsing and file upload configurations
app.use(express.urlencoded({ extended: true })); // replaces bodyParser.urlencoded since bodyParser is depreciated
app.use(cookieParser());
app.use(express.json());
app.use(
    fileupload({
        safeFileNames: true,
        preserveExtension: true,
    })
);

// This is down here because saml_routes needs to be initialized after the express.urlencoded() middleware to be able to process Shibboleth logins
const routing = require("./server/routing/index");
// Attach route handlers
app.use("/", routing);

app.listen(port);
