function getActor(req) {
  const system_id = req.user ? req.user.system_id : null;
  const mock_id = req.user && req.user.mock ? req.user.mock.system_id : null;
  return { system_id, mock_id };
}

function actorLabel(req) {
  if (!req.user) return "Unknown user";
  const roleLabels = {
    admin: "Admin account",
    coach: "Coach account",
    student: "Student account",
  };

  if (req.user.mock && req.user.mock.system_id) {
    const realAdmin = req.user.mock;
    const realRoleLabel = roleLabels[realAdmin.type] || "User account";
    const mockedRoleLabel = (req.user.type || "user").toLowerCase();
    return `${realRoleLabel} (${realAdmin.system_id}) as a ${mockedRoleLabel} account (${req.user.system_id})`;
  }

  const roleLabel = roleLabels[req.user.type] || "User account";
  return `${roleLabel} (${req.user.system_id})`;
}

const FIELD_NAME_OVERRIDES = {
  fname: "First Name",
  lname: "Last Name",
};

function humanizeFieldName(field) {
  if (FIELD_NAME_OVERRIDES[field]) return FIELD_NAME_OVERRIDES[field];

  return field
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "(empty)";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatDurationFromDecimalHours(decimalHours) {
  const totalMinutes = Math.round(parseFloat(decimalHours || 0) * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours} hour(s)`);
  if (minutes > 0) parts.push(`${minutes} minute(s)`);

  return parts.length > 0 ? parts.join(" and ") : "0 minute(s)";
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

function detectTransitionFromChangedFields(
  changedFields,
  fieldName,
  isInactive,
) {
  if (!(fieldName in changedFields)) return null;

  const [beforeRaw, afterRaw] = changedFields[fieldName];
  const wasInactive = isInactive(beforeRaw);
  const isInactiveNow = isInactive(afterRaw);

  delete changedFields[fieldName];

  if (!wasInactive && isInactiveNow) return "deactivated";
  if (wasInactive && !isInactiveNow) return "reactivated";
  return null;
}

function detectActiveStateTransition(changedFields, fieldName) {
  return detectTransitionFromChangedFields(
    changedFields,
    fieldName,
    (v) => v !== "" && v !== undefined && v !== null,
  );
}

function detectBooleanActiveStateTransition(changedFields, fieldName) {
  return detectTransitionFromChangedFields(
    changedFields,
    fieldName,
    (v) => v === "true" || v === "1" || v === true || v === 1,
  );
}

function detectActiveStateTransitionFromValues(priorValue, newValue) {
  const isEmpty = (v) => v === "" || v === undefined || v === null;
  const wasActive = isEmpty(priorValue);
  const isActiveNow = isEmpty(newValue);

  if (wasActive && !isActiveNow) return "deactivated";
  if (!wasActive && isActiveNow) return "reactivated";
  return null;
}

function buildServerSideDiff(priorRow, newBody, fields) {
  const normalize = (v) => (v === null || v === undefined ? "" : String(v));
  const changedFields = {};

  fields.forEach((field) => {
    const priorVal = priorRow ? priorRow[field] : "";
    const newVal = newBody ? newBody[field] : "";
    if (normalize(priorVal) !== normalize(newVal)) {
      changedFields[field] = [priorVal, newVal];
    }
  });

  return changedFields;
}

function buildEditMessage(baseMessage, transition, changeSummary) {
  if (transition) return baseMessage;
  return changeSummary ? `${baseMessage} — ${changeSummary}` : baseMessage;
}

module.exports = {
  getActor,
  actorLabel,
  humanizeFieldName,
  displayValue,
  formatDurationFromDecimalHours,
  summarizeChangedFields,
  safeParseChangedFields,
  detectActiveStateTransition,
  detectBooleanActiveStateTransition,
  detectActiveStateTransitionFromValues,
  buildServerSideDiff,
  buildEditMessage,
};
