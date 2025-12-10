const moment = require("moment");
const DB_CONFIG = require("../database/db_config");
const CONSTANTS = require("../consts");
const { ROLES } = require("../consts");

/**
 * Get all student information
 */
const selectAllStudentInfo = (db) => {
  return new Promise((resolve, reject) => {
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
        resolve(values);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all non-student information (coaches, admins)
 */
const selectAllNonStudentInfo = (db) => {
  return new Promise((resolve, reject) => {
    let getUsersQuery = `
      SELECT *
      FROM users
      LEFT JOIN semester_group
      ON users.semester_group = semester_group.semester_id
      WHERE type != 'student'
    `;
    db.query(getUsersQuery)
      .then((values) => {
        resolve(values);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get semester students based on user role
 */
const getSemesterStudents = (db, user, projectId) => {
  return new Promise((resolve, reject) => {
    let query = "";
    let params = [];
    switch (user.type) {
      case ROLES.STUDENT:
        query = `
          SELECT users.* 
          FROM users 
          WHERE users.semester_group = (
            SELECT semester_group FROM users WHERE system_id = ?
          ) AND users.type = 'student'`;
        params = [user.system_id];
        break;

      case ROLES.COACH:
        query = `
          SELECT users.* FROM users
          LEFT JOIN semester_group
            ON users.semester_group = semester_group.semester_id
          WHERE users.semester_group IN (
            SELECT projects.semester FROM projects
            WHERE projects.project_id IN (
              SELECT project_coaches.project_id FROM project_coaches
              WHERE project_coaches.coach_id = ?
            )
          )`;
        params = [user.system_id];
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
      .then((users) => {
        if (user.type === ROLES.STUDENT) {
          users = users.map((u) => {
            let output = {};
            if (u.project === user.project) {
              output["last_login"] = u["last_login"];
              output["prev_login"] = u["prev_login"];
            }
            output["active"] = u["active"];
            output["email"] = u["email"];
            output["fname"] = u["fname"];
            output["lname"] = u["lname"];
            output["project"] = u["project"];
            output["semester_group"] = u["semester_group"];
            output["system_id"] = u["system_id"];
            output["type"] = u["type"];
            return output;
          });
        }
        resolve(users);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get project members
 */
const getProjectMembers = (db, projectId) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT users.*, project_coaches.project_id FROM users
      LEFT JOIN project_coaches ON project_coaches.coach_id = users.system_id
      WHERE users.project = ? OR project_coaches.project_id = ?`;

    let params = [projectId, projectId];

    db.query(query, params)
      .then((users) => {
        resolve(users);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all active users
 */
const getActiveUsers = (db) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT ${CONSTANTS.SIGN_IN_SELECT_ATTRIBUTES}
      FROM users
      WHERE active = ''`;
    db.query(query)
      .then((users) => {
        resolve(users);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Create a new user
 */
const createUser = (db, body) => {
  return new Promise((resolve, reject) => {
    const active =
      body.active === "false" ? moment().format(CONSTANTS.datetime_format) : "";

    const viewOnly = body.viewOnly === "true" ? "TRUE" : "FALSE";

    // Default profile_info with required fields
    const defaultProfileInfo = JSON.stringify({
      additional_info: "",
      dark_mode: false,
      gantt_view: true,
    });

    const sql = `INSERT INTO ${DB_CONFIG.tableNames.users}
      (system_id, fname, lname, email, type, semester_group, project, active, view_only, profile_info)
      VALUES (?,?,?,?,?,?,?,?,?,?)`;

    const params = [
      body.system_id,
      body.fname,
      body.lname,
      body.email,
      body.type,
      body.semester_group === "" ? null : body.semester_group,
      body.project === "" ? null : body.project,
      active,
      viewOnly,
      defaultProfileInfo,
    ];

    db.query(sql, params)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Batch create multiple users
 */
const batchCreateUser = (db, users) => {
  return new Promise(async (resolve, reject) => {
    const failedUsers = [];
    const successUsers = [];

    for (const user of users) {
      // Default profile_info with required fields
      const defaultProfileInfo = JSON.stringify({
        additional_info: "",
        dark_mode: false,
        gantt_view: true,
      });

      const values = [
        user.system_id,
        user.fname,
        user.lname,
        user.email,
        user.type,
        user.semester_group === "" ? null : user.semester_group,
        user.active.toLocaleLowerCase() === "false"
          ? moment().format(CONSTANTS.datetime_format)
          : "",
        defaultProfileInfo,
      ];

      try {
        await db.query(
          `INSERT INTO ${DB_CONFIG.tableNames.users} 
          (system_id, fname, lname, email, type, semester_group, active, profile_info) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          values,
        );
        successUsers.push(user);
      } catch (err) {
        let errorMessage = err.message;

        // Provide more user-friendly error messages for common constraint violations
        if (err.code === "SQLITE_CONSTRAINT") {
          if (
            err.message.includes("UNIQUE constraint failed: users.system_id")
          ) {
            errorMessage = `System ID '${user.system_id}' already exists`;
          } else if (
            err.message.includes("UNIQUE constraint failed: users.email")
          ) {
            errorMessage = `Email '${user.email}' already exists`;
          } else {
            errorMessage = "Duplicate data - user may already exist";
          }
        }

        failedUsers.push({ user, error: errorMessage });
      }
    }

    resolve({ successUsers, failedUsers });
  });
};

/**
 * Edit user information
 */
const editUser = (db, body) => {
  return new Promise((resolve, reject) => {
    const active =
      body.active === "false" ? moment().format(CONSTANTS.datetime_format) : "";

    const viewOnly = body.viewOnly === "true" ? "TRUE" : "FALSE";

    let updateQuery = `
      UPDATE users
      SET fname = ?,
          lname = ?,
          email = ?,
          type = ?,
          semester_group = ?,
          project = ?,
          active = ?,
          view_only = ?
      WHERE system_id = ?
    `;

    let params = [
      body.fname,
      body.lname,
      body.email,
      body.type,
      body.semester_group || null,
      body.project || null,
      active,
      viewOnly,
      body.system_id,
    ];

    db.query(updateQuery, params)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  selectAllStudentInfo,
  selectAllNonStudentInfo,
  getSemesterStudents,
  getProjectMembers,
  getActiveUsers,
  createUser,
  batchCreateUser,
  editUser,
};
