/**
 * Main entry point for the SE Senior Project web server
 * @author Tom Amaral 
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { check, validationResult, body } = require('express-validator');


const port = 3000;
const path = require('path')
const DB_CONFIG = require('./server/database/db_config');
const DBHandler = require('./server/database/db');

let db = new DBHandler();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())



//#region 'Select All' Routes

app.get('/db/selectAllSponsorInfo', (req, res) => {
    db.selectAll(DB_CONFIG.tableNames.sponsor_info).then(function(value) {
        console.log(value);
        res.send(value);
    });
});

app.get('/db/selectAllStudentInfo', (req, res) => {
    res.status(404).send('Sorry, route not yet available');
    /*
    db.selectAll(DB_CONFIG.tableNames.student_info).then(function(value) {
        console.log(value);
        res.send(value);
    });
    */
});

app.get('/db/selectAllCoachInfo', (req, res) => {
    res.status(404).send('Sorry, route not yet available');
    /*
    db.selectAll(DB_CONFIG.tableNames.coach_info).then(function(value) {
        console.log(value);
        res.send(value);
    });
    */
});

app.get('/db/selectExemplary', (req, res) => {
    let sql = 'SELECT * FROM ' + DB_CONFIG.tableNames.senior_projects + ' WHERE priority = ?';
    let values = [0];

    db.select(sql, values).then(function(value) {
        res.send(value);
    });
});
//#endregion

app.post('/db/submitProposal', [
    body('title').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('organization').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('primary_contact').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('contact_email').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('contact_phone').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('background_info').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('project_description').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('project_scope').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('project_challenges').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('sponsor_provided_resources').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('constraints_assumptions').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('sponsor_deliverables').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('proprietary_info').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('sponsor_alternate_time').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('sponsor_avail_checked').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('project_agreements_checked').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('rights').not().isEmpty().trim().escape().withMessage("Cannot be empty")
],
(req, res) => {
    var result = validationResult(req)
    req.body.result = result
    res.send(req.body)
});


app.get('/db/getPoster', (req, res) => {
    let screenedFileName = path.normalize(req.query.fileName).replace(/\\|\//g, ''); // attempt to avoid any path traversal issues

    res.sendFile(path.join(__dirname, '/server/posters/' + screenedFileName));
});



app.use('/', express.static('./www'));
app.use('/', express.static('./www/admin'));
app.use('/', express.static('./server/posters'));
app.listen(port);
