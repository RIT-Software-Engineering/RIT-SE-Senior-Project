const fs = require("fs");
const passport = require("passport");
const { Strategy } = require("passport-saml");
const DBHandler = require("../database/db");
const config = require("./config");

// Globals
let db = new DBHandler();

const savedUsers = [];

passport.serializeUser((expressUser, done) => {
    console.log("Serializing user", expressUser);
    done(null, expressUser);
});

passport.deserializeUser((expressUser, done) => {
    // TODO: See if this is best practice or if there is another way to do this.
    db.query("SELECT * FROM users WHERE system_id = ?", [expressUser.id]).then((user) => {
        if (expressUser.user) {
            expressUser.user.role = user.type;
        }
    });
    console.log("Deserializing user", expressUser);
    done(null, expressUser);
});

passport.use(
    new Strategy(
        {
            issuer: config.saml.issuer,
            protocol: "http://",
            path: "/login/callback",
            entryPoint: config.saml.entryPoint,
            cert: fs.readFileSync(config.saml.cert, "utf-8"),
        },
        (expressUser, done) => {
            console.log("expressUser", expressUser);
            if (!savedUsers.includes(expressUser)) {
                savedUsers.push(expressUser);
            }
            done(null, expressUser);
        }
    )
);
