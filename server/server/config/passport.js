const fs = require("fs");
const passport = require("passport");
const { Strategy } = require("passport-saml");
const DBHandler = require("../database/db");
const { SAML_ATTRIBUTES } = require("../consts");
const config = require("./config");

let db = new DBHandler();

// const savedUsers = [];

passport.serializeUser((user, done) => {
    console.log("Serializing user", user);
    return done(null, user);
});

passport.deserializeUser((user, done) => {
    // TODO: See if this is best practice or if there is another way to do this.
    // db.query("SELECT * FROM users WHERE system_id = ?", [expressUser.id]).then((user) => {
    //     if (expressUser.user) {
    //         expressUser.user.role = user.type;
    //     }
    // });

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
        db.query("SELECT * FROM users WHERE system_id = ? AND active = ''", [expressUser[SAML_ATTRIBUTES.uid]]).then((users) => {
            console.log("USER FOUND IN DATABASE", users);
            // if (expressUser.user) {
            //     expressUser.user.role = user.type;
            // }
            if (users.length === 1) {
                return done(null, users[0]);
            }
            return done("User not added to system yet or has been deactivated.")
        }).catch((err) => {
            return done(err);
        });
        // if (!savedUsers.includes(expressUser)) {
        //     savedUsers.push(expressUser);
        // }
    }
)

passport.use(samlStrategy);
