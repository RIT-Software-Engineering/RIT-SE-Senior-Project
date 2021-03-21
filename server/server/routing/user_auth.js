
const isSignedIn = (req, res, next) => {
    if( req.query.user === undefined || req.query.user === null ) {
        res.sendStatus(401);
        return;
    }

    const userMap = {
        student: "dxb2269",
        admin: "samvse",
        coach: "llkiee",
    }

    req.user = {
        system_id: userMap[req.query.user],
        type: req.query.user,
    }

    next();
}

const isAdmin = (req, res, next) => {

    if(req.query.user !== "admin") {
        res.sendStatus(401);
        return;
    }

    req.user = {
        system_id: "samvse",
        type: req.query.user,
    }

    next();
}

module.exports = {
    isSignedIn,
    isAdmin,
}
