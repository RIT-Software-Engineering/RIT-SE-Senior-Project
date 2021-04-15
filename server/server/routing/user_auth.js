
const isSignedIn = (req, res, next) => {
    if (req.user === undefined || req.user === null) {
        res.sendStatus(401);
        return;
    }

    next();
}

const isAdmin = (req, res, next) => {

    if (!testIsAdmin(req)) {
        res.sendStatus(401);
        return;
    }

    next();
}

const mockUser = (req, res, next) => {

    // TODO: DELETE THIS ONCE ACTUAL USERS EXIST ~~~~~~~~~~~~~~~~~~~~~
    req.user = { system_id: req.cookies.user, type: req.cookies.type }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    if (req.cookies.mockUser && testIsAdmin(req)) {
        req.user = {
            system_id: req.cookies.mockUser,
            type: req.cookies.mockType
        }
    }

    next();
}

const testIsAdmin = (req) => {
    return req.user.type === "admin";
}

module.exports = {
    isSignedIn,
    isAdmin,
    mockUser,
}
