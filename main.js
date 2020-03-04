/**
 * Main entry point for the SE Senior Project web server
 * @author Tom Amaral 
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { check, validationResult, body } = require('express-validator');
const PDFDoc = require('pdfkit');
const fs = require('fs');

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

    db.query(sql, values).then(function(value) {
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
    body('sponsor_provided_resources').trim().escape(),
    body('constraints_assumptions').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('sponsor_deliverables').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('proprietary_info').trim().escape(),
    body('sponsor_alternate_time').trim().escape(),
    body('sponsor_avail_checked').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('project_agreements_checked').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('assignment_of_rights').not().isEmpty().trim().escape().withMessage("Cannot be empty")
],
async (req, res) => {
    var result = validationResult(req)
    
    // Insert into the database
    if (result.errors.length == 0) {
        let sql = `INSERT INTO ${DB_CONFIG.tableNames.senior_projects} 
                (title, organization, primary_contact, contact_email, contact_phone, 
                background_info, project_description, project_scope, project_challenges, 
                sponsor_provided_resources, constraints_assumptions, sponsor_deliverables,
                proprietary_info, sponsor_alternate_time, sponsor_avail_checked, project_agreements_checked, assignment_of_rights) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        
        let body = req.body;

        let params =    [
                        body.title, body.organization, body.primary_contact, body.contact_email, body.contact_phone,
                        body.background_info, body.project_description, body.project_scope, body.project_challenges,
                        body.sponsor_provided_resources, body.constraints_assumptions, body.sponsor_deliverables,
                        body.proprietary_info, body.sponsor_alternate_time, body.sponsor_avail_checked, body.project_agreements_checked,
                        body.assignment_of_rights
                        ];
        db.query(sql, params).then(() =>{
            let doc = new PDFDoc;
            doc.pipe(fs.createWriteStream(path.join(__dirname, `/server/proposal_docs/${body.organization + '_' + body.title}.pdf`)));

            doc.font('Times-Roman');

            for (var key of DB_CONFIG.senior_project_proposal_keys) {
                doc.fill('black').fontSize(16).text(key.replace('/_/g', ' ').charAt(0).toUpperCase()), {
                    underline: true
                }; 
                doc.fontSize(12).text(body[key]);  // Text value from proposal
                doc.moveDown();
                doc.save();
            }
            
            doc.end();
            res.sendFile(path.join(__dirname, '/www/sponsor/submitted.html'));
           
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
    }
});


app.get('/db/getPoster', (req, res) => {
    let screenedFileName = path.normalize(req.query.fileName).replace(/\\|\//g, ''); // attempt to avoid any path traversal issues

    res.sendFile(path.join(__dirname, '/server/posters/' + screenedFileName));
});



app.use('/', express.static('./www'));
app.use('/', express.static('./www/admin'));
app.use('/', express.static('./server/posters'));
app.listen(port);
