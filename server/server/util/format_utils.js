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

module.exports = {
  getActor,
  actorLabel,
  humanizeFieldName,
  displayValue,
  summarizeChangedFields,
};
