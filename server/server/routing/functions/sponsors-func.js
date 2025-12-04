const DB_CONFIG = require("../database/db_config");

/**
 * Create a new sponsor
 */
const createSponsor = (db, body, userId) => {
  return new Promise((resolve, reject) => {
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
    ];

    db.query(createSponsorQuery, createSponsorParams)
      .then(() => {
        resolve({ statusCode: 200, error: null });
      })
      .catch((err) => {
        resolve({ statusCode: 500, error: err });
      });
  });
};

/**
 * Edit an existing sponsor
 */
const editSponsor = (db, body) => {
  return new Promise((resolve, reject) => {
    let updateSponsorQuery = `
      UPDATE sponsors
      SET fname       = ?,
          lname       = ?,
          company     = ?,
          division    = ?,
          email       = ?,
          phone       = ?,
          association = ?,
          type        = ?,
          inActive    = ?,
          doNotEmail  = ?
      WHERE sponsor_id = ?
    `;

    let inActive = body.inActive === "true" || body.inActive === "1";
    let doNotEmail = body.doNotEmail === "true" || body.doNotEmail === "1";

    let updateSponsorParams = [
      body.fname,
      body.lname,
      body.company,
      body.division,
      body.email,
      body.phone,
      body.association,
      body.type,
      inActive,
      doNotEmail,
      body.sponsor_id,
    ];

    db.query(updateSponsorQuery, updateSponsorParams)
      .then(() => {
        resolve({ statusCode: 200, error: null });
      })
      .catch((err) => {
        resolve({ statusCode: 500, error: err });
      });
  });
};

/**
 * Create a sponsor note
 */
const createSponsorNote = (
  db,
  noteContent,
  sponsorId,
  userId,
  mockId,
  previousNote,
) => {
  return new Promise(async (resolve, reject) => {
    let insertQuery = `
      INSERT into sponsor_notes
          (note_content, sponsor, author, mock_id, previous_note)
      values (?, ?, ?, ?, ?)`;

    let status = 500;
    let error = null;

    try {
      await db.query(insertQuery, [
        noteContent,
        sponsorId,
        userId,
        mockId,
        previousNote,
      ]);
      status = 200;
    } catch (err) {
      status = 500;
      error = err;
    }

    resolve([status, error]);
  });
};

/**
 * Get all sponsors with pagination
 */
const getAllSponsors = (db, userType, resultLimit, offset) => {
  return new Promise((resolve, reject) => {
    if (userType === "student") {
      resolve({ sponsors: [], sponsorsCount: 0 });
      return;
    }

    let getSponsorsQuery = `
      SELECT *
      FROM sponsors
      ORDER BY
          sponsors.company ASC,
          sponsors.division ASC,
          sponsors.fname ASC,
          sponsors.lname ASC
      LIMIT ?
      OFFSET ?
    `;

    let queryParams = [resultLimit || -1, offset || 0];
    let getSponsorsCount = `SELECT COUNT(*) FROM sponsors`;

    const sponsorsPromise = db.query(getSponsorsQuery, queryParams);
    const countPromise = db.query(getSponsorsCount);

    Promise.all([countPromise, sponsorsPromise])
      .then(([[countResult], sponsors]) => {
        resolve({
          sponsors,
          sponsorsCount: countResult[Object.keys(countResult)[0]],
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get sponsor for a project
 */
const getProjectSponsor = (db, projectId) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM sponsors
      WHERE sponsor_id = (SELECT sponsor FROM projects WHERE project_id = ?)`;

    db.query(query, [projectId])
      .then((sponsors) => {
        resolve(sponsors);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all projects for a sponsor
 */
const getSponsorProjects = (db, sponsorId) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT *
      FROM projects
      WHERE sponsor = ?
    `;

    db.query(query, [sponsorId])
      .then((projects) => {
        resolve(projects);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get notes for a sponsor
 */
const getSponsorNotes = (db, sponsorId) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT sponsor_notes.*, 
             users.fname, users.lname, users.email, users.type,
             (SELECT users.fname || ' ' || users.lname FROM users WHERE users.system_id = sponsor_notes.mock_id) AS mock_name
      FROM sponsor_notes
      JOIN users ON users.system_id = sponsor_notes.author
      WHERE sponsor_notes.sponsor = ?
      ORDER BY creation_date
    `;

    db.query(query, [sponsorId])
      .then((notes) => {
        resolve(notes);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Search for sponsors with pagination
 */
const searchForSponsor = (db, userType, searchQuery, resultLimit, offset) => {
  return new Promise((resolve, reject) => {
    if (userType === "student") {
      resolve({ sponsors: [], sponsorsCount: 0 });
      return;
    }

    const searchQueryParam = searchQuery || "";

    let getSponsorsQuery = `
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

    let getSponsorsCount = `SELECT COUNT(*)
      FROM sponsors
      WHERE
          company LIKE ?
         OR division LIKE ?
         OR fname LIKE ?
         OR lname LIKE ?
    `;

    let queryParams = [
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      offset || 0,
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      resultLimit || 0,
    ];

    let countParams = [
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
    ];

    const sponsorsPromise = db.query(getSponsorsQuery, queryParams);
    const countPromise = db.query(getSponsorsCount, countParams);

    Promise.all([countPromise, sponsorsPromise])
      .then(([[countResult], sponsors]) => {
        resolve({
          sponsors,
          sponsorsCount: countResult[Object.keys(countResult)[0]],
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all sponsor info
 */
const selectAllSponsorInfo = (db) => {
  return new Promise((resolve, reject) => {
    db.selectAll(DB_CONFIG.tableNames.sponsor_info)
      .then((sponsors) => {
        resolve(sponsors);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get sponsor data for CSV export
 */
const getSponsorData = (db) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM sponsors WHERE inActive = 0 AND doNotEmail = 0`;

    db.query(query, [])
      .then((sponsors) => {
        resolve(sponsors);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  createSponsor,
  editSponsor,
  createSponsorNote,
  getAllSponsors,
  getProjectSponsor,
  getSponsorProjects,
  getSponsorNotes,
  searchForSponsor,
  selectAllSponsorInfo,
  getSponsorData,
};
