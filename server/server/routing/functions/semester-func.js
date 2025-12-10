const { ROLES } = require("../consts");
const ACTION_TARGETS = {
  ADMIN: "admin",
  COACH: "coach",
  INDIVIDUAL: "individual",
  TEAM: "team",
  PEER_EVALUATION: "peer_evaluation",
  COACH_ANNOUNCEMENT: "coach_announcement",
  STUDENT_ANNOUNCEMENT: "student_announcement",
};

/**
 * Get all semesters
 */
const getSemesters = (db) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM semester_group
      ORDER BY end_date, start_date, name
    `;
    db.query(query)
      .then((values) => {
        resolve(values);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get semester announcements
 */
const getSemesterAnnouncements = (db, user, semester) => {
  return new Promise((resolve, reject) => {
    let filter = "";
    if (user.type === ROLES.STUDENT) {
      // req.query.semester comes in as a string and req.user.semester_group is a number so convert both to strings to compare them.
      if (`${semester}` !== `${user.semester_group}`) {
        reject(
          new Error(
            "Students can not access announcements that are not for your project",
          ),
        );
        return;
      }

      filter = `AND actions.action_target IS NOT '${ACTION_TARGETS.COACH_ANNOUNCEMENT}'`;
      // Note: Since we only do this check for students, coaches can technically hack the request to see announcements for other semesters.
      // Unfortunately, coaches don't inherently have a semester like students do
      // and 1am Kevin can't think of another way of ensuring that a coach isn't lying to us about their semester ...but idk what they would gain form doing that sooo ima just leave it for now
    }

    //ToDo: make sure that the dates don't screw things up because of GMT i.e. it becomes tomorrow in GMT before it becomes tomorrow at the server's location
    const query = `
      SELECT action_title, action_id, start_date, due_date, semester, action_target, date_deleted, page_html
      FROM actions
      WHERE actions.date_deleted = '' AND actions.semester = ?
          AND (actions.action_target IN ('${ACTION_TARGETS.COACH_ANNOUNCEMENT}', '${ACTION_TARGETS.STUDENT_ANNOUNCEMENT}') AND actions.start_date <= date('now') AND actions.due_date >= date('now'))
          ${filter}
      ORDER BY actions.due_date ASC
    `;

    db.query(query, [semester])
      .then((values) => {
        resolve(values);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Edit an existing semester
 */
const editSemester = (db, body) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE semester_group
      SET name = ?,
          dept = ?,
          start_date = ?,
          end_date = ?
      WHERE semester_id = ?
    `;

    const params = [
      body.name,
      body.dept,
      body.start_date,
      body.end_date,
      body.semester_id,
    ];

    db.query(query, params)
      .then(() => {
        resolve({ success: true });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Create a new semester
 */
const createSemester = (db, body) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO semester_group
      (name, dept, start_date, end_date)
      VALUES (?,?,?,?)
    `;

    const params = [body.name, body.dept, body.start_date, body.end_date];

    db.query(query, params)
      .then(() => {
        resolve({ success: true });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  getSemesters,
  getSemesterAnnouncements,
  editSemester,
  createSemester,
};
