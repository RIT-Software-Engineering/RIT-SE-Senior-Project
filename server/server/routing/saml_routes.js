// Imports
const UserAuth = require("./user_auth");
const saml_router = require("express").Router();
const DB_CONFIG = require("../database/db_config");
const CONFIG = require("../config/config");
const session = require("express-session");
const passport = require("passport");

module.exports = (app, db) => {

    /** Parse the body of the request / Passport */
    app.use(session(CONFIG.session));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(UserAuth.mockUser);

    app.get("/saml/whoami", [UserAuth.isSignedIn], async (req, res) => {
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

    app.get(
        "/saml/login",
        passport.authenticate("saml", CONFIG.saml.options)
    );

    app.post(
        "/saml/acs/consume",
        passport.authenticate("saml", CONFIG.saml.options)
    );

    /**
     * According to this qualtrics survey that I had to fill out for ITS to setup Shibboleth,
     * logout is not supported by RIT's IdP. So all we do is terminate the session on our side.
     * 
     * https://rit.az1.qualtrics.com/jfe/form/SV_8weWD4lmxe826YR
     */
    app.get(
        "/saml/logout", (req, res) => {
            req.logout();
            res.sendStatus(200);
        }
    )

    return saml_router;
}
