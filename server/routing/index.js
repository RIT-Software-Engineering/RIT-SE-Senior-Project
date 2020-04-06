/**
 * Index of routing.
*/

'use strict';

// Imports
const router = require('express').Router();
const auth = require('basic-auth');
const path = require('path');
const CONFIG = require('../config');
const db_router = require('./db_routes');





let authAdmin = function(req, res, next) {
    let user = auth(req);
    if (!user || !user.name || !user.pass) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
        return;
    }
    if (user.name === 'M' && user.pass === '123') {
        next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
        return;
    }
}


//#region Page routes
router.get('/', (req, res) => {
    res.sendFile(path.join(CONFIG.www_path, '/html/index.html'));
});

router.get('/admin', authAdmin, (req, res) => {
    router.use(express.static('../proposal_docs'));
    res.sendFile(path.join(CONFIG.www_path, '/html/admin.html'));
});

router.get('/sponsor', (req, res) => {
    res.sendFile(path.join(CONFIG.www_path, '/html/sponsor.html'));
});

router.get('/proposalForm', (req, res) => {
    res.sendFile(path.join(CONFIG.www_path, '/html/proposalForm.html'));
});

//#endregion

// Database routes
router.use('/db', db_router);

module.exports = router;
