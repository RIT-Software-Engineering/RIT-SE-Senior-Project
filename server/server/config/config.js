/**
 * A place for global variables to be configured and made available
 */

const path = require('path');

module.exports = {
    accepted_file_types: [
        ".pdf",
        ".jpeg",
        ".jpg",
        ".png",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".ppt",
        ".pptx",
        ".rtf",
        ".csv",
    ],
    saml: {
        cert: path.join(__dirname, "/rit-cert.pem"),
        privateKey: path.join(__dirname, "/seniorproject-key.pem"),
        decryptionPvk: path.join(__dirname, "/seniorproject-key.pem"),
        entryPoint: "https://shibboleth.main.ad.rit.edu/idp/profile/SAML2/Redirect/SSO",
        logoutPoint: "https://shibboleth.main.ad.rit.edu/logout.html",
        issuer: "https://seniorproject.se.rit.edu/saml",
        callback: "/saml/acs/consume",
        identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
        options: {
            successRedirect: "/dashboard",
            failureRedirect: "/",
            failureFlash: true,
        },
        logOutRedirect: "https://shibboleth.main.ad.rit.edu/logout.html",
    },
    session: {
        resave: false,
        secret: "KevinWasHere",
        saveUninitialized: true,
    },
};
