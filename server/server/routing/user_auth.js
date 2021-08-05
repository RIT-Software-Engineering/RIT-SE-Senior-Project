const { ROLES } = require("../consts");

const isSignedIn = (req, res, next) => {
    if (req.user.system_id === undefined || req.user.system_id === null) {
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

    if (req.cookies.mockUser && testIsAdmin(req)) {
        req.user = {
            system_id: req.cookies.mockUser,
            type: req.cookies.mockType,
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
