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

function safeParseChangedFields(changedFields) {
  if (!changedFields) return {};
  if (typeof changedFields === "object") return changedFields;
  try {
    return JSON.parse(changedFields);
  } catch (err) {
    return {};
  }
}

function detectActiveStateTransition(changedFields, fieldName) {
  if (!(fieldName in changedFields)) return null;

  const [beforeRaw, afterRaw] = changedFields[fieldName];
  const isEmpty = (v) => v === "" || v === undefined || v === null;
  const wasActive = isEmpty(beforeRaw);
  const isActiveNow = isEmpty(afterRaw);

  delete changedFields[fieldName];

  if (wasActive && !isActiveNow) return "deactivated";
  if (!wasActive && isActiveNow) return "reactivated";
  return null;
}

function detectBooleanActiveStateTransition(changedFields, fieldName) {
  if (!(fieldName in changedFields)) return null;

  const [beforeRaw, afterRaw] = changedFields[fieldName];
  const isInactive = (v) => v === "true" || v === "1" || v === true || v === 1;
  const wasActive = !isInactive(beforeRaw);
  const isActiveNow = !isInactive(afterRaw);

  delete changedFields[fieldName];

  if (wasActive && !isActiveNow) return "deactivated";
  if (!wasActive && isActiveNow) return "reactivated";
  return null;
}

module.exports = {
  getActor,
  actorLabel,
  humanizeFieldName,
  displayValue,
  summarizeChangedFields,
  safeParseChangedFields,
  detectActiveStateTransition,
  detectBooleanActiveStateTransition,
};
