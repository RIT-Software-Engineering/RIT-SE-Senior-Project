import "../../../../css/components/tabs/recentactivity.css";
import WeeklyHoursViewer from "../../TimeTrackingTab/WeeklyHourViewer";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button, Icon, Loader, Message, Segment } from "semantic-ui-react";

import ProfileCircle from "../../../util/components/ProfileCircle";
import { UserContext } from "../../../util/functions/UserContext";
import { SecureFetch } from "../../../util/functions/secureFetch";
import { config, USERTYPES } from "../../../util/functions/constants";
import { formatDateTime, formatDate } from "../../../util/functions/utils";
import ToolTip from "../TimelinesView/Timeline/ToolTip";

const MAX_VISIBLE_ACTIVITY = 3;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDateOnly(value) {
  if (!value) {
    return null;
  }

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;

  return new Date(Number(year), Number(month) - 1, Number(day));
}

function getCalendarDayNumber(date) {
  return (
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY
  );
}

function getStartOfWeek(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

function getEndOfWeek(startOfWeek) {
  const result = new Date(startOfWeek);
  result.setDate(result.getDate() + 7);
  return result;
}

/**
 * Converts supported date values into a Date object.
 */
function parseDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  const normalized =
    typeof value === "string" ? value.replace(" ", "T") : value;

  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Returns the most recent activity cutoff timestamp.
 *
 * The cutoff is based on either the previous login or the most recent
 * dismissal timestamp.
 */
function getActivityCutoff(user, dismissedAt) {
  const loginDate = parseDate(user?.prev_login) || parseDate(user?.last_login);

  const dismissedDate = parseDate(dismissedAt);

  if (!loginDate) {
    return dismissedDate;
  }

  if (!dismissedDate) {
    return loginDate;
  }

  return dismissedDate > loginDate ? dismissedDate : loginDate;
}

function isOwnActivity(log, user) {
  const currentUserIds = [user?.user, user?.mockUser?.system_id]
    .filter(Boolean)
    .map(String);

  return (
    currentUserIds.includes(String(log.system_id)) ||
    (log.mock_id && currentUserIds.includes(String(log.mock_id)))
  );
}

function getActorName(log) {
  if (log.mock_name) {
    const actualUser = log.name || log.system_id || "Unknown User";
    return `${log.mock_name} (as ${actualUser})`;
  }

  return log.name || log.system_id || "Unknown User";
}

function getProjectName(log) {
  return log?.display_name || log?.title || "Current Project";
}

export default function SinceLastVisit(props) {
  const { user } = useContext(UserContext);

  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [dismissedAt, setDismissedAt] = useState(null);
  const [timeReport, setTimeReport] = useState(null);

  const projectId = user?.project;

  /**
   * Stores dismissal state separately for each user and project.
   *
   * NEEDS TO BE ADDED TO DB*****************
   */
  const dismissalStorageKey = useMemo(() => {
    if (!user?.user) return null;

    return `sinceLastVisitDismissedAt:${user.user}:${projectId || "none"}`;
  }, [user?.user, projectId]);

  /**
   * Loads the most recent dismissal timestamp when the user or project changes.
   */
  useEffect(() => {
    if (!dismissalStorageKey) {
      setDismissedAt(null);
      return;
    }

    setDismissedAt(localStorage.getItem(dismissalStorageKey));
  }, [dismissalStorageKey]);

  /**
   * Loads action submission logs.
   *
   * API_GET_ALL_ACTION_LOGS is preferred because it requires a single
   * request. The per-action endpoint is used as a fallback.
   */
  const loadActionLogs = useCallback(
    async (actions) => {
      if (config.url.API_GET_ALL_ACTION_LOGS) {
        const response = await SecureFetch(
          `${config.url.API_GET_ALL_ACTION_LOGS}?resultLimit=200&offset=0`,
        );

        if (!response.ok) {
          throw new Error("Failed to get action logs");
        }

        const data = await response.json();

        return (data.actionLogs || []).filter(
          (log) => String(log.project) === String(projectId),
        );
      }

      /**
       * Finds logs by Action
       */
      const logsByAction = await Promise.all(
        actions.map(async (action) => {
          try {
            const response = await SecureFetch(
              `${config.url.API_GET_ACTION_LOGS}` +
                `?project_id=${encodeURIComponent(projectId)}` +
                `&action_id=${encodeURIComponent(action.action_id)}`,
            );

            if (!response.ok) {
              return [];
            }

            return await response.json();
          } catch (err) {
            console.error(
              `Failed to load logs for action ${action.action_id}:`,
              err,
            );

            return [];
          }
        }),
      );

      return logsByAction.flat();
    },
    [projectId],
  );

  /**
   * Loads supported project activity and converts all event types into
   * a shared activity format.
   */
  const loadActivity = useCallback(async () => {
    if (!projectId) {
      setActivity([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * ---------------------------------------------------------------
       * ACTIONS
       * ---------------------------------------------------------------
       */

      const actionsResponse = await SecureFetch(
        `${config.url.API_GET_TIMELINE_ACTIONS}` +
          `?project_id=${encodeURIComponent(projectId)}`,
      );

      if (!actionsResponse.ok) {
        throw new Error("Failed to get project actions");
      }

      const actionsData = await actionsResponse.json();

      const actions = (actionsData || []).filter(
        (action) => action.action_target !== "break_period",
      );

      const actionsById = new Map(
        actions.map((action) => [String(action.action_id), action]),
      );

      /*
       * ---------------------------------------------------------------
       * ACTION SUBMISSIONS
       * ---------------------------------------------------------------
       */

      const actionLogs = await loadActionLogs(actions);

      const submissionActivity = actionLogs
        .filter((log) => !isOwnActivity(log, user))
        .map((log) => {
          const action = actionsById.get(String(log.action_template));

          if (!action || !log.submission_datetime) {
            return null;
          }

          const actor = getActorName(log);

          return {
            id: `submission-${log.action_log_id}`,
            type: "action_submission",
            timestamp: log.submission_datetime,
            text: `submitted "${action.action_title}"`,
            actorName: getActorName(log),
            actorType: log.user_type,
            icon: "check circle outline",
            action,
            projectId: log.project || projectId,
            projectName: getProjectName(log),
            semesterName: action.semester,
          };
        })
        .filter(Boolean);

      /*
       * --------------------------------------------------------------
       * OVERDUE ACTIONS
       * --------------------------------------------------------------
       *
       * The due date is used as the timestamp for the point when an
       * unfinished action became overdue. The current action state is
       * checked so completed actions are not displayed as overdue.
       */

      const now = new Date();

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const overdueActivity = actions
        .map((action) => {
          const dueDate = parseDate(action.due_date);

          if (!dueDate) {
            return null;
          }

          if (action.state !== "red") {
            return null;
          }

          const daysOverdue =
            getCalendarDayNumber(today) - getCalendarDayNumber(dueDate);

          if (daysOverdue < 1) {
            return null;
          }

          const dayText =
            daysOverdue === 1
              ? "is 1 day overdue"
              : `is ${daysOverdue} days overdue`;

          return {
            id: `overdue-${action.action_id}-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
            type: "action_overdue",
            timestamp: today,
            daysOverdue,
            text: `"${action.action_title}" ${dayText}`,
            icon: "warning sign",
            action,
            projectId,
            projectName: "Current Project",
            semesterName: action.semester,
          };
        })
        .filter(Boolean);

      /*
       * ---------------------------------------------------------------
       * TIME LOGS
       * ---------------------------------------------------------------
       */

      let timeLogActivity = [];

      if (config.url.API_GET_TIME_LOGS) {
        try {
          const timeLogsResponse = await SecureFetch(
            `${config.url.API_GET_TIME_LOGS}` +
              `?project_id=${encodeURIComponent(projectId)}`,
          );

          if (timeLogsResponse.ok) {
            const timeLogs = await timeLogsResponse.json();

            const projectsResponse = await SecureFetch(
              config.url.API_GET_MY_PROJECTS,
            );

            const projects = projectsResponse.ok
              ? await projectsResponse.json()
              : [];

            const currentProject = projects.find(
              (project) => String(project.project_id) === String(projectId),
            );

            const semester = props.semesterData?.find(
              (sem) =>
                String(sem.semester_id) === String(currentProject?.semester),
            );

            const reportStudents = Array.from(
              new Map(
                (timeLogs || [])
                  .filter((log) => log.name)
                  .map((log) => [
                    String(log.system_id),
                    {
                      name: log.name,
                      system_id: log.system_id,
                      project: log.project,
                    },
                  ]),
              ).values(),
            );

            const { eachWeekOfInterval } = require("date-fns");

            const reportWeeks =
              semester?.start_date && semester?.end_date
                ? eachWeekOfInterval({
                    start: new Date(semester.start_date),
                    end: new Date(semester.end_date),
                  })
                : [];

            setTimeReport({
              projectName:
                currentProject?.display_name ||
                currentProject?.title ||
                "Current Project",
              semesterName: semester?.name || "",
              weeks: reportWeeks,
              timeLogs,
              students: reportStudents,
            });
            const now = new Date();

            const thisWeekStart = getStartOfWeek(now);
            const nextWeekStart = getEndOfWeek(thisWeekStart);

            const lastWeekStart = new Date(thisWeekStart);
            lastWeekStart.setDate(lastWeekStart.getDate() - 7);

            const groupedLogs = new Map();
            (timeLogs || [])
              .filter(
                (log) => log.submission_datetime && String(log.active) !== "0",
              )
              .forEach((log) => {
                const studentId = String(log.system_id);

                if (!groupedLogs.has(studentId)) {
                  groupedLogs.set(studentId, {
                    actorName: getActorName(log),
                    systemId: log.system_id,
                    projectId: log.project || projectId,
                    thisWeek: 0,
                    lastWeek: 0,
                    latestSubmission: null,
                  });
                }

                const student = groupedLogs.get(studentId);
                const workDate = parseDate(log.work_date);
                const submissionDate = parseDate(log.submission_datetime);
                const hours = Number(log.time_amount) || 0;

                if (workDate) {
                  if (workDate >= thisWeekStart && workDate < nextWeekStart) {
                    student.thisWeek += hours;
                  } else if (
                    workDate >= lastWeekStart &&
                    workDate < thisWeekStart
                  ) {
                    student.lastWeek += hours;
                  }
                }

                if (
                  submissionDate &&
                  (!student.latestSubmission ||
                    submissionDate > student.latestSubmission)
                ) {
                  student.latestSubmission = submissionDate;
                }
              });

            timeLogActivity = Array.from(groupedLogs.values())
              .filter((student) => student.latestSubmission)
              .map((student) => ({
                id: `time-log-summary-${student.systemId}`,
                type: "time_log_summary",
                timestamp: student.latestSubmission,
                actorName: student.actorName,
                icon: "clock outline",
                action: null,
                projectId: student.projectId,
                thisWeek: student.thisWeek,
                lastWeek: student.lastWeek,
                text: `logged ${student.thisWeek} ${
                  student.thisWeek === 1 ? "hour" : "hours"
                } this week and ${student.lastWeek} ${
                  student.lastWeek === 1 ? "hour" : "hours"
                } last week`,
              }));
          }
        } catch (err) {
          console.error("Failed to load time logs:", err);
        }
      }

      /*
       * ---------------------------------------------------------------
       * COMBINED ACTIVITY
       * ---------------------------------------------------------------
       */

      const dismissableActivity = [
        ...overdueActivity,
        ...submissionActivity,
      ].sort((a, b) => {
        const aDate = parseDate(a.timestamp);
        const bDate = parseDate(b.timestamp);

        if (!aDate || !bDate) {
          return 0;
        }

        const timeDifference = bDate - aDate;

        if (timeDifference !== 0) {
          return timeDifference;
        }

        // If overdue reminders share the same timestamp,
        // show the most overdue action first.
        if (a.type === "action_overdue" && b.type === "action_overdue") {
          return (b.daysOverdue || 0) - (a.daysOverdue || 0);
        }

        return 0;
      });

      setActivity([...timeLogActivity, ...dismissableActivity]);
    } catch (err) {
      console.error("Failed to load recent dashboard activity:", err);

      setError("Recent project activity could not be loaded.");
      setActivity([]);
    } finally {
      setLoading(false);
    }
  }, [loadActionLogs, projectId, props.semesterData]);

  /**
   * Loads activity after the project becomes available.
   */
  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  /**
   * Determines the timestamp after which activity should be displayed.
   */
  const cutoff = useMemo(
    () => getActivityCutoff(user, dismissedAt),
    [user, dismissedAt],
  );

  const timeLogActivity = useMemo(
    () => activity.filter((item) => item.type === "time_log_summary"),
    [activity],
  );

  const visibleActivity = useMemo(() => {
    if (!cutoff) {
      return [];
    }

    return activity.filter((item) => {
      if (item.type === "time_log_summary") {
        return false;
      }

      const activityDate = parseDate(item.timestamp);

      return activityDate && activityDate > cutoff;
    });
  }, [activity, cutoff]);

  const displayedActivity = showAll
    ? visibleActivity
    : visibleActivity.slice(0, MAX_VISIBLE_ACTIVITY);

  /**
   * Dismisses all activity currently loaded in the section.
   *
   * The most recent activity timestamp is stored rather than the current
   * time so activity created after the last fetch is not unintentionally
   * dismissed.
   */
  const dismissActivity = () => {
    if (!dismissalStorageKey || visibleActivity.length === 0) {
      return;
    }

    const newestActivityDate = visibleActivity
      .map((item) => parseDate(item.timestamp))
      .filter(Boolean)
      .reduce(
        (latest, date) => (!latest || date > latest ? date : latest),
        null,
      );

    if (!newestActivityDate) {
      return;
    }

    const newDismissedAt = newestActivityDate.toISOString();

    localStorage.setItem(dismissalStorageKey, newDismissedAt);
    setDismissedAt(newDismissedAt);
    setShowAll(false);
  };

  /**
   * Renders a single activity item.
   *
   * Action-related events reuse ToolTip so the existing action popup
   * and ActionModal behavior remain available.
   */
  const renderActivity = (item) => {
    const trigger = (
      <Button
        basic
        fluid
        type="button"
        style={{
          marginBottom: "0.5rem",
          textAlign: "left",
        }}
        className="recent-activity-item"
      >
        <div className="recent-activity-content">
          <Icon name={item.icon} />

          {item.actorName ? (
            <ProfileCircle name={item.actorName} size="tiny" />
          ) : (
            <span />
          )}

          <span>
            {item.actorName && `${item.actorName} `}
            {item.text}
          </span>

          <span className="recent-activity-date">
            {item.type === "action_overdue"
              ? formatDate(item.timestamp)
              : formatDateTime(item.timestamp)}
          </span>
        </div>
      </Button>
    );

    if (item.type === "time_log_summary" && timeReport) {
      return (
        <WeeklyHoursViewer
          key={item.id}
          trigger={trigger}
          projectName={timeReport.projectName}
          semesterName={timeReport.semesterName}
          weeks={timeReport.weeks}
          timeLog={timeReport.timeLogs}
          students={timeReport.students}
        />
      );
    }

    if (!item.action) {
      return <div key={item.id}>{trigger}</div>;
    }

    return (
      <ToolTip
        key={item.id}
        trigger={trigger}
        action={item.action}
        projectId={item.projectId}
        projectName={item.projectName}
        semesterName={item.semesterName}
        reloadTimelineActions={loadActivity}
      />
    );
  };

  const activityContent = (
    <div className="since-last-visit">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h2
            className="since-last-visit-header"
            style={{ marginBottom: "0.25rem" }}
          >
            Recent Activity
          </h2>

          {cutoff && (
            <div className="since-last-visit-cutoff">
              Showing activity since {formatDateTime(cutoff)}
            </div>
          )}
        </div>

        <div>
          {visibleActivity.length > 0 && (
            <Button fluid size="small" onClick={dismissActivity}>
              <Icon name="check" />
              Dismiss All
            </Button>
          )}
        </div>
      </div>

      {loading && <Loader active inline="centered" />}

      {!loading && error && <Message negative>{error}</Message>}

      {!loading && !error && timeLogActivity.length > 0 && (
        <div className="recent-activity-time-logs">
          {timeLogActivity.map((item) => renderActivity(item))}
        </div>
      )}

      {!loading && !error && timeLogActivity.length > 0 && (
        <div className="recent-activity-divider" />
      )}

      {!loading && !error && visibleActivity.length === 0 && (
        <Message>No new project activity since the last visit.</Message>
      )}

      {!loading &&
        !error &&
        displayedActivity.map((item) => renderActivity(item))}

      {!loading && !error && visibleActivity.length > MAX_VISIBLE_ACTIVITY && (
        <Button
          basic
          fluid
          size="small"
          onClick={() => setShowAll((current) => !current)}
        >
          {showAll ? "Show Less" : `View All ${visibleActivity.length} Changes`}
        </Button>
      )}
    </div>
  );

  if (user?.role === USERTYPES.STUDENT) {
    return activityContent;
  }
  return <Segment>{activityContent}</Segment>;
}
