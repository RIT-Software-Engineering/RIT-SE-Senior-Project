const AuditLog = require("./audit_logger");
const {
  safeParseChangedFields,
  detectActiveStateTransition,
  detectBooleanActiveStateTransition,
  capitalize,
  formatDurationFromDecimalHours,
} = require("./audit_utilities");

function mapActiveStateTransition(transition) {
  if (transition === "deactivated") {
    return {
      actionType: AuditLog.ACTION_TYPES.DEACTIVATE,
      verb: "deactivated",
    };
  }
  if (transition === "reactivated") {
    return {
      actionType: AuditLog.ACTION_TYPES.REACTIVATE,
      verb: "reactivated",
    };
  }
  return null;
}

function recordActionEditAudit(req, body) {
  const changedFields = safeParseChangedFields(body.changed_fields);

  let auditActionType = AuditLog.ACTION_TYPES.UPDATE;
  let auditVerb = "updated";

  const transition = mapActiveStateTransition(
    detectActiveStateTransition(changedFields, "date_deleted"),
  );
  if (transition) {
    auditActionType = transition.actionType;
    auditVerb = transition.verb;
  }

  const changeSummary = AuditLog.summarizeChangedFields(changedFields);
  const baseMessage = `${AuditLog.actorLabel(req)} ${auditVerb} action ${body.action_id} (${body.action_title})`;

  return AuditLog.record(req, {
    actionType: auditActionType,
    entityType: "action",
    entityId: body.action_id,
    message: changeSummary ? `${baseMessage} — ${changeSummary}` : baseMessage,
    details: changedFields,
  });
}

function recordActionCreateAudit(req, body, newActionId) {
  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.CREATE,
    entityType: "action",
    entityId: newActionId,
    message: `${AuditLog.actorLabel(req)} created action ${newActionId} (${body.action_title})`,
    details: body,
  });
}

function recordProjectEditAudit(req, body) {
  const changedFields = safeParseChangedFields(body.changed_fields);
  const changeSummary = AuditLog.summarizeChangedFields(changedFields);
  const baseMessage = `${AuditLog.actorLabel(req)} updated project ${body.project_id} (${body.title})`;

  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.UPDATE,
    entityType: "project",
    entityId: body.project_id,
    message: changeSummary ? `${baseMessage} — ${changeSummary}` : baseMessage,
    details: changedFields,
  });
}

function recordSemesterEditAudit(req, body) {
  const changedFields = safeParseChangedFields(body.changed_fields);
  const changeSummary = AuditLog.summarizeChangedFields(changedFields);
  const baseMessage = `${AuditLog.actorLabel(req)} updated semester ${body.semester_id} (${body.name})`;

  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.UPDATE,
    entityType: "semester",
    entityId: body.semester_id,
    message: changeSummary ? `${baseMessage} — ${changeSummary}` : baseMessage,
    details: changedFields,
  });
}

function recordSemesterCreateAudit(req, body, newSemesterId) {
  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.CREATE,
    entityType: "semester",
    entityId: newSemesterId,
    message: `${AuditLog.actorLabel(req)} created semester ${newSemesterId} (${body.name})`,
    details: body,
  });
}

function recordArchiveEditAudit(req, body) {
  const changedFields = safeParseChangedFields(body.changed_fields);

  let auditActionType = AuditLog.ACTION_TYPES.UPDATE;
  let auditVerb = "updated";

  const transition = mapActiveStateTransition(
    detectActiveStateTransition(changedFields, "inactive"),
  );
  if (transition) {
    auditActionType = transition.actionType;
    auditVerb = transition.verb;
  }

  const changeSummary = AuditLog.summarizeChangedFields(changedFields);
  const baseMessage = `${AuditLog.actorLabel(req)} ${auditVerb} archive ${body.archive_id} (${body.title})`;

  return AuditLog.record(req, {
    actionType: auditActionType,
    entityType: "archive",
    entityId: body.archive_id,
    message: changeSummary ? `${baseMessage} — ${changeSummary}` : baseMessage,
    details: changedFields,
  });
}

function recordArchiveCreateAudit(req, body, newArchiveId) {
  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.CREATE,
    entityType: "archive",
    entityId: newArchiveId,
    message: `${AuditLog.actorLabel(req)} created archive ${newArchiveId} (${body.title})`,
    details: body,
  });
}

function recordUserEditAudit(req, body) {
  const changedFields = safeParseChangedFields(body.changed_fields);

  let auditActionType = AuditLog.ACTION_TYPES.UPDATE;
  let auditVerb = "updated";

  const transition = mapActiveStateTransition(
    detectActiveStateTransition(changedFields, "active"),
  );
  if (transition) {
    auditActionType = transition.actionType;
    auditVerb = transition.verb;
  }

  const changeSummary = AuditLog.summarizeChangedFields(changedFields);
  const accountLabel = `${capitalize(body.type)} account`;
  const baseMessage = `${AuditLog.actorLabel(req)} ${auditVerb} ${accountLabel} (${body.system_id})`;

  return AuditLog.record(req, {
    actionType: auditActionType,
    entityType: "user",
    entityId: body.system_id,
    message: changeSummary ? `${baseMessage} — ${changeSummary}` : baseMessage,
    details: changedFields,
  });
}

function recordUserCreateAudit(req, body) {
  const accountLabel = `${capitalize(body.type)} account`;
  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.CREATE,
    entityType: "user",
    entityId: body.system_id,
    message: `${AuditLog.actorLabel(req)} created ${accountLabel} (${body.system_id})`,
    details: body,
  });
}

function recordSponsorEditAudit(req, body) {
  const changedFields = safeParseChangedFields(body.changed_fields);

  let auditActionType = AuditLog.ACTION_TYPES.UPDATE;
  let auditVerb = "updated";

  const transition = mapActiveStateTransition(
    detectBooleanActiveStateTransition(changedFields, "inActive"),
  );
  if (transition) {
    auditActionType = transition.actionType;
    auditVerb = transition.verb;
  }

  const changeSummary = AuditLog.summarizeChangedFields(changedFields);
  const baseMessage = `${AuditLog.actorLabel(req)} ${auditVerb} sponsor ${body.sponsor_id} (${body.fname} ${body.lname})`;

  return AuditLog.record(req, {
    actionType: auditActionType,
    entityType: "sponsor",
    entityId: body.sponsor_id,
    message: changeSummary ? `${baseMessage} — ${changeSummary}` : baseMessage,
    details: changedFields,
  });
}

function recordSponsorCreateAudit(req, body, newSponsorId) {
  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.CREATE,
    entityType: "sponsor",
    entityId: newSponsorId,
    message: `${AuditLog.actorLabel(req)} created sponsor ${newSponsorId} (${body.fname} ${body.lname})`,
    details: body,
  });
}

function recordSponsorNoteCreateAudit(req, body, sponsorName) {
  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.CREATE,
    entityType: "sponsor",
    entityId: body.sponsor_id,
    message: `${AuditLog.actorLabel(req)} added a note to sponsor ${body.sponsor_id} (${sponsorName}) — "${body.note_content}"`,
    details: { note_content: body.note_content },
  });
}

function recordTimeLogCreateAudit(req, body, newTimeLogId) {
  const duration = formatDurationFromDecimalHours(body.time_amount);
  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.CREATE,
    entityType: "time_log",
    entityId: newTimeLogId,
    message: `${AuditLog.actorLabel(req)} logged ${duration} on ${body.date}`,
    details: body,
  });
}

function recordTimeLogDeleteAudit(req, timeLogId, deletedRow) {
  let detailSuffix = "";
  if (deletedRow) {
    const duration = formatDurationFromDecimalHours(deletedRow.time_amount);
    const comment = deletedRow.work_comment
      ? ` (comment: "${deletedRow.work_comment}")`
      : "";
    detailSuffix = ` — ${duration} on ${deletedRow.work_date}${comment}`;
  }

  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.DELETE,
    entityType: "time_log",
    entityId: timeLogId,
    message: `${AuditLog.actorLabel(req)} deleted time log ${timeLogId}${detailSuffix}`,
    details: deletedRow || undefined,
  });
}

function recordErrorLogDeleteAudit(req, errorLogId, deletedRow) {
  let detailSuffix = "";
  if (deletedRow && deletedRow.stack_trace) {
    const maxLen = 300;
    const trace =
      deletedRow.stack_trace.length > maxLen
        ? `${deletedRow.stack_trace.slice(0, maxLen)}...`
        : deletedRow.stack_trace;
    detailSuffix = ` — ${trace}`;
  }

  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.DELETE,
    entityType: "error_log",
    entityId: errorLogId,
    message: `${AuditLog.actorLabel(req)} deleted error log ${errorLogId}${detailSuffix}`,
    details: deletedRow || undefined,
  });
}

function recordActionSubmissionCreateAudit(
  req,
  newActionLogId,
  actionId,
  actionTitle,
) {
  return AuditLog.record(req, {
    actionType: AuditLog.ACTION_TYPES.CREATE,
    entityType: "action_submission",
    entityId: newActionLogId,
    message: `${AuditLog.actorLabel(req)} submitted action ${actionId} (${actionTitle})`,
  });
}

module.exports = {
  recordActionEditAudit,
  recordActionCreateAudit,
  recordProjectEditAudit,
  recordSemesterEditAudit,
  recordSemesterCreateAudit,
  recordArchiveEditAudit,
  recordArchiveCreateAudit,
  recordUserEditAudit,
  recordUserCreateAudit,
  recordSponsorEditAudit,
  recordSponsorCreateAudit,
  recordSponsorNoteCreateAudit,
  recordTimeLogCreateAudit,
  recordTimeLogDeleteAudit,
  recordErrorLogDeleteAudit,
  recordActionSubmissionCreateAudit,
};
