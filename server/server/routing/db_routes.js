// Imports
const UserAuth = require("./user_auth");
const db_router = require("express").Router();
const { validationResult, body } = require("express-validator");
const PDFDoc = require("pdfkit");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const DB_CONFIG = require("../database/db_config");
const DBHandler = require("../database/db");
const CONFIG = require("../config");
const { nanoid } = require("nanoid");
const CONSTANTS = require("../consts");
const { ROLES } = require("../consts");

const ACTION_TARGETS = {
    ADMIN: 'admin',
    COACH: 'coach',
    TEAM: 'team',
    INDIVIDUAL: 'individual',
    COACH_ANNOUNCEMENT: 'coach_announcement',
    STUDENT_ANNOUNCEMENT: 'student_announcement',
};

// Globals
let db = new DBHandler();

// Routes

db_router.get("/whoami", [UserAuth.isSignedIn], (req, res) => {
    res.send(req.user);
});

db_router.get("/selectAllSponsorInfo", [UserAuth.isCoachOrAdmin], (req, res) => {
    db.selectAll(DB_CONFIG.tableNames.sponsor_info).then(function (value) {
        res.send(value);
    });
});

db_router.get("/selectAllStudentInfo", [UserAuth.isCoachOrAdmin], (req, res) => {
    let getStudentsQuery = `
        SELECT *
        FROM users
        LEFT JOIN semester_group
        ON users.semester_group = semester_group.semester_id
        WHERE type = 'student'
        ORDER BY semester_group desc
    `;
    db.query(getStudentsQuery)
        .then((values) => {
            res.send(values);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});


db_router.get("/getMyStudents", [UserAuth.isCoachOrAdmin], (req, res) => {

    let query = "";
    let params = [];
    switch (req.user.type) {
        case ROLES.COACH:
            query = `SELECT users.* FROM users
                WHERE users.project IN (
                    SELECT project_coaches.project_id FROM project_coaches
                    WHERE project_coaches.coach_id = ?
                )`;
            params = [req.user.system_id];
            break;
        case ROLES.ADMIN:
            query = `SELECT * FROM users
                LEFT JOIN semester_group
                ON users.semester_group = semester_group.semester_id
                WHERE users.type = 'student'`;
            break;

        default:
            break;
    }

    db.query(query, params)
        .then((users) => res.send(users))
        .catch((err) => {
            console.error(err);
            return res.status(500).send(err);
        });
});


db_router.get("/getProjectMembers", [UserAuth.isSignedIn], (req, res) => {

    let query = `SELECT users.*, project_coaches.project_id FROM users
        LEFT JOIN project_coaches ON project_coaches.coach_id = users.system_id
        WHERE users.project = ? OR project_coaches.project_id = ?`;

    params = [req.query.project_id, req.query.project_id]

    db.query(query, params).then((users) => res.send(users));
});


// gets all users
db_router.get("/getActiveUsers", [UserAuth.isAdmin], (req, res) => {
    let query = `SELECT system_id, fname, lname, type
        FROM users
        WHERE active = ''`;
    db.query(query).then((users) => res.send(users));
});

db_router.post("/createUser", [
    UserAuth.isAdmin,
    body("system_id").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }),
    body("fname").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }),
    body("lname").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }),
    body("email").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }),
    body("type").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }),
    body("semester_group").isLength({ max: 50 }),
    body("project").isLength({ max: 50 }),
    body("active").trim().escape().isLength({ max: 50 }),
],
    async (req, res) => {
        let result = validationResult(req);

        if (result.errors.length !== 0) {
            return res.status(400).send(result);
        }

        let body = req.body;

        const sql = `INSERT INTO ${DB_CONFIG.tableNames.users} 
            (system_id, fname, lname, email, type, semester_group, project, active) 
            VALUES (?,?,?,?,?,?,?,?)`;

        const active = body.active === 'false' ? moment().format(CONSTANTS.datetime_format) : "";

        const params = [
            body.system_id,
            body.fname,
            body.lname,
            body.email,
            body.type,
            body.semester_group,
            body.project,
            active,
        ];
        db.query(sql, params)
            .then(() => {
                return res.status(200).send();
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).send(err);
            });
    }
);

db_router.post("/batchCreateUser", [
    UserAuth.isAdmin,
    // TODO: Add more validation
],
    async (req, res) => {
        let result = validationResult(req);

        if (result.errors.length !== 0) {
            return res.status(400).send(result);
        }

        let users = JSON.parse(req.body.users);

        const insertStatements = users.map(user => {
            const active = user.active.toLocaleLowerCase() === 'false' ? moment().format(CONSTANTS.datetime_format) : "";
            return `('${user.system_id}','${user.fname}','${user.lname}','${user.email}','${user.type}',${user.semester_group === "" ? null : `'${user.semester_group}'`},'${active}')`
        });

        const sql = `INSERT INTO ${DB_CONFIG.tableNames.users} (system_id, fname, lname, email, type, semester_group, active) VALUES ${insertStatements.join(",")}`;

        db.query(sql)
            .then((values) => {
                return res.status(200).send(values);
            })
            .catch((err) => {
                return res.status(500).send(err);
            });
    }
);


db_router.post("/editUser", [UserAuth.isAdmin], (req, res) => {
    let body = req.body;

    let updateQuery = `
        UPDATE users
        SET fname = ?,
            lname = ?,
            email = ?,
            type = ?,
            semester_group = ?,
            project = ?,
            active = ?
        WHERE system_id = ?
    `;

    const active = body.active === 'false' ? moment().format(CONSTANTS.datetime_format) : "";

    let params = [
        body.fname,
        body.lname,
        body.email,
        body.type,
        JSON.parse(body.semester_group),
        JSON.parse(body.project),
        active,
        body.system_id,
    ];

    db.query(updateQuery, params)
        .then(() => {
            return res.status(200).send();
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send(err);
        });
});

db_router.get("/getActiveProjects", [UserAuth.isSignedIn], (req, res) => {
    let getProjectsQuery = `
        SELECT *
        FROM projects
        LEFT JOIN semester_group 
        ON projects.semester = semester_group.semester_id
        WHERE projects.semester IS NOT NULL
    `;
    db.query(getProjectsQuery)
        .then((values) => {
            res.send(values);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

db_router.get("/getActiveCoaches", [UserAuth.isCoachOrAdmin], (req, res) => {
    const sql = `SELECT * FROM users WHERE type = '${ROLES.COACH}' AND active = ''`;

    db.query(sql)
        .then((coaches) => {
            res.send(coaches);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
});

db_router.get("/getProjectCoaches", [UserAuth.isCoachOrAdmin], (req, res) => {

    const getProjectCoaches = `SELECT users.* FROM users 
        LEFT JOIN project_coaches ON project_coaches.coach_id = users.system_id
        WHERE project_coaches.project_id = ?`;

    db.query(getProjectCoaches, [req.query.project_id])
        .then((coaches) => {
            res.send(coaches)
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
})

db_router.get("/getProjectStudents", [UserAuth.isCoachOrAdmin], (req, res) => {

    const getProjectStudents = "SELECT * FROM users WHERE users.project = ?";

    db.query(getProjectStudents, [req.query.project_id])
        .then((students) => {
            res.send(students)
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
})

db_router.get("/selectAllCoachInfo", [UserAuth.isCoachOrAdmin], (req, res) => {

    const getCoachInfoQuery = `
        SELECT users.system_id,
        users.fname,
        users.lname,
        users.email,
        users.semester_group,
        (
            SELECT "[" || group_concat(
                "{" ||
                    """title"""         || ":" || """" || COALESCE(projects.display_name, projects.title) || """" || "," ||
                    """semester_id"""   || ":" || """" || projects.semester                               || """" || "," ||
                    """project_id"""    || ":" || """" || projects.project_id                             || """" || "," ||
                    """organization"""  || ":" || """" || projects.organization                           || """" || "," ||
                    """status"""        || ":" || """" || projects.status                                 || """" ||
                "}"
            ) || "]"
            FROM project_coaches
            LEFT JOIN projects ON projects.project_id = project_coaches.project_id
            WHERE project_coaches.coach_id = users.system_id
        ) projects
        FROM users
        WHERE users.type = "${ACTION_TARGETS.COACH}"
    `;

    db.query(getCoachInfoQuery)
        .then((coaches) => {
            res.send(coaches)
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
});

db_router.get("/selectExemplary", (req, res) => {
    const { resultLimit, offset } = req.query;

    const projectsQuery = `SELECT * FROM ${DB_CONFIG.tableNames.archive}
        WHERE priority >= 0
        AND oid NOT IN (SELECT oid FROM ${DB_CONFIG.tableNames.archive}
                            ORDER BY priority ASC LIMIT ?)
        ORDER BY priority ASC LIMIT ?`;

    const rowCountQuery = `SELECT COUNT(*) FROM ${DB_CONFIG.tableNames.archive} WHERE priority >= 0`;

    const projectsPromise = db.query(projectsQuery, [offset, resultLimit]);
    const rowCountPromise = db.query(rowCountQuery);

    Promise.all([rowCountPromise, projectsPromise])
        .then(([[rowCount], projects]) => {
            // FIXME: The rowCount variable isn't pretty -- Maybe consider changing how db.query works to better accommodate those kinds of request?
            res.send({ totalProjects: rowCount[Object.keys(rowCount)[0]], projects: projects });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
});

/**
 * Responds with projects from database
 *
 * TODO: Add pagination
 */
db_router.get("/getProjects", [UserAuth.isCoachOrAdmin], async (req, res) => {
    const query = "SELECT * from projects";
    db.query(query)
        .then((projects) => res.send(projects))
        .catch(err => res.status(500).send(err));
});


db_router.get("/getCandidateProjects", [UserAuth.isSignedIn], async (req, res) => {
    const query = "SELECT * from projects WHERE projects.status = 'candidate';"
    db.query(query)
        .then((projects) => res.send(projects))
        .catch(err => res.status(500).send(err));
});


db_router.get("/getMyProjects", [UserAuth.isSignedIn], async (req, res) => {
    let query;
    let params;
    switch (req.user.type) {
        case ROLES.COACH:
            query = `SELECT projects.*
            FROM projects
            INNER JOIN project_coaches
            ON (projects.project_id = project_coaches.project_id AND project_coaches.coach_id = ?);`
            params = [req.user.system_id];
            break;
        case ROLES.STUDENT:
            query = `SELECT users.system_id, projects.*
            FROM users
            INNER JOIN projects
            ON users.system_id = ? AND projects.project_id = users.project;`
            params = [req.user.system_id];
            break;
        case ROLES.ADMIN:
            query = "SELECT * FROM projects WHERE projects.status NOT IN ('in progress', 'completed', 'rejected', 'archive');"
            params = [];
            break;
        default:
            res.status(500).send("Invalid user type...something must be very very broken...");
            return;
    }

    db.query(query, params)
        .then((proposals) => res.send(proposals))
        .catch(err => res.status(500).send(err));
});

db_router.post(
    "/editProject",
    [
        UserAuth.isAdmin,
        // TODO: Should the max length be set to something smaller than 5000?
        body("title").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }),
        body("organization").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("primary_contact").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("contact_email").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("contact_phone").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("background_info").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("project_description")
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage("Cannot be empty")
            .isLength({ max: 5000 }),
        body("project_scope").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("project_challenges")
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage("Cannot be empty")
            .isLength({ max: 5000 }),
        body("constraints_assumptions")
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage("Cannot be empty")
            .isLength({ max: 5000 }),
        body("sponsor_provided_resources").trim().escape().isLength({ max: 5000 }),
        body("project_search_keywords").trim().escape().isLength({ max: 5000 }),
        body("sponsor_deliverables")
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage("Cannot be empty")
            .isLength({ max: 5000 }),
        body("proprietary_info").trim().escape().isLength({ max: 5000 }),
        body("sponsor_alternate_time").trim().escape().isLength({ max: 5000 }),
        body("sponsor_avail_checked").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        body("project_agreements_checked").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        body("assignment_of_rights")
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage("Cannot be empty")
            .isLength({ max: 5000 }),

        body("team_name").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        body("poster").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        body("video").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        body("website").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        body("synopsis").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        body("sponsor").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        body("semester").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        // body("date").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        body("projectCoaches").trim().escape().isLength({ max: 5000 }),
    ],
    async (req, res) => {

        let body = req.body;

        const updateProjectSql = `UPDATE ${DB_CONFIG.tableNames.senior_projects}
        SET status=?, title=?, display_name=?, organization=?, primary_contact=?, contact_email=?, contact_phone=?,
        background_info=?, project_description=?, project_scope=?, project_challenges=?, 
        sponsor_provided_resources=?, project_search_keywords=?, constraints_assumptions=?, sponsor_deliverables=?,
        proprietary_info=?, sponsor_alternate_time=?, sponsor_avail_checked=?, project_agreements_checked=?, assignment_of_rights=?, 
        team_name=?, poster=?, video=?, website=?, synopsis=?, sponsor=?, semester=?
        WHERE project_id = ?`;

        const updateProjectParams = [
            body.status,
            body.title,
            body.display_name ? body.display_name : null,   // Empty strings should be turned to null
            body.organization,
            body.primary_contact,
            body.contact_email,
            body.contact_phone,
            body.background_info,
            body.project_description,
            body.project_scope,
            body.project_challenges,
            body.sponsor_provided_resources,
            body.project_search_keywords,
            body.constraints_assumptions,
            body.sponsor_deliverables,
            body.proprietary_info,
            body.sponsor_alternate_time,
            body.sponsor_avail_checked,
            body.project_agreements_checked,
            body.assignment_of_rights,
            body.team_name,
            body.poster,
            body.video,
            body.website,
            body.synopsis,
            body.sponsor,
            JSON.parse(body.semester),
            body.project_id,
        ];

        const insertValues = body.projectCoaches.split(",").map(coachId => ` ('${body.project_id}', '${coachId}')`);
        const deleteValues = body.projectCoaches.split(",").map(coachId => `'${coachId}'`);
        const updateCoachesSql = `INSERT OR IGNORE INTO '${DB_CONFIG.tableNames.project_coaches}' ('project_id', 'coach_id') VALUES ${insertValues};`
        const deleteCoachesSQL = `DELETE FROM '${DB_CONFIG.tableNames.project_coaches}'
                                    WHERE project_coaches.project_id = '${body.project_id}'
                                    AND project_coaches.coach_id NOT IN (${deleteValues});`

        Promise.all([
            db.query(updateProjectSql, updateProjectParams),
            db.query(updateCoachesSql),
            db.query(deleteCoachesSQL),
        ]).then((values) => {
            return res.sendStatus(200);
        }).catch((err) => {
            console.error(err);
            return res.status(500).send(err);
        });
    }
);

/**
 * Updates a proposal with the given information
 */
db_router.patch(
    "/updateProposalStatus",
    [
        CONFIG.authAdmin,
        body("*").trim().escape().isJSON().isAlphanumeric(),
    ],
    (req, res) => {
        const query = `UPDATE ${DB_CONFIG.tableNames.senior_projects} SET status = ? WHERE project_id = ?`;
        db.query(query, [req.body.status, req.body.project_id])
            .then(() => {
                res.sendStatus(200);
            })
            .catch((error) => {
                console.error(error);
                res.sendStatus(500);
            });
    }
);

/**
 * Responds with a list of links to pdf versions of proposal forms
 *
 * NOTE: This route is unused and untested.
 */
db_router.get("/getProposalPdfNames", CONFIG.authAdmin, (req, res) => {
    fs.readdir(path.join(__dirname, "../proposal_docs"), function (err, files) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        let fileLinks = [];
        files.forEach(function (file) {
            fileLinks.push(file.toString());
        });

        res.send(fileLinks);
    });
});

db_router.get("/getProposalPdf", CONFIG.authAdmin, (req, res) => {
    if (req.query.project_id) {
        let projectId = req.query.project_id.replace(/\\|\//g, ""); // attempt to avoid any path traversal issues
        res.sendFile(path.join(__dirname, `../proposal_docs/${projectId}.pdf`));
    } else res.send("File not found");
});

// NOTE: This route is unused and untested.
db_router.get("/getProposalAttachmentNames", UserAuth.isSignedIn, (req, res) => {
    if (req.query.project_id) {
        let projectId = req.query.project_id.replace(/\\|\//g, ""); // attempt to avoid any path traversal issues, get the name with no extension
        fs.readdir(path.join(__dirname, `./server/sponsor_proposal_files/${projectId}`), function (err, files) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            let fileLinks = [];
            files.forEach(function (file) {
                fileLinks.push(file.toString());
            });

            res.send(fileLinks);
        });
    } else {
        res.status(404).send("Bad request");
    }
});

db_router.get("/getProposalAttachment", CONFIG.authAdmin, (req, res) => {
    if (req.query.project_id && req.query.name) {
        let projectId = req.query.project_id.replace(/\\|\//g, ""); // attempt to avoid any path traversal issues
        let name = req.query.name.replace(/\\|\//g, ""); // attempt to avoid any path traversal issues
        res.sendFile(path.join(__dirname, `../sponsor_proposal_files/${projectId}/${name}`));
    } else res.send("File not found");
});

//#endregion

db_router.post(
    "/submitProposal",
    [
        // TODO: Should the max length be set to something smaller than 5000?
        body("title").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }).withMessage("Title must be under 50 characters"),
        body("organization").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("primary_contact").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("contact_email").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("contact_phone").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("background_info").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("project_description")
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage("Cannot be empty")
            .isLength({ max: 5000 }),
        body("project_scope").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 5000 }),
        body("project_challenges")
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage("Cannot be empty")
            .isLength({ max: 5000 }),
        body("sponsor_provided_resources").trim().escape().isLength({ max: 5000 }),
        body("constraints_assumptions")
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage("Cannot be empty")
            .isLength({ max: 5000 }),
        body("sponsor_deliverables")
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage("Cannot be empty")
            .isLength({ max: 5000 }),
        body("proprietary_info").trim().escape().isLength({ max: 5000 }),
        body("sponsor_alternate_time").trim().escape().isLength({ max: 5000 }),
        body("sponsor_avail_checked").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        body("project_agreements_checked").not().isEmpty().trim().escape().withMessage("Cannot be empty"),
        body("assignment_of_rights")
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage("Cannot be empty")
            .isLength({ max: 5000 }),
    ],
    async (req, res) => {
        let result = validationResult(req);

        if (result.errors.length !== 0) {
            return res.status(400).send(result);
        }

        // Insert into the database
        let body = req.body;

        let date = new Date();
        let timeString = `${date.getFullYear()}-${date.getUTCMonth()}-${date.getDate()}`;
        const projectId = `${timeString}_${nanoid()}`;

        let filenamesCSV = "";
        // Attachment Handling
        if (req.files && req.files.attachments) {

            // If there is only one attachment, then it does not come as a list
            if (req.files.attachments.length === undefined) {
                req.files.attachments = [req.files.attachments];
            }

            if (req.files.attachments.length > 5) {
                // Don't allow more than 5 files
                return res.status(400).send({ errors: [{ param: "files", msg: "Maximum of 5 files allowed" }] });
            }

            fs.mkdirSync(`./server/sponsor_proposal_files/${projectId}`, { recursive: true });

            for (let x = 0; x < req.files.attachments.length; x++) {
                if (req.files.attachments[x].size > 15 * 1024 * 1024) {
                    // 15mb limit exceeded
                    return res.status(400).send({ errors: [{ param: "files", msg: "File too large" }] });
                }
                if (!CONFIG.accepted_file_types.includes(path.extname(req.files.attachments[x].name))) {
                    // send an error if the file is not an accepted type
                    return res.status(400).send({ errors: [{ param: "files", msg: "Filetype not accepted" }] });
                }

                // Append the file name to the CSV string, begin with a comma if x is not 0
                filenamesCSV += x === 0 ? `${req.files.attachments[x].name}` : `, ${req.files.attachments[x].name}`;

                req.files.attachments[x].mv(
                    `./server/sponsor_proposal_files/${projectId}/${req.files.attachments[x].name}`,
                    function (err) {
                        if (err) {
                            console.error(err);
                            return res.status(500).send(err);
                        }
                    }
                );
            }
        }
        const sql = `INSERT INTO ${DB_CONFIG.tableNames.senior_projects}
            (project_id, status, title, organization, primary_contact, contact_email, contact_phone, attachments,
            background_info, project_description, project_scope, project_challenges, 
            sponsor_provided_resources, constraints_assumptions, sponsor_deliverables,
            proprietary_info, sponsor_alternate_time, sponsor_avail_checked, project_agreements_checked, assignment_of_rights) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const params = [
            projectId,
            "submitted",
            body.title.substring(0, 50),
            body.organization,
            body.primary_contact,
            body.contact_email,
            body.contact_phone,
            filenamesCSV,
            body.background_info,
            body.project_description,
            body.project_scope,
            body.project_challenges,
            body.sponsor_provided_resources,
            body.constraints_assumptions,
            body.sponsor_deliverables,
            body.proprietary_info,
            body.sponsor_alternate_time,
            body.sponsor_avail_checked,
            body.project_agreements_checked,
            body.assignment_of_rights,
        ];

        db.query(sql, params)
            .then(() => {
                let doc = new PDFDoc();
                doc.pipe(fs.createWriteStream(path.join(__dirname, `../proposal_docs/${projectId}.pdf`)));

                doc.font("Times-Roman");

                for (let key of DB_CONFIG.senior_project_proposal_keys) {
                    doc.fill("blue").fontSize(16).text(key.replace("/_/g", " ")),
                    {
                        underline: true,
                    };
                    doc.fontSize(12).fill("black").text(body[key]); // Text value from proposal
                    doc.moveDown();
                    doc.save();
                }

                doc.end();
                return res.status(200).send();
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).send(err);
            });
    }
);

db_router.get("/getPoster", (req, res) => {
    let screenedFileName = path.normalize(req.query.fileName).replace(/\\|\//g, ""); // attempt to avoid any path traversal issues

    res.sendFile(path.join(__dirname, "../posters/" + screenedFileName));
});

db_router.get("/getActiveTimelines", [UserAuth.isSignedIn], (req, res) => {
    calculateActiveTimelines(req.user).then(
        (timelines) => {
            res.send(timelines);
        }
    ).catch(
        (err) => {
            console.error(err);
            res.status(500).send();
        });
});

db_router.get("/getTeamTimeline", (req, res) => { });

db_router.post("/submitAction", [UserAuth.isSignedIn, body("*").trim()], async (req, res) => {
    let result = validationResult(req);

    if (result.errors.length !== 0) {
        return res.status(400).send("Input is invalid");
    }

    let body = req.body;

    const query = `SELECT * FROM actions WHERE action_id = ?;`
    const [action] = await db.query(query, [body.action_template]);

    const startDate = new Date(action.start_date);
    if (startDate > Date.now()) {
        return res.status(400).send("Can not submit action before start date.");
    }

    switch (action.action_target) {
        case ACTION_TARGETS.ADMIN:
            if (req.user.type !== ROLES.ADMIN) {
                return res.status(401).send("Only admins can submit admin actions.");
            }
            break;
        case ACTION_TARGETS.COACH:
            if (req.user.type !== ROLES.COACH && req.user.type !== ROLES.ADMIN) {
                return res.status(401).send("Only admins and coaches can submit coach actions.");
            }
            break;
        case ACTION_TARGETS.INDIVIDUAL:
            if (req.user.type !== ROLES.STUDENT) {
                return res.status(401).send("Only students can submit individual actions.");
            }
            break;
        case ACTION_TARGETS.COACH_ANNOUNCEMENT:
        case ACTION_TARGETS.STUDENT_ANNOUNCEMENT:
            return res.status(401).send("You can not submit an announcement");
            break;
        case ACTION_TARGETS.TEAM:
            // Anyone can submit team actions
            break;
        default:
            return res.status(500).send("Invalid action target.");
    }

    let date = new Date();
    let timeString = `${date.getFullYear()}-${date.getUTCMonth()}-${date.getDate()}`;
    const submission = `${timeString}_${nanoid()}`;

    // TODO: When authentication is added, system_id should come from the req.
    let baseURL = `./server/project_docs/${body.project}/${action.action_target}/${action.action_id}/${req.user.system_id}/${submission}`;

    // Attachment Handling
    let filenamesCSV = "";
    if (req.files && req.files.attachments) {

        // If there is only one attachment, then it does not come as a list
        if (req.files.attachments.length === undefined) {
            req.files.attachments = [req.files.attachments];
        }

        if (req.files.attachments.length > 5) {
            // Don't allow more than 5 files
            return res.status(400).send("Maximum of 5 files allowed");
        }

        fs.mkdirSync(baseURL, { recursive: true });

        for (let x = 0; x < req.files.attachments.length; x++) {
            if (req.files.attachments[x].size > 15 * 1024 * 1024) {
                // 15mb limit exceeded
                return res.status(400).send("File too large");
            }
            if (!action.file_types.split(",").includes(path.extname(req.files.attachments[x].name).toLocaleLowerCase())) {
                // send an error if the file is not an accepted type
                return res.status(400).send("Filetype not accepted");
            }

            // Append the file name to the CSV string, begin with a comma if x is not 0
            filenamesCSV += x === 0 ? `${submission}/${req.files.attachments[x].name}` : `, ${submission}/${req.files.attachments[x].name}`;

            req.files.attachments[x].mv(
                `${baseURL}/${req.files.attachments[x].name}`,
                function (err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                }
            );
        }
    }

    let insertAction = `
        INSERT INTO action_log(
            action_template,
            system_id,
            project,
            form_data,
            files
            ${req.user.mock && ",mock_id" || ""}
            )
        VALUES (?,?,?,?,?${req.user.mock && ",?" || ""})
    `;

    let params = [body.action_template, req.user.system_id, body.project, body.form_data, filenamesCSV];
    if (req.user.mock) {
        params.push(req.user.mock.system_id);
    }

    db.query(insertAction, params)
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

db_router.get("/getActions", [UserAuth.isAdmin], (req, res) => {
    let getActionsQuery = `
        SELECT *
        FROM actions
        ORDER BY action_id desc
    `;
    db.query(getActionsQuery)
        .then((values) => {
            res.send(values);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

db_router.get("/getTimelineActions", [UserAuth.isSignedIn], async (req, res) => {

    // Students can't access other team's timelines but coaches and admins can access anyone's timelines
    const accessCheck = await db.query("SELECT project, type FROM users WHERE users.system_id = ?", [req.user.system_id]);
    if (accessCheck.filter((item) => item.project === req.query.project_id).length === 0 && req.user.type !== ROLES.ADMIN && req.user.type !== ROLES.COACH) {
        return res.sendStatus(401);
    }

    let getTimelineActions = `SELECT action_title, action_id, start_date, due_date, semester, action_target, date_deleted, short_desc, file_types, page_html,
            CASE
                WHEN action_target IS 'admin' AND system_id IS NOT NULL THEN 'green'
                WHEN action_target IS 'coach' AND system_id IS NOT NULL THEN 'green'
                WHEN action_target IS 'team' AND system_id IS NOT NULL THEN 'green'
                WHEN action_target IS 'individual' AND COUNT(distinct system_id) IS (SELECT DISTINCT COUNT(*) FROM users WHERE users.project=?) THEN 'green'
                WHEN start_date <= date('now') AND due_date >= date('now') THEN 'yellow'
                WHEN date('now') > due_date AND system_id IS NULL THEN 'red'
                WHEN date('now') > due_date AND action_target IS 'individual' AND COUNT(distinct system_id) IS NOT (SELECT DISTINCT COUNT(*) FROM users WHERE users.project=?) THEN 'red'
                WHEN date('now') < start_date THEN 'grey'
                ELSE 'UNHANDLED-CASE'
            END AS 'state'
        FROM actions
        LEFT JOIN action_log
            ON action_log.action_template = actions.action_id AND action_log.project = ?
            WHERE actions.date_deleted = '' AND actions.semester = (SELECT distinct projects.semester FROM projects WHERE projects.project_id = ?)
            AND actions.action_target NOT IN ('${ACTION_TARGETS.COACH_ANNOUNCEMENT}', '${ACTION_TARGETS.STUDENT_ANNOUNCEMENT}')
        GROUP BY actions.action_id`;

    db.query(getTimelineActions, [req.query.project_id, req.query.project_id, req.query.project_id, req.query.project_id])
        .then((values) => {
            res.send(values);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

db_router.get("/getActionLogs", (req, res) => {
    let getActionLogQuery = "";
    let params = [];

    switch (req.user.type) {
        case ROLES.STUDENT:
            // AND ? in (SELECT users.project FROM users WHERE users.system_id = ?) <-- This is done so that users can't just change the network request to see other team's submissions
            getActionLogQuery = `SELECT action_log.*,
                    (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) name,
                    (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) mock_name
                FROM action_log
                    JOIN actions ON actions.action_id = action_log.action_template
                    WHERE action_log.action_template = ? AND action_log.project = ? AND ? IN (SELECT users.project FROM users WHERE users.system_id = ?)
                    AND (action_log.system_id = ? OR (actions.action_target='${ACTION_TARGETS.TEAM}' AND action_log.system_id in (SELECT users.system_id FROM users WHERE users.project = ?)))`;
            params = [req.query.action_id, req.query.project_id, req.query.project_id, req.user.system_id, req.user.system_id, req.query.project_id];
            break;
        case ROLES.COACH:
        case ROLES.ADMIN:
            getActionLogQuery = `SELECT action_log.* FROM action_log
                WHERE action_log.action_template = ? AND action_log.project = ?`;
            params = [req.query.action_id, req.query.project_id];
            break;

        default:
            res.status(401).send("Unknown role");
            return;
    }
    db.query(getActionLogQuery, params)
        .then((values) => {
            res.send(values);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

// Get your teammate's, coaches', and admins' submissions (Does not send submission, just submission metadata i.e. submission time, who submitted, etc)
db_router.get("/getTeammateActionLogs", (req, res) => {
    let getActionLogQuery = "";
    let params = [];

    // AND ? in (SELECT users.project FROM users WHERE users.system_id = ?) <-- This is done so that users can't just change the network request to see other team's submissions
    getActionLogQuery = `SELECT action_log.action_log_id, action_log.submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id, action_log.project ,
        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) name,
        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) mock_name
    FROM action_log
        WHERE action_log.action_template = ? AND action_log.project = ? AND ? IN (SELECT users.project FROM users WHERE users.system_id = ?) AND action_log.system_id != ?
        AND action_log.system_id in (SELECT users.system_id FROM users WHERE users.project = ? OR users.type = '${ROLES.COACH}' OR users.type = '${ROLES.ADMIN}')`;
    params = [req.query.action_id, req.query.project_id, req.query.project_id, req.user.system_id, req.user.system_id, req.query.project_id];

    db.query(getActionLogQuery, params)
        .then((values) => {
            res.send(values);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

db_router.post("/editAction", body("page_html").unescape(), (req, res) => {
    let body = req.body;

    let updateQuery = `
        UPDATE actions
        SET semester = ?,
            action_title = ?,
            action_target = ?,
            date_deleted = ?,
            short_desc = ?,
            start_date = ?,
            due_date = ?,
            page_html = ?,
            file_types = ?
        WHERE action_id = ?
    `;

    const date_deleted = body.date_deleted === 'false' ? moment().format(CONSTANTS.datetime_format) : "";

    let params = [
        body.semester,
        body.action_title,
        body.action_target,
        date_deleted,
        body.short_desc,
        body.start_date,
        body.due_date,
        body.page_html,
        body.file_types,
        body.action_id,
    ];

    db.query(updateQuery, params)
        .then(() => {
            return res.status(200).send();
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
});


db_router.post("/createAction", body("page_html").unescape(), (req, res) => {
    let body = req.body;

    let updateQuery = `
        INSERT into actions
        (semester, action_title, action_target, date_deleted, short_desc, start_date, due_date, page_html, file_types)
        values (?,?,?,?,?,?,?,?,?)`;

    const date_deleted = body.date_deleted === 'false' ? moment().format(CONSTANTS.datetime_format) : "";

    let params = [
        body.semester,
        body.action_title,
        body.action_target,
        date_deleted,
        body.short_desc,
        body.start_date,
        body.due_date,
        body.page_html,
        body.file_types
    ];

    db.query(updateQuery, params)
        .then(() => {
            return res.status(200).send();
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
});

db_router.get("/getSemesters", [UserAuth.isSignedIn], (req, res) => {
    let getSemestersQuery = `
        SELECT *
        FROM semester_group
        ORDER BY end_date, start_date, name
    `;
    db.query(getSemestersQuery)
        .then((values) => {
            res.send(values);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

db_router.get("/getSemesterAnnouncements", [UserAuth.isSignedIn], (req, res) => {

    let filter = "";
    let semesterCheck = "";
    let params = [req.query.semester];
    if (req.user.type === ROLES.STUDENT) {
        filter = `AND actions.action_target IS NOT '${ACTION_TARGETS.COACH_ANNOUNCEMENT}'`
        // Note: Since we only do this check for students, coaches can technically hack the request to see announcements for other semesters.
        // Unfortunately, coaches don't inherently have a semester like students do
        // and 1am Kevin can't think of another way of ensuring that a coach isn't lying to us about their semester ...but idk what they would gain form doing that sooo ima just leave it for now
        semesterCheck = `AND ? IN (SELECT users.semester_group from users WHERE users.system_id = '${req.user.system_id}')`
        params = [req.query.semester, req.query.semester];
    }

    let getTimelineActions = `SELECT action_title, action_id, start_date, due_date, semester, action_target, date_deleted, page_html
        FROM actions
        WHERE actions.date_deleted = '' AND actions.semester = ? ${semesterCheck}
            AND (actions.action_target IN ('${ACTION_TARGETS.COACH_ANNOUNCEMENT}', '${ACTION_TARGETS.STUDENT_ANNOUNCEMENT}') AND actions.start_date < date('now') AND actions.due_date > date('now'))
            ${filter}`;

    db.query(getTimelineActions, params)
        .then((values) => {
            res.send(values);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
})

db_router.post("/editSemester", [body("*").trim()], (req, res) => {
    let body = req.body;

    let updateQuery = `
        UPDATE semester_group
        SET name = ?,
            dept = ?,
            start_date = ?,
            end_date = ?
        WHERE semester_id = ?
    `;

    let params = [body.name, body.dept, body.start_date, body.end_date, body.semester_id];

    db.query(updateQuery, params)
        .then(() => {
            return res.status(200).send();
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
});



db_router.post("/createSemester", [
    body("*").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }),
], (req, res) => {

    let result = validationResult(req);

    if (result.errors.length !== 0) {
        res.status(400).send(result);
        return;
    }

    let body = req.body;

    let sql = `
        INSERT INTO semester_group
        (name, dept, start_date, end_date)
        VALUES (?,?,?,?);
    `;

    let params = [body.name, body.dept, body.start_date, body.end_date];

    db.query(sql, params)
        .then(() => {
            return res.status(200).send();
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
});

function calculateActiveTimelines(user) {

    let projectFilter;
    switch (user.type) {
        case ROLES.ADMIN:
            projectFilter = "";
            break;
        case ROLES.STUDENT:
            projectFilter = `WHERE projects.status = 'in progress' AND projects.project_id IN (SELECT project FROM users WHERE users.system_id = "${user.system_id}")`;
            break;
        case ROLES.COACH:
            projectFilter = `WHERE projects.status = 'in progress' AND projects.project_id IN (SELECT project_id FROM project_coaches WHERE coach_id = "${user.system_id}")`;
            break;
        default:
            throw new Error("Unhandled user role");
    }

    return new Promise((resolve, reject) => {
        // WARN: If any field in an action is null, group_concat will remove that entire action...
        let getTeams = `
            SELECT  projects.display_name,
                    projects.title,
                    projects.project_id,
                    semester_group.name AS 'semester_name',
                    semester_group.semester_id AS 'semester_id',
                    semester_group.start_date AS 'start_date',
                    semester_group.end_date AS 'end_date',
                    (
                        SELECT group_concat(fname || ' ' || lname || ' (' || email || ')')
                        FROM users
                        WHERE projects.project_id = users.project
                    ) team_members,
                    (
                        SELECT group_concat(fname || ' ' || lname || ' (' || email || ')')
                        FROM project_coaches
                        LEFT JOIN users ON project_coaches.coach_id = users.system_id
                        WHERE projects.project_id = project_coaches.project_id
                    ) coach
            FROM projects
            LEFT JOIN semester_group 
                ON projects.semester = semester_group.semester_id
                ${projectFilter}
            ORDER BY projects.semester DESC
        `;
        db.query(getTeams)
            .then((values) => {
                resolve(values);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = db_router;
