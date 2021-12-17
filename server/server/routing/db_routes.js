// Imports
const UserAuth = require("./user_auth");
const db_router = require("express").Router();
const { validationResult, body } = require("express-validator");
const PDFDoc = require("pdfkit");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const fileSizeParser = require('filesize-parser');

function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

const defaultFileSizeLimit = 15 * 1024 * 1024;


const DB_CONFIG = require("../database/db_config");
const CONFIG = require("../config/config");
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

// Routes
module.exports = (db) => {

    /**
     * /getAllUsersForLogin ENDPOINT SHOULD ONLY BE HIT IN DEVELOPMENT ONLY
     * 
     * THIS IS USED BY THE DEVELOPMENT LOGIN AND SHOULD NOT BE USED FOR ANYTHING ELSE
     */
    if (process.env.NODE_ENV !== 'production') {
        // gets all users
        db_router.get("/DevOnlyGetAllUsersForLogin", (req, res) => {
            db.query(`SELECT ${CONSTANTS.SIGN_IN_SELECT_ATTRIBUTES} FROM users`).then((users) => res.send(users));
        });
    }

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


    db_router.get("/selectAllNonStudentInfo", [UserAuth.isAdmin], (req, res) => {
        let getUsersQuery = `
            SELECT *
            FROM users
            LEFT JOIN semester_group
            ON users.semester_group = semester_group.semester_id
            WHERE type != 'student'
        `;
        db.query(getUsersQuery)
            .then((values) => {
                res.send(values);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
    });


    db_router.get("/getSemesterStudents", [UserAuth.isSignedIn], (req, res) => {

        let query = "";
        let params = [];
        switch (req.user.type) {
            case ROLES.STUDENT:
                query = `
                    SELECT users.* FROM users
                        LEFT JOIN semester_group
                            ON users.semester_group = semester_group.semester_id
                        WHERE users.semester_group = (
                            SELECT semester_group FROM users
                            WHERE users.system_id = ?
                        )
                `;
                params = [req.user.system_id];
                break;
            case ROLES.COACH:
                query = `
                    SELECT users.* FROM users
                    LEFT JOIN semester_group
                        ON users.semester_group = semester_group.semester_id
                    WHERE users.semester_group in (
                    SELECT projects.semester FROM projects
                    WHERE projects.project_id in (
                        SELECT project_coaches.project_id FROM project_coaches
                        WHERE project_coaches.coach_id = ?
                    )
                        )
                `;
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


    // NOTE: This is currently used for getting user for AdminView to mock users, however, I feel that this network request will get quite large
    // as we add about 100 users every semester.
    db_router.get("/getActiveUsers", [UserAuth.isAdmin], (req, res) => {
        let query = `SELECT ${CONSTANTS.SIGN_IN_SELECT_ATTRIBUTES}
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
            body.semester_group || null,
            body.project || null,
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
                query = `SELECT users.system_id, users.semester_group, projects.*
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

    db_router.get("/getSemesterProjects", [UserAuth.isSignedIn], async (req, res) => {
        let query;
        let params;
        switch (req.user.type) {
            case ROLES.COACH:
                query = `
                SELECT projects.* 
                FROM projects
                WHERE projects.semester IN 
                    (SELECT projects.semester
                    FROM projects
                    INNER JOIN project_coaches
                    ON (projects.project_id = project_coaches.project_id AND project_coaches.coach_id = ?))
                ;`
                params = [req.user.system_id];
                break;
            case ROLES.STUDENT:
                query = `SELECT users.system_id, projects.*
                FROM users
                INNER JOIN projects
                ON users.system_id = ? AND projects.semester = users.semester_group;`
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
            .then((projects) => res.send(projects))
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
                body.semester || null,
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
            UserAuth.isAdmin,
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
    db_router.get("/getProposalPdfNames", UserAuth.isSignedIn, (req, res) => {
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

    db_router.get("/getProposalPdf", UserAuth.isSignedIn, (req, res) => {
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

    db_router.get("/getProposalAttachment", UserAuth.isSignedIn, (req, res) => {
        if (req.query.project_id && req.query.name) {
            let projectId = req.query.project_id.replace(/\\|\//g, ""); // attempt to avoid any path traversal issues
            let name = req.query.name.replace(/\\|\//g, ""); // attempt to avoid any path traversal issues
            res.sendFile(path.join(__dirname, `../sponsor_proposal_files/${projectId}/${name}`));
        } else res.send("File not found");
    });


    /**
     * WARN: THIS IS VERY DANGEROUS AND IT CAN BE USED TO OVERWRITE SERVER FILES.
     */
    db_router.post("/uploadFiles", UserAuth.isAdmin, (req, res) => {

        let filesUploaded = [];

        // Attachment Handling
        if (req.files && req.files.files) {

            // If there is only one attachment, then it does not come as a list
            if (req.files.files.length === undefined) {
                req.files.files = [req.files.files];
            }

            const formattedPath = `resource/${req.body.path}`;
            const baseURL = path.join(__dirname, `../../${formattedPath}`);

            fs.mkdirSync(baseURL, { recursive: true });

            for (let x = 0; x < req.files.files.length; x++) {
                req.files.files[x].mv(
                    `${baseURL}/${req.files.files[x].name}`,
                    function (err) {
                        if (err) {
                            console.error(err);
                            return res.status(500).send(err);
                        }
                    }
                );
                filesUploaded.push(`${process.env.BASE_URL}/${formattedPath}/${req.files.files[x].name}`);
            }
        }

        res.send({ msg: "Success!", filesUploaded: filesUploaded });
    });

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

                const baseURL = path.join(__dirname, `../sponsor_proposal_files/${projectId}`);

                fs.mkdirSync(baseURL, { recursive: true });

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
                    const baseURL = path.join(__dirname, `../proposal_docs/`);
                    fs.mkdirSync(baseURL, { recursive: true });
                    doc.pipe(fs.createWriteStream(`${baseURL}/${projectId}.pdf`));

                    doc.font("Times-Roman");

                    for (let key of Object.keys(DB_CONFIG.senior_project_proposal_keys)) {
                        doc.fill("blue").fontSize(16).text(DB_CONFIG.senior_project_proposal_keys[key]),
                        {
                            underline: true,
                        };
                        doc.fontSize(12).fill("black").text(body[key]); // Text value from proposal
                        doc.moveDown();
                        doc.save();
                    }

                    doc.fill("blue").fontSize(16).text("Attachments"),
                    {
                        underline: true,
                    };
                    doc.fontSize(12).fill("black").text(filenamesCSV);
                    doc.moveDown();
                    doc.save();

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

        let baseURL = path.join(__dirname, `../project_docs/${body.project}/${action.action_target}/${action.action_id}/${req.user.system_id}/${submission}`);

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
                if (req.files.attachments[x].size > (action.file_size || defaultFileSizeLimit)) {
                    // 15mb limit exceeded
                    const responseText = "File exceeded submission size limit of: " + humanFileSize(action.file_size || defaultFileSizeLimit, false, 0);
                    return res.status(400).send(responseText);
                }
                if (!action.file_types.split(",").includes(path.extname(req.files.attachments[x].name).toLocaleLowerCase())) {
                    // send an error if the file is not an accepted type
                    return res.status(400).send("Filetype not accepted");
                }

                // Append the file name to the CSV string, begin with a comma if x is not 0
                filenamesCSV += x === 0 ? `${submission}/${req.files.attachments[x].name}` : `,${submission}/${req.files.attachments[x].name}`;

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

        if (req.user.type === ROLES.STUDENT && req.query.project_id !== req.user.project) {
            return res.status(401).send("Trying to access project that is not your own");
        }

        let getTimelineActions = `SELECT action_title, action_id, start_date, due_date, semester, action_target, date_deleted, short_desc, file_types, file_size, page_html,
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

    db_router.get("/getActionLogs", [UserAuth.isSignedIn], (req, res) => {
        let getActionLogQuery = "";
        let params = [];

        switch (req.user.type) {
            case ROLES.STUDENT:
                // NOTE: Technically, users are able to see if coaches submitted actions to other projects, but they should not be able to see the actual submission content form this query so that should be fine
                //          This is because of the "OR users.type = '${ROLES.COACH}'" part of the following query.
                getActionLogQuery = `SELECT action_log.action_log_id, action_log.submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id, action_log.project,
                        actions.action_title,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) name,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) mock_name
                    FROM action_log
                        JOIN actions ON actions.action_id = action_log.action_template
                        WHERE action_log.action_template = ? AND action_log.project = ?`;
                params = [req.query.action_id, req.user.project];
                break;
            case ROLES.COACH:
            case ROLES.ADMIN:
                getActionLogQuery = `SELECT action_log.*, actions.action_title,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) AS name,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) AS mock_name
                    FROM action_log
                    JOIN actions ON actions.action_id = action_log.action_template
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


    db_router.get("/getAllActionLogs", [UserAuth.isSignedIn], async (req, res) => {

        const { resultLimit, offset } = req.query;

        let getActionLogQuery = "";
        let queryParams = [];
        let getActionLogCount = "";
        let countParams = [];

        switch (req.user.type) {
            case ROLES.STUDENT:
                getActionLogQuery = `SELECT action_log.action_log_id, action_log.submission_datetime AS submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id,  action_log.project,
                        actions.action_target, actions.action_title, actions.semester,
                        projects.display_name, projects.title,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) name,
                        (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) mock_name
                    FROM action_log
                        JOIN actions ON actions.action_id = action_log.action_template
                        JOIN projects ON projects.project_id = action_log.project
                        WHERE action_log.project = ?
                        AND action_log.oid NOT IN (SELECT oid FROM action_log
                            ORDER BY submission_datetime DESC LIMIT ?)
                        ORDER BY submission_datetime DESC LIMIT ?`;
                queryParams = [req.user.project, offset || 0, resultLimit || 0];
                getActionLogCount = `SELECT COUNT(*) FROM action_log
                    JOIN actions ON actions.action_id = action_log.action_template
                    WHERE action_log.project = ?
                    AND action_log.system_id in (SELECT users.system_id FROM users WHERE users.project = ?)`;
                countParams = [req.user.project, req.user.project];
                break;
            case ROLES.COACH:
                getActionLogQuery = `SELECT action_log.action_log_id, action_log.submission_datetime AS submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id,  action_log.project,
                    actions.action_target, actions.action_title, actions.semester,
                    projects.display_name, projects.title,
                    (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) name,
                    (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) mock_name
                    FROM action_log
                        JOIN actions ON actions.action_id = action_log.action_template
                        JOIN projects ON projects.project_id = action_log.project
                        WHERE action_log.project IN (SELECT project_id FROM project_coaches WHERE coach_id = ?)
                        AND action_log.oid NOT IN (SELECT oid FROM action_log
                            ORDER BY submission_datetime DESC LIMIT ?)
                        ORDER BY submission_datetime DESC LIMIT ?`;
                queryParams = [req.user.system_id, offset || 0, resultLimit || 0];
                getActionLogCount = `SELECT COUNT(*) FROM action_log WHERE action_log.project IN (SELECT project_id FROM project_coaches WHERE coach_id = ?)`;
                countParams = [req.user.system_id];
                break;
            case ROLES.ADMIN:
                getActionLogQuery = `SELECT action_log.action_log_id, action_log.submission_datetime AS submission_datetime, action_log.action_template, action_log.system_id, action_log.mock_id,  action_log.project,
                actions.action_target, actions.action_title, actions.semester,
                projects.display_name, projects.title,
                (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.system_id) name,
                (SELECT group_concat(users.fname || ' ' || users.lname) FROM users WHERE users.system_id = action_log.mock_id) mock_name
                FROM action_log
                    JOIN actions ON actions.action_id = action_log.action_template
                    JOIN projects ON projects.project_id = action_log.project
                    AND action_log.oid NOT IN (SELECT oid FROM action_log
                        ORDER BY submission_datetime DESC LIMIT ?)
                    ORDER BY submission_datetime DESC LIMIT ?`;
                queryParams = [offset || 0, resultLimit || 0];
                getActionLogCount = `SELECT COUNT(*) FROM action_log`;
                break;
            default:
                res.status(401).send("Unknown role");
                return;
        }

        const actionLogsPromise = db.query(getActionLogQuery, queryParams);
        const actionLogsCountPromise = db.query(getActionLogCount, countParams);
        Promise.all([actionLogsCountPromise, actionLogsPromise])
            .then(([[actionLogCount], projects]) => {
                res.send({ actionLogCount: actionLogCount[Object.keys(actionLogCount)[0]], actionLogs: projects });
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    });

    db_router.get("/getAllSponsors", [UserAuth.isSignedIn], async (req, res) => {

        const { resultLimit, offset } = req.query;

        let getSponsorsQuery = "";
        let queryParams = [];
        let getSponsorsCount = "";

        switch (req.user.type) {
            case ROLES.STUDENT:
                break;
            case ROLES.COACH:
            case ROLES.ADMIN:
                getSponsorsQuery = `
                    SELECT *
                    FROM sponsors
                    WHERE sponsors.OID NOT IN (
                        SELECT OID 
                        FROM sponsors
                        ORDER BY 
                            company ASC,
                            division ASC,
                            fname ASC,
                            lname ASC
                        LIMIT ?
                        )
                    ORDER BY
                        sponsors.company ASC,
                        sponsors.division ASC,
                        sponsors.fname ASC,
                        sponsors.lname ASC
                    LIMIT ?
                `;
                queryParams = [offset || 0, resultLimit || 0];
                getSponsorsCount = `SELECT COUNT(*) FROM sponsors`;
                break;
            default:
                res.status(401).send("Unknown role");
                return;
        }

        const sponsorsPromise = db.query(getSponsorsQuery, queryParams);
        const SponsorsCountPromise = db.query(getSponsorsCount);
        Promise.all([SponsorsCountPromise, sponsorsPromise])
            .then(([[sponsorsCount], sponsorsRows]) => {
                res.send({ sponsorsCount: sponsorsCount[Object.keys(sponsorsCount)[0]], sponsors: sponsorsRows });
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    });

    db_router.get("/getSponsorNotes", [UserAuth.isCoachOrAdmin], (req, res) => {
        let getSponsorNotesQuery = `
            SELECT * 
            FROM sponsor_notes
            WHERE sponsor = ?
            ORDER BY creation_date
        `;

        const queryParams = [req.query.sponsor_id]

        db.query(getSponsorNotesQuery, queryParams)
            .then((sponsorNotes) => {
                res.send(sponsorNotes);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send(err);
            });
    });


    db_router.get("/getSubmission", [UserAuth.isSignedIn], (req, res) => {

        let getSubmissionQuery = "";
        let params = [];

        switch (req.user.type) {
            case ROLES.STUDENT:
                getSubmissionQuery = `SELECT action_log.form_data, action_log.files
                    FROM action_log
                    JOIN actions ON actions.action_id = action_log.action_template
                    WHERE action_log.action_log_id = ? AND (actions.action_target = '${ACTION_TARGETS.TEAM}' OR action_log.system_id = ?)`;
                params = [req.query.log_id, req.user.system_id];
                break;
            case ROLES.COACH:
                getSubmissionQuery = `SELECT action_log.form_data, action_log.files
                    FROM action_log
                    JOIN project_coaches ON project_coaches.project_id = action_log.project 
                    WHERE action_log.action_log_id = ? AND project_coaches.coach_id = ?`;
                params = [req.query.log_id, req.user.system_id];
                break;
            case ROLES.ADMIN:
                getSubmissionQuery = `SELECT action_log.form_data, action_log.files
                    FROM action_log
                    WHERE action_log.action_log_id = ?`;
                params = [req.query.log_id];
                break;
            default:
                res.status(401).send("Unknown role");
                return;
        }

        db.query(getSubmissionQuery, params)
            .then((submissions) => {
                res.send(submissions);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send(err);
            });
    });


    db_router.get("/getSubmissionFile", [UserAuth.isSignedIn], async (req, res) => {

        let getSubmissionQuery = "";
        let params = [];

        switch (req.user.type) {
            case ROLES.STUDENT:
                getSubmissionQuery = `SELECT action_log.files, action_log.project, action_log.system_id, actions.action_id, actions.action_target
                    FROM action_log
                    JOIN actions ON actions.action_id = action_log.action_template
                    WHERE action_log.action_log_id = ? AND (actions.action_target = '${ACTION_TARGETS.TEAM}' OR action_log.system_id = ?)`;
                params = [req.query.log_id, req.user.system_id];
                break;
            case ROLES.COACH:
                getSubmissionQuery = `SELECT action_log.files, action_log.project, action_log.system_id, actions.action_id, actions.action_target
                    FROM action_log
                    JOIN actions ON actions.action_id = action_log.action_template
                    JOIN project_coaches ON project_coaches.project_id = action_log.project 
                    WHERE action_log.action_log_id = ? AND project_coaches.coach_id = ?`;
                params = [req.query.log_id, req.user.system_id];
                break;
            case ROLES.ADMIN:
                getSubmissionQuery = `SELECT action_log.files, action_log.project, action_log.system_id, actions.action_id, actions.action_target
                    FROM action_log
                    JOIN actions ON actions.action_id = action_log.action_template
                    WHERE action_log.action_log_id = ?`;
                params = [req.query.log_id];
                break;
            default:
                res.status(401).send("Unknown role");
                return;
        }

        const { files, project, action_target, system_id, action_id } = (await db.query(getSubmissionQuery, params))[0] || {};

        let fileList = [];
        if (files) {
            fileList = files.split(",");
        }

        if (fileList.includes(req.query.file) && project && action_target && system_id && action_id) {
            return res.sendFile(path.join(__dirname, `../project_docs/${project}/${action_target}/${action_id}/${system_id}/${req.query.file}`));
        }
        res.status(404).send("File not found or you are unauthorized to view file");
    });


    db_router.post("/editAction", [UserAuth.isAdmin, body("page_html").unescape()], (req, res) => {
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
                file_types = ?,
                file_size = ?
            WHERE action_id = ?
        `;

        const date_deleted = body.date_deleted === 'false' ? moment().format(CONSTANTS.datetime_format) : "";
        const parsedFileSize = body.file_size ? fileSizeParser(body.file_size) : null;

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
            parsedFileSize,
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


    db_router.get("/searchForSponsor", [UserAuth.isCoachOrAdmin, body("page_html").escape()], (req, res) => {
        const { resultLimit, offset, searchQuery } = req.query;

        let getSponsorsQuery = "";
        let queryParams = [];
        let getSponsorsCount = "";
        let sponsorCountParams = [];

        switch (req.user.type) {
            case ROLES.STUDENT:
                break;
            case ROLES.COACH:
            case ROLES.ADMIN:
                getSponsorsQuery = `
                    SELECT *
                    FROM sponsors
                    WHERE sponsors.OID NOT IN (
                        SELECT OID 
                        FROM sponsors
                        WHERE 
                              company LIKE ?
                            OR division LIKE ?
                            OR fname LIKE ?
                        OR lname LIKE ?
                        ORDER BY 
                            company,
                            division,
                            fname,
                            lname 
                        LIMIT ?
                        ) AND (
                                sponsors.company LIKE ?
                            OR sponsors.division LIKE ?
                            OR sponsors.fname LIKE ?
                            OR sponsors.lname LIKE ?
                        )
                    ORDER BY
                        sponsors.company,
                        sponsors.division,
                        sponsors.fname,
                        sponsors.lname 
                    LIMIT ?
                `;
                getSponsorsCount = `SELECT COUNT(*) 
                                    FROM sponsors
                                    WHERE
                                        company LIKE ?
                                       OR division LIKE ?
                                       OR fname LIKE ?
                                       OR lname LIKE ?
                                       `;
                const searchQueryParam = searchQuery || '';
                queryParams = [
                    '%'+searchQueryParam+'%',
                    '%'+searchQueryParam+'%',
                    '%'+searchQueryParam+'%',
                    '%'+searchQueryParam+'%',
                    offset || 0,
                    '%'+searchQueryParam+'%',
                    '%'+searchQueryParam+'%',
                    '%'+searchQueryParam+'%',
                    '%'+searchQueryParam+'%',
                    resultLimit || 0
                ];
                sponsorCountParams =  [
                    '%'+searchQueryParam+'%',
                    '%'+searchQueryParam+'%',
                    '%'+searchQueryParam+'%',
                    '%'+searchQueryParam+'%'
                ];


                break;
            default:
                res.status(401).send("Unknown role");
                return;
        }

        const sponsorsPromise = db.query(getSponsorsQuery, queryParams);
        const SponsorsCountPromise = db.query(getSponsorsCount, sponsorCountParams);
        Promise.all([SponsorsCountPromise, sponsorsPromise])
            .then(([[sponsorsCount], sponsorsRows]) => {
                res.send({ sponsorsCount: sponsorsCount[Object.keys(sponsorsCount)[0]], sponsors: sponsorsRows });
            })
            .catch((error) => {
                res.status(500).send(error);
            });

    });

    db_router.post("/createSponsor", [UserAuth.isCoachOrAdmin, body("page_html").unescape()], (req, res) => {

        let body = req.body;

        let createSponsorQuery = `
            INSERT into sponsors(
                fname,
                lname,
                company,
                division,
                email,
                phone,
                association,
                type
            )
            values (?,?,?,?,?,?,?,?)
        `;

        let createSponsorParams = [
            body.fname,
            body.lname,
            body.company,
            body.division,
            body.email,
            body.phone,
            body.association,
            body.type,
            body.sponsor_id
        ];


        let createSponsorQueryPromise = db.query(createSponsorQuery, createSponsorParams)
            .then(() => {
                return [200, null];
            })
            .catch((err) => {
                return [500, err];
            });

        let note_content =
            "Sponsor created by " + req.user.system_id;

        let createSponsorNoteParams = [
            note_content,
            body.sponsor_id,
            req.user.system_id,
            null
        ];

        let createSponsorNotePromise = createSponsorNote(createSponsorNoteParams)

        Promise.all([createSponsorQueryPromise, createSponsorNotePromise]).then(
            ([[createSponsorQueryStatusCode, createSponsorError], [createNoteStatusCode, createNoteError]]) => {
                if (createSponsorError){
                    res.status(createSponsorQueryStatusCode).send(createSponsorError)
                }
                else if (createNoteError){
                    res.status(createNoteStatusCode).send(createNoteError)
                }
                else if (createSponsorQueryStatusCode !== createNoteStatusCode){
                    res.status(500).send("status code mismatch in editing sponsor, please contact an admin to investigate")
                }
                else {
                    res.status(createSponsorQueryStatusCode).send()
                }
            }
        )
    });

    db_router.post("/editSponsor", [UserAuth.isCoachOrAdmin, body("page_html").unescape()], (req, res) => {
        let body = req.body;

        let updateSponsorQuery = `
            UPDATE sponsors
            SET fname       = ?,
                lname       = ?,
                company     = ?,
                division    = ?,
                email       = ?,
                phone       = ?,
                association = ?,
                type        = ?
            WHERE sponsor_id = ?
        `;

        let updateSponsorParams = [
            body.fname,
            body.lname,
            body.company,
            body.division,
            body.email,
            body.phone,
            body.association,
            body.type,
            body.sponsor_id
        ];


        let updateQueryPromise = db.query(updateSponsorQuery, updateSponsorParams)
            .then(() => {
                return [200, null];
            })
            .catch((err) => {
                return [500, err];
            });

        let changedFieldsMessageFirstPart = [];
        let changedFieldsMessageSecondPart = [];
        let changedFieldsMessageThirdPart = [];

        body.changed_fields = JSON.parse(body.changed_fields)

        for (const field of Object.keys(body.changed_fields)) {
            changedFieldsMessageFirstPart.push(field);
            changedFieldsMessageSecondPart.push(body.changed_fields[field][0]);
            changedFieldsMessageThirdPart.push(body.changed_fields[field][1]);
        }

        let note_content =
            "Fields: " + changedFieldsMessageFirstPart.join(", ") +
            " were changed from: " + changedFieldsMessageSecondPart.join(", ") +
            " to: " + changedFieldsMessageThirdPart.join(", ");

        let createSponsorNoteParams = [
            note_content,
            body.sponsor_id,
            req.user.system_id,
            null
        ];

        let createSponsorNotePromise = createSponsorNote(createSponsorNoteParams)

        Promise.all([updateQueryPromise, createSponsorNotePromise]).then(
            ([[updateQueryStatusCode, updateSponsorError], [createNoteStatusCode, createNoteError]]) => {
                if (updateSponsorError){
                    res.status(updateQueryStatusCode).send(updateSponsorError)
                }
                else if (createNoteError){
                    res.status(createNoteStatusCode).send(createNoteError)
                }
                else if (updateQueryStatusCode !== createNoteStatusCode){
                    res.status(500).send("status code mismatch in editing sponsor, please contact an admin to investigate")
                }
                else {
                    res.status(updateQueryStatusCode).send()
                }
            }
        )
    });

    async function createSponsorNote(queryParams){
        let insertQuery = `
            INSERT into sponsor_notes
                (note_content, sponsor, author, previous_note)
            values (?, ?, ?, ?)`;

        let status = 500
        let error = null

        await db.query(insertQuery, queryParams)
            .then(() => {
                status = 200;
            })
            .catch((err) => {
                status = 500;
                error = err;
            });
        return [status, error]
    }

    db_router.post("/createSponsorNote", [UserAuth.isCoachOrAdmin, body("page_html").unescape()], (req, res) => {
        let body = req.body;

        params = [
            body.note_content,
            body.sponsor_id,
            req.user.system_id,
            body.previous_note
        ]

        createSponsorNote(params).then(([status, error]) => {
            console.log("endpoint", status);
            if (error){
                res.status(status).send(error)
            }
            else {
                res.status(status).send()
            }
        });

    });

    db_router.post("/createAction", [UserAuth.isAdmin, body("page_html").unescape()], (req, res) => {
        let body = req.body;

        let updateQuery = `
            INSERT into actions
            (semester, action_title, action_target, date_deleted, short_desc, start_date, due_date, page_html, file_types, file_size)
            values (?,?,?,?,?,?,?,?,?,?)`;

        const date_deleted = body.date_deleted === 'false' ? moment().format(CONSTANTS.datetime_format) : "";
        const parsedFileSize = body.file_size ? fileSizeParser(body.file_size) : null;

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
            parsedFileSize
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
        if (req.user.type === ROLES.STUDENT) {

            // req.query.semester comes in as a string and req.user.semester_group is a number so convert both to strings to compare them.
            if (`${req.query.semester}` !== `${req.user.semester_group}`) {
                return res.status(401).send("Students can not access announcements that are not for your project");
            }

            filter = `AND actions.action_target IS NOT '${ACTION_TARGETS.COACH_ANNOUNCEMENT}'`
            // Note: Since we only do this check for students, coaches can technically hack the request to see announcements for other semesters.
            // Unfortunately, coaches don't inherently have a semester like students do
            // and 1am Kevin can't think of another way of ensuring that a coach isn't lying to us about their semester ...but idk what they would gain form doing that sooo ima just leave it for now
        }

        //ToDo: make sure that the dates don't screw things up because of GMT i.e. it becomes tomorrow in GMT before it becomes tomorrow at the server's location
        let getTimelineActions = `
            SELECT action_title, action_id, start_date, due_date, semester, action_target, date_deleted, page_html
            FROM actions
            WHERE actions.date_deleted = '' AND actions.semester = ?
                AND (actions.action_target IN ('${ACTION_TARGETS.COACH_ANNOUNCEMENT}', '${ACTION_TARGETS.STUDENT_ANNOUNCEMENT}') AND actions.start_date <= date('now') AND actions.due_date >= date('now'))
                ${filter}
            ORDER BY actions.due_date ASC
        `;

        db.query(getTimelineActions, [req.query.semester])
            .then((values) => {
                res.send(values);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send(err);
            });
    })

    db_router.post("/editSemester", [UserAuth.isAdmin, body("*").trim()], (req, res) => {
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
        UserAuth.isAdmin,
        body("name").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }),
        body("dept").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }),
        body("start_date").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }),
        body("end_date").not().isEmpty().trim().escape().withMessage("Cannot be empty").isLength({ max: 50 }),
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

    return db_router;
};
