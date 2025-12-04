const moment = require("moment");
const DB_CONFIG = require("../database/db_config");
const CONSTANTS = require("../consts");

/**
 * Helper function to convert string to boolean
 */
const checkBox = (data) => {
  if (data === "true" || data === "1") {
    return 1;
  }
  return 0;
};

/**
 * Helper function to convert string to integer
 */
const strToInt = (data) => {
  if (typeof data === "string") {
    return parseInt(data);
  }
  return 0;
};

/**
 * Create a new archive entry
 */
const createArchive = (db, body, user) => {
  return new Promise((resolve, reject) => {
    const inactive =
      body.inactive === "true"
        ? moment().format(CONSTANTS.datetime_format)
        : "";
    const locked =
      body.locked === "true"
        ? user.fname +
          " " +
          user.lname +
          " locked at " +
          moment().format(CONSTANTS.datetime_format)
        : "";

    const query = `INSERT INTO ${DB_CONFIG.tableNames.archive}(featured, outstanding, creative,
      priority, title, project_id, team_name, members, sponsor, coach, poster_thumb,
      poster_full, archive_image, synopsis, video, name, dept, start_date, end_date,
      keywords, url_slug, inactive, locked)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      checkBox(body.featured),
      checkBox(body.outstanding),
      checkBox(body.creative),
      strToInt(body.priority),
      body.title,
      body.project_id,
      body.team_name,
      body.members,
      body.sponsor,
      body.coach,
      body.poster_thumb,
      body.poster_full,
      body.archive_image,
      body.synopsis,
      body.video,
      body.name,
      body.dept,
      body.start_date,
      body.end_date,
      body.keywords,
      body.url_slug,
      inactive,
      locked,
    ];

    db.query(query, params)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get active archive projects with pagination
 */
const getActiveArchiveProjects = (db, resultLimit, page, featured) => {
  return new Promise((resolve, reject) => {
    let skipNum = page * resultLimit;
    let projectsQuery;
    let rowCountQuery;

    if (featured === "true") {
      projectsQuery = `SELECT * FROM ${DB_CONFIG.tableNames.archive} WHERE oid NOT IN
        ( SELECT oid FROM ${DB_CONFIG.tableNames.archive} ORDER BY random() LIMIT ? )
        AND inactive = '' AND featured = 1 ORDER BY random() LIMIT ?`;
      rowCountQuery = `SELECT COUNT(*) FROM ${DB_CONFIG.tableNames.archive} WHERE inactive = ''`;
    } else {
      projectsQuery = `SELECT * FROM ${DB_CONFIG.tableNames.archive} WHERE oid NOT IN
        ( SELECT oid FROM ${DB_CONFIG.tableNames.archive} ORDER BY archive_id LIMIT ? )
        AND inactive = '' ORDER BY archive_id LIMIT ?`;
      rowCountQuery = `SELECT COUNT(*) FROM ${DB_CONFIG.tableNames.archive} WHERE inactive = ''`;
    }

    const projectsPromise = db.query(projectsQuery, [skipNum, resultLimit]);
    const rowCountPromise = db.query(rowCountQuery);

    Promise.all([rowCountPromise, projectsPromise])
      .then(([[rowCount], projects]) => {
        resolve({
          totalProjects: rowCount[Object.keys(rowCount)[0]],
          projects: projects,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all archive projects with pagination (admin view)
 */
const getArchiveProjects = (db, resultLimit, offset) => {
  return new Promise((resolve, reject) => {
    let skipNum = offset * resultLimit;
    let projectsQuery = `SELECT * FROM ${DB_CONFIG.tableNames.archive} WHERE
      oid NOT IN (SELECT oid FROM ${DB_CONFIG.tableNames.archive} ORDER BY archive_id LIMIT ?)
      ORDER BY archive_id LIMIT ?`;
    let rowCountQuery = `SELECT COUNT(*) FROM ${DB_CONFIG.tableNames.archive}`;

    const projectsPromise = db.query(projectsQuery, [skipNum, resultLimit]);
    const rowCountPromise = db.query(rowCountQuery);

    Promise.all([rowCountPromise, projectsPromise])
      .then(([[rowCount], projects]) => {
        resolve({
          totalProjects: rowCount[Object.keys(rowCount)[0]],
          projects: projects,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get a specific archive project by ID
 */
const getArchiveProject = (db, archiveId) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM archive WHERE archive_id = ?`;
    const params = [archiveId];

    db.query(query, params)
      .then((project) => {
        resolve(project);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get archive project by slug
 */
const getArchiveFromSlug = (db, urlSlug) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM archive WHERE url_slug=?`;
    let params = [urlSlug];

    db.query(query, params)
      .then((values) => {
        resolve(values);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get archive entries for a project
 */
const getArchiveFromProject = (db, projectId) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM archive WHERE archive.project_id=?`;
    let params = [projectId];

    db.query(query, params)
      .then((values) => {
        resolve(values);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Search archive projects
 */
const searchForArchive = (db, resultLimit, offset, searchQuery, inactive) => {
  return new Promise((resolve, reject) => {
    let skipNum = offset * resultLimit;
    let getProjectsQuery = "";
    let queryParams = [];
    let getProjectsCount = "";
    let projectCountParams = [];

    const searchQueryParam = searchQuery || "";

    if (inactive === "true") {
      getProjectsQuery = `SELECT * FROM archive WHERE
        archive.OID NOT IN (
        SELECT OID FROM archive
        WHERE title like ? OR sponsor like ? OR members like ? OR coach like ?
        OR keywords like ? OR synopsis like ? OR url_slug like ?
        ORDER BY title, sponsor, members, coach, keywords, synopsis, url_slug
        LIMIT ?)
        AND (archive.title like ? OR archive.sponsor like ? OR archive.members like ?
        OR archive.coach like ? OR archive.keywords like ? OR archive.synopsis like ?
        OR archive.url_slug like ?)
        ORDER BY archive.title, archive.sponsor, archive.members, archive.coach,
        archive.keywords, archive.synopsis, archive.url_slug
        LIMIT ?`;

      getProjectsCount = `SELECT COUNT(*) FROM archive
        WHERE title like ? OR sponsor like ? OR members like ? OR coach like ?
        OR keywords like ? OR synopsis like ? OR url_slug like ?`;
    } else {
      getProjectsQuery = `SELECT * FROM archive WHERE
        archive.OID NOT IN (
        SELECT OID FROM archive
        WHERE (title like ? OR sponsor like ? OR members like ? OR coach like ?
        OR keywords like ? OR synopsis like ? OR url_slug like ?) AND inactive = ''
        ORDER BY title, sponsor, members, coach, keywords, synopsis, url_slug
        LIMIT ?)
        AND ((archive.title like ? OR archive.sponsor like ? OR archive.members like ?
        OR archive.coach like ? OR archive.keywords like ? OR archive.synopsis like ?
        OR archive.url_slug like ?) AND inactive = '')
        ORDER BY archive.title, archive.sponsor, archive.members, archive.coach,
        archive.keywords, archive.synopsis, archive.url_slug
        LIMIT ?`;

      getProjectsCount = `SELECT COUNT(*) FROM archive
        WHERE (title like ? OR sponsor like ? OR members like ? OR coach like ?
        OR keywords like ? OR synopsis like ? OR url_slug like ?)
        AND (inactive = '' OR inactive IS NULL)`;
    }

    queryParams = [
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      skipNum || 0,
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      resultLimit || 0,
    ];

    projectCountParams = [
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
      "%" + searchQueryParam + "%",
    ];

    const projectPromise = db.query(getProjectsQuery, queryParams);
    const projectCountPromise = db.query(getProjectsCount, projectCountParams);

    Promise.all([projectCountPromise, projectPromise])
      .then(([[projectCount], projectRows]) => {
        resolve({
          projectCount: projectCount[Object.keys(projectCount)[0]],
          projects: projectRows,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  createArchive,
  getActiveArchiveProjects,
  getArchiveProjects,
  getArchiveProject,
  getArchiveFromSlug,
  getArchiveFromProject,
  searchForArchive,
};
