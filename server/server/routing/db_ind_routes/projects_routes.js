const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get(
    "/getActiveProjects",
    [require("../user_auth").isSignedIn],
    (req, res, next) => {
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
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getActiveCoaches",
    [require("../user_auth").isCoachOrAdmin],
    (req, res, next) => {
      const sql = `SELECT * FROM users WHERE type = '${ROLES.COACH}' AND active = ''`;
      db.query(sql)
        .then((coaches) => {
          res.send(coaches);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getProjectCoaches",
    [require("../user_auth").isCoachOrAdmin],
    (req, res, next) => {
      const getProjectCoaches = `SELECT users.* FROM users
          LEFT JOIN project_coaches ON project_coaches.coach_id = users.system_id
          WHERE project_coaches.project_id = ?`;
      db.query(getProjectCoaches, [req.query.project_id])
        .then((coaches) => {
          res.send(coaches);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getProjectStudents",
    [require("../user_auth").isCoachOrAdmin],
    (req, res, next) => {
      const getProjectStudents = "SELECT * FROM users WHERE users.project = ?";
      db.query(getProjectStudents, [req.query.project_id])
        .then((students) => {
          res.send(students);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getProjectStudentNames",
    [require("../user_auth").isSignedIn],
    (req, res, next) => {
      const getProjectStudents =
        "SELECT fname,lname FROM users WHERE users.project = ? and users.system_id!=?";
      db.query(getProjectStudents, [req.query.project_id, req.user.system_id])
        .then((students) => {
          res.send(students);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/selectAllCoachInfo",
    [require("../user_auth").isCoachOrAdmin],
    (req, res, next) => {
      const getCoachInfoQuery = `
          SELECT users.system_id,
          users.fname,
          users.lname,
          users.email,
          users.semester_group,
          (
              SELECT "[" || group_concat(
                  "{" ||
                      """title"""         || ":" || """ || COALESCE(projects.display_name, projects.title) || """ || "," ||
                      """semester_id"""   || ":" || """ || projects.semester                               || """ || "," ||
                      """project_id"""    || ":" || """ || projects.project_id                             || """ || "," ||
                      """organization"""  || ":" || """ || projects.organization                           || """ || "," ||
                      """status"""        || ":" || """ || projects.status                                 || """ ||
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
          res.send(coaches);
        })
        .catch((err) => {
          console.error(error);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getProjects",
    [require("../user_auth").isCoachOrAdmin],
    async (req, res, next) => {
      const query = "SELECT * from projects";
      db.query(query)
        .then((projects) => res.send(projects))
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getCandidateProjects",
    [require("../user_auth").isSignedIn],
    async (req, res, next) => {
      const query =
        "SELECT * from projects WHERE projects.status = 'candidate';";
      db.query(query)
        .then((projects) => res.send(projects))
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getMyProjects",
    [require("../user_auth").isSignedIn],
    async (req, res, next) => {
      let query;
      let params;
      switch (req.user.type) {
        case ROLES.COACH:
          query = `SELECT projects.*
              FROM projects
              INNER JOIN project_coaches
              ON (projects.project_id = project_coaches.project_id AND project_coaches.coach_id = ?);`;
          params = [req.user.system_id];
          break;
        case ROLES.STUDENT:
          query = `SELECT users.system_id, users.semester_group, projects.*
              FROM users
              INNER JOIN projects
              ON users.system_id = ? AND projects.project_id = users.project;`;
          params = [req.user.system_id];
          break;
        case ROLES.ADMIN:
          query =
            "SELECT * FROM projects WHERE projects.status NOT IN ('completed', 'rejected', 'archive');";
          params = [];
          break;
        default:
          const error = new Error(
            "Invalid user type...something must be very very broken...",
          );
          error.statusCode = 500;
          return next(error);
      }

      db.query(query, params)
        .then((proposals) => res.send(proposals))
        .catch((err) => res.status(500).send(err));
    },
  );

  router.get(
    "/getSemesterProjects",
    [require("../user_auth").isSignedIn],
    async (req, res, next) => {
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
              ;`;
          params = [req.user.system_id];
          break;
        case ROLES.STUDENT:
          query = `SELECT users.system_id, projects.*
              FROM users
              INNER JOIN projects
              ON users.system_id = ? AND projects.semester = users.semester_group;`;
          params = [req.user.system_id];
          break;
        case ROLES.ADMIN:
          query =
            "SELECT * FROM projects WHERE projects.status NOT IN ('in progress', 'completed', 'rejected', 'archive');";
          params = [];
          break;
        default:
          const error = new Error(
            "Invalid user type...something must be very very broken...",
          );
          error.statusCode = 500;
          return next(error);
      }

      db.query(query, params)
        .then((projects) => res.send(projects))
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.get(
    "/getProjectDates",
    require("../user_auth").isSignedIn,
    (req, res, next) => {
      const getDatesQuery = `SELECT start_date, end_date FROM semester_group WHERE semester_id = ?`;
      const getDatesParams = [req.query.semester];
      db.query(getDatesQuery, getDatesParams)
        .then((dates) => {
          res.send(dates);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.post(
    "/editProject",
    [require("../user_auth").isAdmin, require("../user_auth").canWrite, ...[]],
    async (req, res, next) => {
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
        body.display_name ? body.display_name : null, // Empty strings should be turned to null
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

      const insertValues = body.projectCoaches
        .split(",")
        .map((coachId) => ` ('${body.project_id}', '${coachId}')`);
      const deleteValues = body.projectCoaches
        .split(",")
        .map((coachId) => `'${coachId}'`);
      const updateCoachesSql = `INSERT OR IGNORE INTO '${DB_CONFIG.tableNames.project_coaches}' ('project_id', 'coach_id') VALUES ${insertValues};`;
      const deleteCoachesSQL = `DELETE FROM '${DB_CONFIG.tableNames.project_coaches}'
                                      WHERE project_coaches.project_id = '${body.project_id}'
                                      AND project_coaches.coach_id NOT IN (${deleteValues});`;

      Promise.all([
        db.query(updateProjectSql, updateProjectParams),
        db.query(updateCoachesSql),
        db.query(deleteCoachesSQL),
      ])
        .then((values) => {
          return res.sendStatus(200);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  router.patch(
    "/updateProposalStatus",
    [require("../user_auth").isAdmin, require("../user_auth").canWrite, ...[]],
    (req, res, next) => {
      const query = `UPDATE ${DB_CONFIG.tableNames.senior_projects} SET status = ? WHERE project_id = ?`;
      db.query(query, [req.body.status, req.body.project_id])
        .then(() => {
          res.sendStatus(200);
        })
        .catch((err) => {
          console.error(err);
          const error = new Error(err);
          error.statusCode = 500;
          return next(error);
        });
    },
  );

  return router;
};
