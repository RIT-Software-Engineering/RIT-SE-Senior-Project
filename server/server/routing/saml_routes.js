// Imports
const UserAuth = require("./user_auth");
const saml_router = require("express").Router();
const DB_CONFIG = require("../database/db_config");
const CONFIG = require("../config/config");
const session = require("express-session");
const passport = require("passport");

module.exports = (db) => {

    /** Parse the body of the request / Passport */
    saml_router.use(session(CONFIG.session));
    saml_router.use(passport.initialize());
    saml_router.use(passport.session());

    saml_router.get("/whoami", [UserAuth.isSignedIn], async (req, res) => {
        const userPromise = db.query(`SELECT * FROM ${DB_CONFIG.tableNames.users} WHERE users.system_id = ?`, [req.user.system_id]);
        let mockPromise;
        if (req.user.mock) {
            mockPromise = db.query(`SELECT * FROM ${DB_CONFIG.tableNames.users} WHERE users.system_id = ?`, [req.user.mock.system_id]);
        }

        const [userResult, mockResult] = await Promise.all([userPromise, mockPromise]);

        // If user does not exist in the database or is not active, they should not have access to system.
        if (userResult.length === 0 || userResult[0].active !== '') {
            return res.sendStatus(401);
        }

        if (mockResult && (mockResult.length === 0 || mockResult[0].active !== '')) {
            return res.status(400).send(`${req.user.mock.system_id} does not exist and therefore can not be mocked.`);
        }

        const user = userResult[0];
        const mockUser = mockResult ? mockResult[0] : {};

        res.send({
            system_id: user.system_id,
            type: user.type,
            fname: user.fname,
            lname: user.lname,
            mock: {     // TODO: It might make sense to change how this works and how it interacts with user_auth.mockUser in the future once Shibboleth is working.
                system_id: mockUser.system_id,
                type: mockUser.type,
                fname: mockUser.fname,
                lname: mockUser.lname,
            },
        });
    });

    // SAML Routes
    saml_router.get(
        "/login",
        passport.authenticate("saml", CONFIG.saml.options, (req, res, next) => {
            res.redirect("http://localhost:3000/dashboard");
        })
    );

    saml_router.post(
        "/login/callback",
        passport.authenticate("saml", CONFIG.saml.options, (req, res, next) => {
            res.redirect("http://localhost:3000/dashboard");
        })
    );

    return saml_router;
}
