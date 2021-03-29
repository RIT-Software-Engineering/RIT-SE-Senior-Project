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
//const redeployDatabase = require("./db_setup");
//redeployDatabase();

// Imports
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const routing = require("./server/routing/index");
const cookieParser = require("cookie-parser");
const { mockUser } = require("./server/routing/user_auth");
// Constants
const port = 3001;

// Setup CORS policies
// TODO-IMPORTANT: LOOK FOR BEST PRACTICE CORS POLICIES
// Basic setup found here: https://www.positronx.io/express-cors-tutorial/
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// Set up body parsing and file upload configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
    fileupload({
        safeFileNames: true,
        preserveExtension: true,
    })
);
app.use(mockUser);

// Attach route handlers
app.use("/", routing);

app.listen(port);
