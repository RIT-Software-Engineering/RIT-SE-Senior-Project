module.exports = {
    datetime_format: "YYYY-MM-DD HH:mm:ss",
    ROLES: {
        ADMIN: 'admin',
        COACH: 'coach',
        STUDENT: 'student',
    },
    SAML_ATTRIBUTES: {
        uid: 'urn:oid:0.9.2342.19200300.100.1.1',
        mail: 'urn:oid:0.9.2342.19200300.100.1.3',
        ritEduAffiliation: 'urn:oid:1.3.6.1.4.1.4447.1.41',
    },
    SIGN_IN_SELECT_ATTRIBUTES: "*",
}
