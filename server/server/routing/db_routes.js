
// Imports
const db_router = require('express').Router();
const { validationResult, body } = require('express-validator');
const PDFDoc = require('pdfkit');
const fs = require('fs');
const path = require('path');

const DB_CONFIG = require('../database/db_config');
const DBHandler = require('../database/db');
const CONFIG = require('../config');
const { nanoid } = require('nanoid');

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
    let getStudentsQuery =
        `
        SELECT *
        FROM users
        LEFT JOIN semester_group
        ON users.semester_group = semester_group.semester_id
        WHERE type = 'student'
        ORDER BY semester_group desc
    `;
    db.query(getStudentsQuery).then((values) => {
        res.send(values);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

db_router.post('/editUser',
    (req, res) => {

        let body = req.body;

        let updateQuery = `
        UPDATE users
        SET fname = ?,
            lname = ?,
            email = ?,
            type = ?,
            semester_group = ?,
            project = ?
        WHERE system_id = ?
    `;

        let params = [
            body.fname,
            body.lname,
            body.email,
            body.type,
            body.semester_group,
            body.project,
            body.system_id
        ];

        // db.query(updateQuery, params).then(() => {
        //     return res.status(200).send();
        // }).catch((err) => {
        //     res.sendStatus(500)
        // })
        return res.status(200).send();

    });

db_router.get('/getActiveSemesters', (req, res) => {
    let getSemestersQuery =
        `
        SELECT *
        FROM semester_group
    `;
    db.query(getSemestersQuery).then((values) => {
        res.send(values);
    }).catch((err) => {
        res.status(500).send(err);
    });
});


db_router.get('/getActiveProjects', (req, res) => {
    let getProjectsQuery =
        `
        SELECT *
        FROM projects
        LEFT JOIN semester_group 
        ON projects.semester = semester_group.semester_id
        WHERE projects.semester IS NOT NULL
    `;
    db.query(getProjectsQuery).then((values) => {
        res.send(values);
    }).catch((err) => {
        res.status(500).send(err);
    });
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
    const { resultLimit, offset } = req.query

    const projectsQuery = `SELECT * FROM ${DB_CONFIG.tableNames.archive}
        WHERE priority >= 0
        AND oid NOT IN (SELECT oid FROM ${DB_CONFIG.tableNames.archive}
                            ORDER BY priority ASC LIMIT ?)
        ORDER BY priority ASC LIMIT ?`;

    const rowCountQuery = `SELECT COUNT(*) FROM ${DB_CONFIG.tableNames.archive} WHERE priority >= 0`;

    const projectsPromise = db.query(projectsQuery, [offset, resultLimit]);
    const rowCountPromise = db.query(rowCountQuery)

    Promise.all([rowCountPromise, projectsPromise]).then(([[rowCount], projects]) => {
        // FIXME: The rowCount variable isn't pretty -- Maybe consider changing how db.query works to better accommodate those kinds of request?
        res.send({totalProjects: rowCount[Object.keys(rowCount)[0]], projects: projects});
    }).catch(error => {
        console.error(error)
        res.status(500).send(error)
    });
});

/**
 * Responds with proposals from database
 * 
 * TODO: Add pagination
 */
db_router.get('/getProposals', CONFIG.authAdmin, async (req, res) => {
    db.selectAll(DB_CONFIG.tableNames.senior_projects)
        .then(proposals => res.send(proposals));
})

/**
 * Updates a proposal with the given information
 */
db_router.patch('/updateProposalStatus', CONFIG.authAdmin, [
        // v-- I'm not entirely sure this does anything
        body('*').trim().escape().isJSON().isAlphanumeric()
    ], (req, res) => {
        const query = `UPDATE ${DB_CONFIG.tableNames.senior_projects} SET status = ? WHERE project_id = ?`
        db.query(query, [req.body.status, req.body.project_id])
            .then(() => {
                res.sendStatus(200);
            }).catch((error) => {
                console.error(error);
                res.sendStatus(500);
            })
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
        fs.readdir(path.join(__dirname, `./server/sponsor_proposal_files/${proposalTitle}`), function(err, files) {
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
        let name = req.query.name.replace(/\\|\//g, ''); // attempt to avoid any path traversal issues
        res.sendFile(path.join(__dirname, '../sponsor_proposal_files/' + proposalTitle + '/' + name))
    } else
        res.send('File not found')
});

//#endregion

db_router.post('/submitProposal', [
    // TODO: Should the max length be set to something smaller than 5000?
    body('title').not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({max: 50}),
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
    let result = validationResult(req);

    // Insert into the database
    if (result.errors.length == 0) {
        
        let body = req.body;

        // prepend date to proposal title
        let date = new Date();
        let timeString = `${date.getFullYear()}-${date.getUTCMonth()}-${date.getDate()}`;          
        const title = `${timeString}_${nanoid()}_${body.title.substring(0,30)}`

        let filenamesCSV = '';
        // Attachment Handling
        if (req.files && req.files.attachments) {

            if (req.files.attachments.length > 5) { // Don't allow more than 5 files
                return res.status(400).send("Maximum of 5 files allowed");
            }

            fs.mkdirSync(`./server/sponsor_proposal_files/${title}`, { recursive: true });
            
            for (let x = 0; x < req.files.attachments.length; x++ ) {
                if (req.files.attachments[x].size > 15 * 1024 * 1024 ) { // 15mb limit exceeded
                    return res.status(400).send("File too large");
                }
                if (!CONFIG.accepted_file_types.includes(path.extname(req.files.attachments[x].name))) { // send an error if the file is not an accepted type
                    return res.status(400).send("Filetype not accepted");
                }

                // Append the file name to the CSV string, begin with a comma if x is not 0
                filenamesCSV += (x === 0) ? `${req.files.attachments[x].name}` : `, ${req.files.attachments[x].name}`;

                req.files.attachments[x].mv(`./server/sponsor_proposal_files/${title}/${req.files.attachments[x].name}`, function(err) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    }
                });
            }
        }
        const sql = `INSERT INTO ${DB_CONFIG.tableNames.senior_projects} 
                (status, title, display_name, organization, primary_contact, contact_email, contact_phone, attachments,
                background_info, project_description, project_scope, project_challenges, 
                sponsor_provided_resources, constraints_assumptions, sponsor_deliverables,
                proprietary_info, sponsor_alternate_time, sponsor_avail_checked, project_agreements_checked, assignment_of_rights) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const params = [
            "submitted", title, body.title, body.organization, body.primary_contact, body.contact_email, body.contact_phone, filenamesCSV,
            body.background_info, body.project_description, body.project_scope, body.project_challenges,
            body.sponsor_provided_resources, body.constraints_assumptions, body.sponsor_deliverables,
            body.proprietary_info, body.sponsor_alternate_time, body.sponsor_avail_checked, body.project_agreements_checked,
            body.assignment_of_rights
        ];

        db.query(sql, params).then(() =>{
            let doc = new PDFDoc;
            doc.pipe(fs.createWriteStream(path.join(__dirname, `../proposal_docs/${title}.pdf`)));

            doc.font('Times-Roman');

            for (let key of DB_CONFIG.senior_project_proposal_keys) {
                doc.fill('blue').fontSize(16).text(key.replace('/_/g', ' ')), {
                    underline: true
                }; 
                doc.fontSize(12).fill('black').text(body[key]);  // Text value from proposal
                doc.moveDown();
                doc.save();
            }
            
            doc.end();
            return res.status(200).send();
        }).catch((err) => {
            console.log(err);
            return res.status(500).send(err);
        })
    }
    else {
        return res.status(400).send("Input is invalid");
    }
});


db_router.get('/getPoster', (req, res) => {
    let screenedFileName = path.normalize(req.query.fileName).replace(/\\|\//g, ''); // attempt to avoid any path traversal issues

    res.sendFile(path.join(__dirname, '../posters/' + screenedFileName));
});


db_router.get('/getActiveTimelines', (req, res) => {
    calculateActiveTimelines().then((timelines) => {
        res.send(timelines)
    }, (err) => {
        console.log(err)
        res.status(500).send()
    })
}); 

db_router.get('/getTeamTimeline', (req, res) => {

});

db_router.post('/submitAction', [
    body('*').trim().escape()
], (req, res) => {
    let result = validationResult(req);
    console.log(req.body)
    console.log(req.files)
    let body = req.body;
    let insertAction = `
        INSERT INTO action_log(
            action_template,
            system_id,
            project,
            form_data,
            files
            )
        VALUES (?,?,?,?,?)
    `
    let params = [
        body.action_template,
        body.system_id,
        body.project,
        body.form_data,
        req.files
    ]
    // db.query(insertAction, params).then(() => {
    //
    // }).catch((err) => {
    //     res.sendStatus(500)
    // })
    // res.sendFile(path.join(CONFIG.www_path, '/html/actionSubmission.html'))
    return res.status(200).send();

});

db_router.get('/getActions', (req, res) => {
    let getActionsQuery =
    `
        SELECT *
        FROM actions
        JOIN semester_group
        ON actions.semester = semester_group.semester_id
        ORDER BY action_id desc
    `;
    db.query(getActionsQuery).then((values) => {
        res.send(values);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

db_router.post('/editAction',
    body('page_html').unescape()
, (req, res) => {

    let body = req.body;

    let updateQuery = `
        UPDATE actions
        SET semester = ?,
            action_title = ?,
            action_target = ?,
            is_null = ?,
            short_desc = ?,
            start_date = ?,
            due_date = ?,
            page_html = ?
        WHERE action_id = ?
    `;

    let params = [
        body.semester,
        body.action_title,
        body.action_target,
        body.is_null,
        body.short_desc,
        body.start_date,
        body.due_date,
        body.page_html,
        body.action_id
    ];

    db.query(updateQuery, params).then(() => {
        return res.status(200).send();
    }).catch((err) => {
        return res.status(500).send(err)
    });

});

db_router.get('/getSemesters', (req, res) => {
    let getSemestersQuery =
    `
        SELECT *
        FROM semester_group
        ORDER BY semester_id desc
    `;
    db.query(getSemestersQuery).then((values) => {
        res.send(values);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

db_router.post('/editSemester', [
    body('*').trim()
], (req, res) => {

    let body = req.body;

    let updateQuery = `
        UPDATE semester_group
        SET name = ?,
            dept = ?,
            start_date = ?,
            end_date = ?
        WHERE semester_id = ?
    `

    let params = [
        body.name,
        body.dept,
        body.start_date,
        body.end_date,
        body.semester_id
    ];

    console.log('query and params', updateQuery, params);

    db.query(updateQuery, params).then(() => {
        return res.status(200).send();
    }).catch((err) => {
        return res.status(500).send(err)
    });

});

function calculateActiveTimelines() {
    return new Promise((resolve, reject) => {
        
        let getTeams = 
        `
            SELECT  projects.team_name, 
                    semester_group.name AS "semester_name", 
                    semester_group.semester_id AS "semester_id",
                    semester_group.end_date AS "end_date",
                    (
                        SELECT  "[" || group_concat(
                            "{" ||
                                """action_title"""  || ":" || """" || action_title  || """" || "," ||
                                """action_id"""     || ":" || """" || action_id      || """" || "," ||
                                """is_null"""       || ":" || """" || is_null       || """" || "," ||
                                """short_desc"""    || ":" || """" || short_desc    || """" || "," ||
                                """start_date"""    || ":" || """" || start_date    || """" || "," ||
                                """due_date"""      || ":" || """" || due_date      || """" || "," ||
                                """target"""        || ":" || """" || action_target || """" || "," ||
                                """state"""         || ":" || """" || state         || """" || "," ||
                                """submitter"""     || ":" || """" || submitter     || """" || "," ||
                                """page_html"""     || ":" || """" || page_html     || """" || "," ||
                                """count"""         || ":" || """" || count         || """" ||
                            "}"
                        ) || "]"
                        FROM (
                            SELECT action_title, action_id, start_date, due_date, semester, action_target, is_null, short_desc, page_html,
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
            ORDER BY projects.semester DESC
        `
        let today = new Date() // Fat workaround, sqlite is broken doo doo
        getTeams = getTeams.split("date('now')").join( `'${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}'`)
        
        db.query(getTeams).then((values) => {
            for(let timeline in values) {
                values[timeline].actions = JSON.parse(values[timeline].actions.replace(/\r?\n|\r|\s{2,}/g, ''))
                values[timeline].actions = values[timeline].actions.sort(function(a, b) {
                    return Date.parse(a.start_date) - Date.parse(b.start_date)
                })
            }
            resolve(values)
        }).catch((err) => {
            reject(err)
        })
    })
}

module.exports = db_router;