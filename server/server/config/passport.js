const fs = require("fs");
const passport = require("passport");
const { Strategy } = require("passport-saml");
const DBHandler = require("../database/db");
const { SAML_ATTRIBUTES, SIGN_IN_SELECT_ATTRIBUTES } = require("../consts");
const config = require("./config");

let db = new DBHandler();

// TODO: It seems that best practice is to not store the whole user when serializing the data but to instead store the user's id and then when deserializing the user, find the user by their id.
// Ideally, you wouldn't want to find the id in the deserialize by doing a db request, since deserialize happens per each network request. So ideally, you'd want to do this in some O(1) lookup.
// But hey, this seems to work for now so I'm going to leave it.
passport.serializeUser((user, done) => {
    return done(null, user);
});

passport.deserializeUser((user, done) => {
    return done(null, user);
});

const samlStrategy = new Strategy(
    {
        issuer: config.saml.issuer,
        protocol: "https://",
        path: config.saml.callback,
        entryPoint: config.saml.entryPoint,
        logoutUrl: config.saml.logoutPoint,
        cert: fs.readFileSync(config.saml.cert, "utf-8"),
        privateKey: fs.readFileSync(config.saml.privateKey, "utf-8"),
        decryptionPvk: fs.readFileSync(config.saml.decryptionPvk, "utf-8"),
        identifierFormat: config.saml.identifierFormat,
    },
    (expressUser, done) => {
        db.query(`SELECT ${SIGN_IN_SELECT_ATTRIBUTES} FROM users WHERE system_id = ? AND active = ''`, [expressUser[SAML_ATTRIBUTES.uid]]).then((users) => {
            if (users.length === 1) {
                let insertQuery = `UPDATE users SET prev_login = last_login, last_login = CURRENT_TIMESTAMP 
                                    WHERE system_id = ?;`;
                db.query(insertQuery, [users[0].system_id])
                    .then(() => {
                        return done(null, users[0]);
                    })
                    .catch((err) => {
                        console.log(err);
                        return done("Unable to update last login.")
                    });

            }
            else{
                return done("User not added to system yet or has been deactivated.")
            }
        }).catch((err) => {
            return done(err);
        });
    }
)

passport.use(samlStrategy);
