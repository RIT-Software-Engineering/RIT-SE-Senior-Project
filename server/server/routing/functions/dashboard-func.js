/**
 * Get additional user info
 */
const getAdditionalInfo = (db, systemId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT json_extract(profile_info, '$.additional_info') AS additional_info
                   FROM users WHERE system_id = ?`;

    db.query(query, [systemId])
      .then((result) => {
        if (result.length === 0) {
          reject(new Error("User not found"));
          return;
        }
        resolve(result[0]);
      })
      .catch((err) => {
        reject(new Error("Database query failed: " + err.message));
      });
  });
};

/**
 * Update additional user info
 */
const editAdditionalInfo = (db, systemId, additionalInfo) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users
                   SET profile_info = json_set(profile_info, '$.additional_info', ?)
                   WHERE system_id = ?`;

    db.query(query, [additionalInfo, systemId])
      .then(() => {
        resolve({ message: "Additional info updated successfully" });
      })
      .catch((err) => {
        reject(new Error("Database update failed: " + err.message));
      });
  });
};

/**
 * Set dark mode preference
 */
const setDarkMode = (db, systemId, darkMode) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users
                   SET profile_info = json_set(profile_info, '$.dark_mode', ?)
                   WHERE system_id = ?`;

    db.query(query, [darkMode, systemId])
      .then(() => {
        resolve({ message: "Dark mode preference updated successfully" });
      })
      .catch((err) => {
        reject(new Error("Database update failed: " + err.message));
      });
  });
};

/**
 * Get dark mode preference
 */
const getDarkMode = (db, systemId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT JSON_EXTRACT(profile_info, '$.dark_mode') AS dark_mode
                   FROM users
                   WHERE system_id = ?`;

    db.query(query, [systemId])
      .then((result) => {
        if (result.length === 0) {
          reject(new Error("User not found"));
          return;
        }

        const darkModeRaw = result[0].dark_mode;
        const dark_mode = Boolean(darkModeRaw);

        resolve({ dark_mode });
      })
      .catch((err) => {
        reject(new Error("Database query failed: " + err.message));
      });
  });
};

/**
 * Get peer evaluations
 */
const getPeerEvals = (db, semesterNumber) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT action_id FROM actions WHERE action_target = 'peer_evaluation'`;
    let queryParams = [];

    if (semesterNumber) {
      query += ` AND semester = ?`;
      queryParams.push(semesterNumber);
    }

    db.query(query, queryParams)
      .then((values) => {
        const actionIds = values.map((row) => row.action_id);

        if (actionIds.length === 0) {
          resolve([]);
          return;
        }

        const getPeerEvalLogsQuery = `SELECT action_log.*, users.fname, users.lname, users.type
                                      FROM action_log
                                      LEFT JOIN users ON action_log.system_id = users.system_id
                                      WHERE action_template IN (${actionIds.join(",")})
                                      ORDER BY submission_datetime DESC`;

        return db.query(getPeerEvalLogsQuery);
      })
      .then((logs) => {
        resolve(logs);
      })
      .catch((err) => {
        reject(new Error("Error fetching peer evaluations: " + err.message));
      });
  });
};

/**
 * Set gantt view preference
 */
const setGanttView = (db, systemId, ganttView) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users
                   SET profile_info = json_set(profile_info, '$.gantt_view', ?)
                   WHERE system_id = ?`;

    db.query(query, [ganttView, systemId])
      .then(() => {
        resolve({ message: "Gantt view preference updated successfully" });
      })
      .catch((err) => {
        reject(new Error("Database update failed: " + err.message));
      });
  });
};

/**
 * Get gantt view preference
 */
const getGanttView = (db, systemId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT JSON_EXTRACT(profile_info, '$.gantt_view') AS gantt_view
                   FROM users
                   WHERE system_id = ?`;

    db.query(query, [systemId])
      .then((result) => {
        if (result.length === 0) {
          reject(new Error("User not found"));
          return;
        }

        const ganttViewRaw = result[0].gantt_view;
        const gantt_view =
          ganttViewRaw === true ||
          ganttViewRaw === "true" ||
          ganttViewRaw === 1 ||
          ganttViewRaw === "1";

        resolve({ gantt_view });
      })
      .catch((err) => {
        reject(new Error("Database query failed: " + err.message));
      });
  });
};

/**
 * Set calendar view preference
 */
const setCalendarView = (db, systemId, calendarView) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users
                   SET profile_info = json_set(profile_info, '$.calendar_view', ?)
                   WHERE system_id = ?`;

    db.query(query, [calendarView, systemId])
      .then(() => {
        resolve({ message: "Calendar view preference updated successfully" });
      })
      .catch((err) => {
        reject(new Error("Database update failed: " + err.message));
      });
  });
};

/**
 * Get calendar view preference
 */
const getCalendarView = (db, systemId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT JSON_EXTRACT(profile_info, '$.calendar_view') AS calendar_view
                   FROM users
                   WHERE system_id = ?`;

    db.query(query, [systemId])
      .then((result) => {
        if (result.length === 0) {
          reject(new Error("User not found"));
          return;
        }

        const calendarViewRaw = result[0].calendar_view;
        const calendar_view =
          calendarViewRaw === true ||
          calendarViewRaw === "true" ||
          calendarViewRaw === 1 ||
          calendarViewRaw === "1";

        resolve({ calendar_view });
      })
      .catch((err) => {
        reject(new Error("Database query failed: " + err.message));
      });
  });
};

/**
 * Set milestone view preference
 */
const setMilestoneView = (db, systemId, milestoneView) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users
                   SET profile_info = json_set(profile_info, '$.milestone_view', ?)
                   WHERE system_id = ?`;

    db.query(query, [milestoneView, systemId])
      .then(() => {
        resolve({ message: "Milestone view preference updated successfully" });
      })
      .catch((err) => {
        reject(new Error("Database update failed: " + err.message));
      });
  });
};

/**
 * Get milestone view preference
 */
const getMilestoneView = (db, systemId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT JSON_EXTRACT(profile_info, '$.milestone_view') AS milestone_view
                   FROM users
                   WHERE system_id = ?`;

    db.query(query, [systemId])
      .then((result) => {
        if (result.length === 0) {
          reject(new Error("User not found"));
          return;
        }

        const milestoneViewRaw = result[0].milestone_view;
        const milestone_view =
          milestoneViewRaw === true ||
          milestoneViewRaw === "true" ||
          milestoneViewRaw === 1 ||
          milestoneViewRaw === "1";

        resolve({ milestone_view });
      })
      .catch((err) => {
        reject(new Error("Database query failed: " + err.message));
      });
  });
};

module.exports = {
  getAdditionalInfo,
  editAdditionalInfo,
  setDarkMode,
  getDarkMode,
  getPeerEvals,
  setGanttView,
  getGanttView,
  setCalendarView,
  getCalendarView,
  setMilestoneView,
  getMilestoneView,
};
