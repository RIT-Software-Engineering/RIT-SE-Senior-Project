const Logger = require("../logger");
const DBHandler = require("../database/db");
const DB_CONFIG = require("../database/db_config");
const {
  getActor,
  actorLabel,
  summarizeChangedFields,
} = require("./audit_utilities");

const db = new DBHandler();

const ACTION_TYPES = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  DEACTIVATE: "DEACTIVATE",
  REACTIVATE: "REACTIVATE",
};

async function record(
  req,
  { actionType, entityType, entityId, message, details },
) {
  const { system_id, mock_id } = getActor(req);

  const insertQuery = `
    INSERT INTO ${DB_CONFIG.tableNames.audit_log}
      (system_id, mock_id, action_type, entity_type, entity_id, message, details_json)
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
    Logger.error(
      `Failed to write audit log entry for ${system_id || "unknown user"} ` +
        `(${actionType} ${entityType}${entityId ? ":" + entityId : ""}): ${err.message}`,
    );
  }
}

module.exports = { record, actorLabel, summarizeChangedFields, ACTION_TYPES };
