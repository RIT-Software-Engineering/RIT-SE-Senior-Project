const DB_CONFIG = require("../database/db_config");

/**
 * Get all active projects
 */
const getActiveProjects = (db) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT *
      FROM projects
      LEFT JOIN semester_group
      ON projects.semester = semester_group.semester_id
      WHERE projects.semester IS NOT NULL
    `;

    db.query(query)
      .then((projects) => {
        resolve(projects);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all active coaches
 */
const getActiveCoaches = (db, coachRole) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE type = ? AND active = ''`;

    db.query(sql, [coachRole])
      .then((coaches) => {
        resolve(coaches);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get coaches for a specific project
 */
const getProjectCoaches = (db, projectId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT users.* FROM users
      LEFT JOIN project_coaches ON project_coaches.coach_id = users.system_id
      WHERE project_coaches.project_id = ?`;

    db.query(query, [projectId])
      .then((coaches) => {
        resolve(coaches);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get students for a specific project
 */
const getProjectStudents = (db, projectId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE users.project = ?";

    db.query(query, [projectId])
      .then((students) => {
        resolve(students);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get student names for a project (excluding a specific student)
 */
const getProjectStudentNames = (db, projectId, excludeSystemId) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT fname,lname FROM users WHERE users.project = ? and users.system_id != ?";

    db.query(query, [projectId, excludeSystemId])
      .then((students) => {
        resolve(students);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all coach info with their projects
 */
const selectAllCoachInfo = (db, coachRole) => {
  return new Promise((resolve, reject) => {
    const query = `
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
      WHERE users.type = ?
    `;

    db.query(query, [coachRole])
      .then((coaches) => {
        resolve(coaches);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all projects
 */
const getProjects = (db) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * from projects";

    db.query(query)
      .then((projects) => {
        resolve(projects);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get candidate projects
 */
const getCandidateProjects = (db) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * from projects WHERE projects.status = 'candidate';";

    db.query(query)
      .then((projects) => {
        resolve(projects);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get projects for a user based on their role
 */
const getMyProjects = (db, userType, userId) => {
  return new Promise((resolve, reject) => {
    let query;
    let params;

    switch (userType) {
      case "coach":
        query = `SELECT projects.*
          FROM projects
          INNER JOIN project_coaches
          ON (projects.project_id = project_coaches.project_id AND project_coaches.coach_id = ?)`;
        params = [userId];
        break;
      case "student":
        query = `SELECT users.system_id, users.semester_group, projects.*
          FROM users
          INNER JOIN projects
          ON users.system_id = ? AND projects.project_id = users.project`;
        params = [userId];
        break;
      case "admin":
        query =
          "SELECT * FROM projects WHERE projects.status NOT IN ('completed', 'rejected', 'archive')";
        params = [];
        break;
      default:
        reject(new Error("Invalid user type"));
        return;
    }

    db.query(query, params)
      .then((projects) => {
        resolve(projects);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get semester projects
 */
const getSemesterProjects = (db, userType, userId) => {
  return new Promise((resolve, reject) => {
    let query;
    let params;

    switch (userType) {
      case "coach":
        query = `
          SELECT projects.*
          FROM projects
          WHERE projects.semester IN
              (SELECT projects.semester
              FROM projects
              INNER JOIN project_coaches
              ON (projects.project_id = project_coaches.project_id AND project_coaches.coach_id = ?))
        `;
        params = [userId];
        break;
      case "student":
        query = `SELECT users.system_id, projects.*
          FROM users
          INNER JOIN projects
          ON users.system_id = ? AND projects.semester = users.semester_group`;
        params = [userId];
        break;
      case "admin":
        query =
          "SELECT * FROM projects WHERE projects.status NOT IN ('in progress', 'completed', 'rejected', 'archive')";
        params = [];
        break;
      default:
        reject(new Error("Invalid user type"));
        return;
    }

    db.query(query, params)
      .then((projects) => {
        resolve(projects);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get project dates for a semester
 */
const getProjectDates = (db, semesterId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT start_date, end_date FROM semester_group WHERE semester_id = ?`;

    db.query(query, [semesterId])
      .then((dates) => {
        resolve(dates);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Edit project details and coaches
 */
const editProject = (db, body) => {
  return new Promise((resolve, reject) => {
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
      body.display_name ? body.display_name : null,
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
      .then(() => {
        resolve({ success: true });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Update proposal status
 */
const updateProposalStatus = (db, projectId, status) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE ${DB_CONFIG.tableNames.senior_projects} SET status = ? WHERE project_id = ?`;

    db.query(query, [status, projectId])
      .then(() => {
        resolve({ success: true });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  getActiveProjects,
  getActiveCoaches,
  getProjectCoaches,
  getProjectStudents,
  getProjectStudentNames,
  selectAllCoachInfo,
  getProjects,
  getCandidateProjects,
  getMyProjects,
  getSemesterProjects,
  getProjectDates,
  editProject,
  updateProposalStatus,
};
