import "../../../../css/components/tabs/sincelastvisit.css";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button, Icon, Loader, Message, Segment } from "semantic-ui-react";

import { UserContext } from "../../../util/functions/UserContext";
import { SecureFetch } from "../../../util/functions/secureFetch";
import { config } from "../../../util/functions/constants";
import { formatDateTime } from "../../../util/functions/utils";
import ToolTip from "../TimelinesView/Timeline/ToolTip";

const MAX_VISIBLE_ACTIVITY = 5;

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

export default function SinceLastVisit() {
  const { user } = useContext(UserContext);

  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [dismissedAt, setDismissedAt] = useState(null);

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
       * Prototype fallback.
       *
       * This approach requires multiple requests and should be replaced by
       * a more efficient endpoint in a production implementation.
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
            text: `${actor} submitted "${action.action_title}"`,
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

      const overdueActivity = actions
        .map((action) => {
          const dueDate = parseDate(action.due_date);

          if (!dueDate) {
            return null;
          }

          if (dueDate >= now) {
            return null;
          }

          if (action.state !== "red") {
            return null;
          }

          return {
            id: `overdue-${action.action_id}-${action.due_date}`,
            type: "action_overdue",
            timestamp: action.due_date,
            text: `"${action.action_title}" became overdue`,
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

            timeLogActivity = (timeLogs || [])
              .filter(
                (log) => log.submission_datetime && String(log.active) !== "0",
              )
              .map((log) => {
                const actor = getActorName(log);

                const hours = Number(log.time_amount);
                const hourText = hours === 1 ? "1 hour" : `${hours} hours`;

                return {
                  id: `time-log-${log.time_log_id}`,
                  type: "time_log",
                  timestamp: log.submission_datetime,
                  text: `${actor} logged ${hourText}`,
                  icon: "clock outline",
                  action: null,
                  projectId: log.project || projectId,
                };
              });
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

      const combinedActivity = [
        ...submissionActivity,
        ...overdueActivity,
        ...timeLogActivity,
      ].sort((a, b) => {
        const aDate = parseDate(a.timestamp);
        const bDate = parseDate(b.timestamp);

        if (!aDate || !bDate) {
          return 0;
        }

        return bDate - aDate;
      });

      setActivity(combinedActivity);
    } catch (err) {
      console.error("Failed to load recent dashboard activity:", err);

      setError("Recent project activity could not be loaded.");
      setActivity([]);
    } finally {
      setLoading(false);
    }
  }, [loadActionLogs, projectId]);

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

  /**
   * Filters activity to events that occurred after the current cutoff.
   */
  const visibleActivity = useMemo(() => {
    if (!cutoff) {
      return [];
    }

    return activity.filter((item) => {
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

    const newestActivityDate = parseDate(visibleActivity[0].timestamp);

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
      >
        <Icon name={item.icon} />

        <span>{item.text}</span>

        <span
          style={{
            float: "right",
            fontWeight: "normal",
            opacity: 0.7,
          }}
        >
          {formatDateTime(item.timestamp)}
        </span>
      </Button>
    );

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

  return (
    <Segment className="since-last-visit">
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
            Since Your Last Visit...
          </h2>

          {cutoff && (
            <div className="since-last-visit-cutoff">
              Showing project activity since {formatDateTime(cutoff)}
            </div>
          )}
        </div>

        <div>
          {visibleActivity.length > 0 && (
            <Button basic size="small" onClick={dismissActivity}>
              <Icon name="check" />
              Dismiss All
            </Button>
          )}
        </div>
      </div>

      {loading && <Loader active inline="centered" />}

      {!loading && error && <Message negative>{error}</Message>}

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
    </Segment>
  );
}
