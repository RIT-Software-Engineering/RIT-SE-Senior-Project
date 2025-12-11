const path = require("path");
const { ROLES } = require("../consts");

const ACTION_TARGETS = {
  ADMIN: "admin",
  COACH: "coach",
  TEAM: "team",
  INDIVIDUAL: "individual",
  COACH_ANNOUNCEMENT: "coach_announcement",
  STUDENT_ANNOUNCEMENT: "student_announcement",
  PEER_EVALUATION: "peer_evaluation",
};

/**
 * Get submission form data and files
 */
const getSubmission = (db, user, logId) => {
  return new Promise((resolve, reject) => {
    let getSubmissionQuery = "";
    let params = [];

    switch (user.type) {
      case ROLES.STUDENT:
        getSubmissionQuery = `SELECT action_log.form_data, action_log.files
          FROM action_log
          JOIN actions ON actions.action_id = action_log.action_template
          WHERE action_log.action_log_id = ? AND (actions.action_target = '${ACTION_TARGETS.TEAM}' OR action_log.system_id = ?)`;
        params = [logId, user.system_id];
        break;
      case ROLES.COACH:
        getSubmissionQuery = `SELECT action_log.form_data, action_log.files
          FROM action_log
          JOIN project_coaches ON project_coaches.project_id = action_log.project
          WHERE action_log.action_log_id = ? AND project_coaches.coach_id = ?`;
        params = [logId, user.system_id];
        break;
      case ROLES.ADMIN:
        getSubmissionQuery = `SELECT action_log.form_data, action_log.files
          FROM action_log
          WHERE action_log.action_log_id = ?`;
        params = [logId];
        break;
      default:
        reject(new Error("Unknown Role"));
        return;
    }

    db.query(getSubmissionQuery, params)
      .then((submissions) => {
        resolve(submissions);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get submission file path and validate access
 */
const getSubmissionFile = (db, user, logId, fileName) => {
  return new Promise(async (resolve, reject) => {
    let getSubmissionQuery = "";
    let params = [];

    switch (user.type) {
      case ROLES.STUDENT:
        getSubmissionQuery = `SELECT action_log.files, action_log.project, action_log.system_id, actions.action_id, actions.action_target
          FROM action_log
          JOIN actions ON actions.action_id = action_log.action_template
          WHERE action_log.action_log_id = ? AND (actions.action_target = '${ACTION_TARGETS.TEAM}' OR action_log.system_id = ?)`;
        params = [logId, user.system_id];
        break;
      case ROLES.COACH:
        getSubmissionQuery = `SELECT action_log.files, action_log.project, action_log.system_id, actions.action_id, actions.action_target
          FROM action_log
          JOIN actions ON actions.action_id = action_log.action_template
          JOIN project_coaches ON project_coaches.project_id = action_log.project
          WHERE action_log.action_log_id = ? AND project_coaches.coach_id = ?`;
        params = [logId, user.system_id];
        break;
      case ROLES.ADMIN:
        getSubmissionQuery = `SELECT action_log.files, action_log.project, action_log.system_id, actions.action_id, actions.action_target
          FROM action_log
          JOIN actions ON actions.action_id = action_log.action_template
          WHERE action_log.action_log_id = ?`;
        params = [logId];
        break;
      default:
        reject(new Error("Unknown Role"));
        return;
    }

    try {
      const result = await db.query(getSubmissionQuery, params);
      const { files, project, action_target, system_id, action_id } =
        result[0] || {};

      let fileList = [];
      if (files) {
        fileList = files.split(",");
      }

      if (
        fileList.includes(fileName) &&
        project &&
        action_target &&
        system_id &&
        action_id
      ) {
        const filePath = path.join(
          __dirname,
          `../project_docs/${project}/${action_target}/${action_id}/${system_id}/${fileName}`,
        );
        resolve(filePath);
      } else {
        reject(
          new Error("File not found or you are unauthorized to view file"),
        );
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  getSubmission,
  getSubmissionFile,
};
