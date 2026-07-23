const Logger = require("../logger");
const DB_CONFIG = require("../database/db_config");

const ACTION_TYPES = {
  CREATE: "CREATED",
  UPDATE: "UPDATED",
  DEACTIVATE: "DEACTIVATED",
  REACTIVATE: "REACTIVATED",
};

module.exports = (db) => {
  function getActor(req) {
    const system_id = req.user ? req.user.system_id : null;
    const mock_id = req.user && req.user.mock ? req.user.mock.system_id : null;
    return { system_id, mock_id };
  }

  function actorLabel(req) {
    if (!req.user) return "Unknown user";
    const name = [req.user.fname, req.user.lname].filter(Boolean).join(" ");
    return name ? `${name} (${req.user.system_id})` : req.user.system_id;
  }

  async function record(
    req,
    { actionType, entityType, entityId, message, details },
  ) {
    const { system_id, mock_id } = getActor(req);

    const insertQuery = `
      INSERT INTO ${DB_CONFIG.tableNames.audit_log}
        (system_id, mock_id, action_type, entity_type, entity_id, message, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      system_id,
      mock_id,
      actionType,
      entityType,
      entityId === undefined || entityId === null ? null : String(entityId),
      message,
      details === undefined ? null : JSON.stringify(details),
    ];

    try {
      await db.query(insertQuery, params);
    } catch (err) {
      Logger.error(`Failed to write audit log entry: ${err.message}`);
    }
  }

  function humanizeFieldName(field) {
    return field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function displayValue(value) {
    if (value === null || value === undefined || value === "") return "(empty)";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }

  function summarizeChangedFields(changedFields, excludeFields = []) {
    if (!changedFields || typeof changedFields !== "object") return "";

    return Object.keys(changedFields)
      .filter((field) => !excludeFields.includes(field))
      .map((field) => {
        const [before, after] = changedFields[field];
        return `${humanizeFieldName(field)}: "${displayValue(before)}" → "${displayValue(after)}"`;
      })
      .join("; ");
  }

  return { record, actorLabel, summarizeChangedFields, ACTION_TYPES };
};

module.exports.ACTION_TYPES = ACTION_TYPES;
