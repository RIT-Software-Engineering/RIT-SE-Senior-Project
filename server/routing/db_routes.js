
// Imports
const db_router = require('express').Router();
const { validationResult, body } = require('express-validator');
const PDFDoc = require('pdfkit');
const fs = require('fs');
const path = require('path');

const DB_CONFIG = require('../database/db_config');
const DBHandler = require('../database/db');
const CONFIG = require('../config');

// Globals
let db = new DBHandler();

// Routes
db_router.get('/selectAllSponsorInfo', (req, res) => {
    db.selectAll(DB_CONFIG.tableNames.sponsor_info).then(function(value) {
        console.log(value);
        res.send(value);
    });
});

db_router.get('/selectAllStudentInfo', (req, res) => {
    res.status(404).send('Sorry, route not yet available');
    /*
    db.selectAll(DB_CONFIG.tableNames.student_info).then(function(value) {
        console.log(value);
        res.send(value);
    });
    */
});

db_router.get('/selectAllCoachInfo', (req, res) => {
    res.status(404).send('Sorry, route not yet available');
    /*
    db.selectAll(DB_CONFIG.tableNames.coach_info).then(function(value) {
        console.log(value);
        res.send(value);
    });
    */
});

db_router.get('/selectExemplary', (req, res) => {
    let sql = 'SELECT * FROM ' + DB_CONFIG.tableNames.senior_projects + ' WHERE priority = ?';
    let values = [0];

    db.query(sql, values).then(function(value) {
        res.send(value);
    });
});

/**
 * Responds with a list of links to pdf versions of proposal forms
 */
db_router.get('/getProposalPdfNames', CONFIG.authAdmin, (req, res) => {
    fs.readdir(path.join(__dirname, '../proposal_docs'), function(err, files) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        let fileLinks = [];
        files.forEach(function(file) {
            fileLinks.push(file.toString());
        });
        
        res.send(fileLinks);
    });
});

db_router.get('/getProposalPdf', CONFIG.authAdmin, (req, res) => {
    if (req.query.name) {
        let name = req.query.name.replace(/\\|\//g, ''); // attempt to avoid any path traversal issues
        res.sendFile(path.join(__dirname, '../proposal_docs/' + name));
    } else
        res.send('File not found')
});

db_router.get('/getProposalAttachmentNames', CONFIG.authAdmin, (req, res) => {
    if (req.query.proposalTitle) {
        let proposalTitle = req.query.proposalTitle.replace(/\\|\//g, '') // attempt to avoid any path traversal issues, get the name with no extension
        proposalTitle = proposalTitle.substr(0, proposalTitle.lastIndexOf('.'));
        console.log(proposalTitle)
        fs.readdir(path.join(__dirname, `../sponsor_proposal_files/${proposalTitle}`), function(err, files) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            console.log(files)
            let fileLinks = [];
            files.forEach(function(file) {
                fileLinks.push(file.toString());
            });
            
            res.send(fileLinks);
        });
    }
    else {
        res.status(404).send('Bad request');
    }
});

db_router.get('/getProposalAttachment', CONFIG.authAdmin, (req, res) => {
    if (req.query.proposalTitle && req.query.name) {
        let proposalTitle = req.query.proposalTitle.replace(/\\|\//g, ''); // attempt to avoid any path traversal issues
        proposalTitle = proposalTitle.substr(0, proposalTitle.lastIndexOf('.'))
        console.log(proposalTitle)
        let name = req.query.name.replace(/\\|\//g, ''); // attempt to avoid any path traversal issues

        res.sendFile(path.join(__dirname, '../sponsor_proposal_files/' + proposalTitle + '/' + name))
    } else
        res.send('File not found')
});

//#endregion

db_router.post('/submitProposal', [
    body('title').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000}),
    body('organization').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000}),
    body('primary_contact').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000}),
    body('contact_email').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000}),
    body('contact_phone').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000}),
    body('background_info').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000}),
    body('project_description').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000}),
    body('project_scope').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000}),
    body('project_challenges').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000}),
    body('sponsor_provided_resources').trim().escape().isLength({max: 5000}),
    body('constraints_assumptions').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000}),
    body('sponsor_deliverables').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000}),
    body('proprietary_info').trim().escape().isLength({max: 5000}),
    body('sponsor_alternate_time').trim().escape().isLength({max: 5000}),
    body('sponsor_avail_checked').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('project_agreements_checked').not().isEmpty().trim().escape().withMessage("Cannot be empty"),
    body('assignment_of_rights').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 5000})
],
async (req, res) => {
    var result = validationResult(req);

    
    // Insert into the database
    if (result.errors.length == 0) {
        let sql = `INSERT INTO ${DB_CONFIG.tableNames.senior_projects} 
                (title, organization, primary_contact, contact_email, contact_phone, attachments,
                background_info, project_description, project_scope, project_challenges, 
                sponsor_provided_resources, constraints_assumptions, sponsor_deliverables,
                proprietary_info, sponsor_alternate_time, sponsor_avail_checked, project_agreements_checked, assignment_of_rights) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        
        let body = req.body;

        // prepend date to proposal title
        let date = new Date();
        let timeString = `${date.getFullYear()}-${date.getUTCMonth()}-${date.getDate()}`;          
        body.title = timeString + '_' + body.title;

        let filenamesCSV = '';
        // Attachment Handling
        if (req.files && req.files.attachments) {

            if (req.files.attachments.length > 5) { // Don't allow more than 5 files
                res.sendFile(path.join(CONFIG.www_path, '/html/submittedError.html'));
                return;
            }

            fs.mkdirSync(`../sponsor_proposal_files/${body.title}`, { recursive: true });
            
            for (var x = 0; x < req.files.attachments.length; x++ ) {
                if (req.files.attachments[x].size > 15 * 1024 * 1024 ) { // 15mb limit exceeded
                    res.sendFile(path.join(CONFIG.www_path, '/html/submittedError.html'));
                    return;
                }
                
                if (!CONFIG.accepted_file_types.includes(path.extname(req.files.attachments[x]))) { // send an error if the file is not an accepted type
                    res.sendFile(path.join(CONFIG.www_path, '/html/submittedError.html'));
                    return;
                }

                // Append the file name to the CSV string, begin with a comma if x is not 0
                filenamesCSV += (x == 0) ? `${req.files.attachments[x].name}` : `, ${req.files.attachments[x].name}`;

                req.files.attachments[x].mv(`../sponsor_proposal_files/${body.title}/${req.files.attachments[x].name}`, function(err) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    }
                });
            }
        }

        let params = [
            body.title, body.organization, body.primary_contact, body.contact_email, body.contact_phone, filenamesCSV,
            body.background_info, body.project_description, body.project_scope, body.project_challenges,
            body.sponsor_provided_resources, body.constraints_assumptions, body.sponsor_deliverables,
            body.proprietary_info, body.sponsor_alternate_time, body.sponsor_avail_checked, body.project_agreements_checked,
            body.assignment_of_rights
        ];

        db.query(sql, params).then(() =>{
            let doc = new PDFDoc;
            doc.pipe(fs.createWriteStream(path.join(__dirname, `../proposal_docs/${body.title}.pdf`)));

            doc.font('Times-Roman');

            for (var key of DB_CONFIG.senior_project_proposal_keys) {
                doc.fill('blue').fontSize(16).text(key.replace('/_/g', ' ')), {
                    underline: true
                }; 
                doc.fontSize(12).fill('black').text(body[key]);  // Text value from proposal
                doc.moveDown();
                doc.save();
            }
            
            doc.end();
            res.sendFile(path.join(CONFIG.www_path, '/html/submitted.html'));
           
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
    }
    else {
        res.sendFile(path.join(CONFIG.www_path, '/html/submittedError.html'));
    }
});


db_router.get('/getPoster', (req, res) => {
    let screenedFileName = path.normalize(req.query.fileName).replace(/\\|\//g, ''); // attempt to avoid any path traversal issues

    res.sendFile(path.join(__dirname, '../posters/' + screenedFileName));
});


db_router.get('/getActiveTimelines', CONFIG.authAdmin, (req, res) => {
    calculateActiveTimelines().then((timelines) => {
        res.send(timelines)
    }, (err) => {
        console.log(err)
        res.status(500).send()
    })
}); 

db_router.get('/getTeamTimeline', CONFIG.authAdmin, (req, res) => {
   
});

function calculateActiveTimelines() {
    return new Promise((resolve, reject) => {
        /*
        We need the team name, all the tasks for the semester group,
        and the status of each task for each team.
        the status can be calculated by dynamically checking the 
        action target against entries in the action_log table
        */

        /**
         * Semester Block : [
         *  Timeline
         * ]
         * 
         * Timeline : {
         *  team_name
         *  semester_name
         *  semester_id
         *  actions: [
         *      {
         *          *all action attributes*
         *          state (grey, green, yellow, red)
         *      }
         *  ]
         *  team details (name, email) 
         *  coach details (name, email)
         * }
         */
        
        let activeTimelines = []
        
        let getTeams = 
        `
            SELECT  projects.team_name, 
                    semester_group.name AS "semester_name", 
                    semester_group.semester_id AS "semester_id",
                    (
                        SELECT  "[" || group_concat(
                            "{" ||
                                "'action_title'" || ":" || "'" || action_title || "'" || "," ||
                                "'is_null'" || ":" || "'" || is_null || "'" || "," ||
                                "'desc'" || ":" || "'" || short_desc || "'" || "," ||
                                "'start_date'" || ":" || "'" || start_date || "'" || "," ||
                                "'due_date'" || ":" || "'" || due_date || "'" || "," ||
                                "'target'" || ":" || "'" || action_target || "'" || "," ||
                                "'state'" || ":" || "'" || state || "'" || "," ||
                                "'submitter'" || ":" || "'" || submitter || "'" || "," ||
                                "'page_html'" || ":" || "'" || page_html || "'" || "," ||
                                "'count'" || ":" || "'" || count || "'" ||
                            "}"
                        ) || "]"
                        FROM (
                            SELECT action_title, start_date, due_date, semester, action_target, is_null, short_desc, page_html,
                                CASE
                                    WHEN system_id IS NULL THEN 'null'
                                    WHEN  COUNT(distinct system_id) > 1 THEN group_concat(system_id)
                                    ELSE system_id
                                END AS 'submitter',
                                CASE
                                    WHEN action_target IS 'admin' AND system_id IS NOT NULL THEN 'green'
                                    WHEN action_target IS 'coach' AND system_id IS NOT NULL THEN 'green'
                                    WHEN action_target IS 'team' AND system_id IS NOT NULL THEN 'green'
                                    WHEN action_target IS 'individual' AND COUNT(distinct system_id) IS 4 THEN 'green'
                                    WHEN  start_date <= date('now') AND due_date >= date('now') THEN 'yellow'
                                    WHEN date('now') > due_date AND system_id IS NULL THEN 'red'
                                    ELSE 'grey'
                                END AS 'state',
                                COUNT(distinct system_id) AS count
                            FROM actions
                            LEFT JOIN action_log
                                ON action_log.action_template = actions.action_id
                            GROUP BY actions.action_id
                            ORDER BY actions.start_date ASC
                        )
                        WHERE semester = projects.semester
                    ) actions,
                    (
                        SELECT group_concat(fname || ' ' || lname || ' (' || email || ')')
                        FROM users
                        WHERE projects.project_id = users.project
                    ) team_members,
                    (
                        SELECT group_concat(fname || ' ' || lname || ' (' || email || ')')
                        FROM users
                        WHERE projects.coach1 = users.system_id OR projects.coach2 = users.system_id
                    ) coach
                    
            FROM projects
            LEFT JOIN semester_group 
                ON projects.semester = semester_group.semester_id
            WHERE projects.status = "in progress"
            ORDER BY projects.team_name
        `
        let today = new Date()
        getTeams = getTeams.replace("date('now')", `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)

        db.query(getTeams).then((values) => {
            console.log(values)


            resolve(values)
        }).catch((err) => {
            reject(err)
        })
    })
}

module.exports = db_router;