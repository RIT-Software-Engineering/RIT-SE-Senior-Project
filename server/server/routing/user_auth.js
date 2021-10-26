const { ROLES } = require("../consts");
const Logger = require("../logger");

const isSignedIn = (req, res, next) => {
    if (!req.user || req.user.system_id === undefined || req.user.system_id === null) {
        res.sendStatus(401);
        return;
    }

    next();
}

const isAdmin = (req, res, next) => {

    if (testIsAdmin(req)) {
        next();
        return;
    }

    res.sendStatus(401);
}

const isCoachOrAdmin = (req, res, next) => {

    if (testIsAdmin(req) || testIsCoach(req)) {
        next();
        return true;
    }

    res.sendStatus(401);
}

if (process.env.NODE_ENV === 'development') {
    Logger.warn("NOT IN PRODUCTION MODE - USERS CAN SIGN IN BY CHANGING THEIR COOKIES")
}

else if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'){
    console.warn("NO ENVIRONMENT VARIABLES SET - MAKES SURE USERS CAN'T SIGN IN BY CHANGING THEIR COOKIES")
}

const mockUser = (req, res, next) => {

    if (process.env.NODE_ENV === 'development') {
        req.user = {
            system_id: req.cookies.system_id,
            fname: req.cookies.fname,
            lname: req.cookies.lname,
            email: req.cookies.email,
            type: req.cookies.type,
            // These need to be set to null not "null", unfortunately using JSON.parse tries to 
            // parse projects id's as numbers since projects start with numbers and then errors out.
            // So we need to do this workaround instead.
            semester_group: req.cookies.semester_group === "null" ? null : req.cookies.semester_group,
            project: req.cookies.project === "null" ? null : req.cookies.project,
            active: req.cookies.active,
        }
    }

    if (req.cookies.mock_system_id && testIsAdmin(req)) {
        req.user = {
            system_id: req.cookies.mock_system_id,
            fname: req.cookies.mock_fname,
            lname: req.cookies.mock_lname,
            email: req.cookies.mock_email,
            type: req.cookies.mock_type,
            // These need to be set to null not "null", unfortunately using JSON.parse tries to 
            // parse projects id's as numbers since projects start with numbers and then errors out.
            // So we need to do this workaround instead.
            semester_group: req.cookies.mock_semester_group === "null" ? null : req.cookies.mock_semester_group,
            project: req.cookies.mock_project === "null" ? null : req.cookies.mock_project,
            active: req.cookies.mock_active,

            mock: req.user,
        }
    }

    next();
}

const testIsAdmin = (req) => {
    return req.user && req.user.type === ROLES.ADMIN;
}

const testIsCoach = (req) => {
    return req.user && req.user.type === ROLES.COACH;
}

module.exports = {
    isSignedIn,
    isAdmin,
    isCoachOrAdmin,
    mockUser,
}
