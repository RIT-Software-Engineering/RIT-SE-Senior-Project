const { ROLES } = require("../consts");

const isSignedIn = (req, res, next) => {
    if (req.user === undefined || req.user === null) {
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

const mockUser = (req, res, next) => {

    // TODO: DELETE THIS ONCE ACTUAL USERS EXIST ~~~~~~~~~~~~~~~~~~~~~
    req.user = { system_id: req.cookies.user, type: req.cookies.type }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    if (req.cookies.mockUser && testIsAdmin(req)) {
        req.user = {
            system_id: req.cookies.mockUser,
            type: req.cookies.mockType,
            isMock: true,
        }
    }

    next();
}

const testIsAdmin = (req) => {
    return req.user.type === ROLES.ADMIN;
}

const testIsCoach = (req) => {
    return req.user.type === ROLES.COACH;
}

module.exports = {
    isSignedIn,
    isAdmin,
    isCoachOrAdmin,
    mockUser,
}
