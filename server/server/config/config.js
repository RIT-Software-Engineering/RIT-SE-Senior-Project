/**
 * A place for global variables to be configured and made available
 */

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
        cert: "./server/config/seniorproject-cert.pem", // when you build, reference properly
        entryPoint: "https://shibboleth.main.ad.rit.edu/idp/profile/SAML2/Redirect/SSO",
        logoutPoint: "https://shibboleth.main.ad.rit.edu/logout.html",
        issuer: "https://seniorproject.se.rit.edu/saml",
        callback: "/saml/acs/consume",
        options: {
            failureRedirect: "/",
            failureFlash: true,
        },
    },
    session: {
        resave: false,
        secret: "KevinWasHere",
        saveUninitialized: true,
    },
};
