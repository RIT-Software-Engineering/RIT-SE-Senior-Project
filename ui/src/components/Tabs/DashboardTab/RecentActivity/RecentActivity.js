import "../../../../css/components/tabs/recentactivity.css";
import WeeklyHoursViewer from "../../TimeTrackingTab/WeeklyHourViewer";
import TimeLogPanel from "../../TimeTrackingTab/TimeLogPanel";
import uiConfig from "../../../../config/uiConfig";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Icon,
  Loader,
  Message,
  Popup,
  Segment,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";

import ProfileCircle from "../../../util/components/ProfileCircle";
import { UserContext } from "../../../util/functions/UserContext";
import { SecureFetch } from "../../../util/functions/secureFetch";
import { config, USERTYPES } from "../../../util/functions/constants";
import {
  formatDateTime,
  formatDate,
  isSemesterActive,
} from "../../../util/functions/utils";
import ToolTip from "../TimelinesView/Timeline/ToolTip";

const recentActivityConfig = uiConfig.recentActivity;

const MAX_VISIBLE_ACTIVITY = uiConfig.recentActivity.activityFeed.maxVisible;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

function parseActivityTimestamp(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().replace(" ", "T");
    const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
    const hasTime = /T\d{2}:\d{2}/.test(normalized);

    const date = new Date(
      hasTime && !hasTimezone ? `${normalized}Z` : normalized,
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return parseDate(value);
}

/**
 * Returns the most recent activity cutoff timestamp.
 *
 * The cutoff is based on either the previous login or the most recent
 * dismissal timestamp.
 */
function getActivityCutoff(user, dismissedAt) {
  const loginDate =
    parseActivityTimestamp(user?.prev_login) ||
    parseActivityTimestamp(user?.last_login);

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

function getSubmissionNote(value) {
  if (!value) return "";

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    if (typeof parsed === "string") return parsed.trim();
    return typeof parsed?.note === "string" ? parsed.note.trim() : "";
  } catch {
    return String(value).trim();
  }
}

function getProjectName(log) {
  return log?.display_name || log?.title || "Current Project";
}

export default function RecentActivity(props) {
  const { user, setUser } = useContext(UserContext);
  const setUserRef = useRef(setUser);
  setUserRef.current = setUser;
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);

  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [dismissedAt, setDismissedAt] = useState(null);
  const [timeReport, setTimeReport] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  const projectId = props.projectId || user?.project;

  const [hoverRow, setHoverRow] = useState(null);
  const [contactInfo, setContactInfo] = useState({});
  const requestedContacts = useRef(new Set());
  const [actionModalVisible, setActionModalVisible] = useState(false);

  useEffect(() => {
    if (!user?.user) {
      setPreferenceLoaded(false);
      return;
    }

    const systemId = user.user;
    let cancelled = false;

    setPreferenceLoaded(false);

    SecureFetch(
      `${config.url.API_GET_RECENT_ACTIVITY_VIEW}?system_id=${encodeURIComponent(systemId)}`,
    )
      .then((res) => {
        if (!res.ok)
          throw new Error("Failed to load recent activity preference");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        const enabled = data.recent_activity_view !== false;

        setUserRef.current((currentUser) => {
          if (currentUser.user !== systemId) return currentUser;

          let profileInfo = currentUser.profile_info || {};

          if (typeof profileInfo === "string") {
            try {
              profileInfo = JSON.parse(profileInfo);
            } catch {
              profileInfo = {};
            }
          }

          // Don't update UserContext if the preference is already correct.
          if (profileInfo.recent_activity_view === enabled) {
            return currentUser;
          }

          return {
            ...currentUser,
            profile_info: {
              ...profileInfo,
              recent_activity_view: enabled,
            },
          };
        });

        setPreferenceLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load recent activity preference:", err);
        if (!cancelled) setPreferenceLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.user]);

  /**
   * Fetches contact info for mouse-hover.
   */
  const loadContactInfo = (systemId) => {
    if (!systemId || requestedContacts.current.has(systemId)) return;

    requestedContacts.current.add(systemId);

    SecureFetch(
      `${config.url.API_GET_ADDITIONAL_INFO}?system_id=${encodeURIComponent(systemId)}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load contact info");
        return res.json();
      })
      .then((data) => {
        setContactInfo((prev) => ({
          ...prev,
          [systemId]: data,
        }));
      })
      .catch((err) => {
        console.error("Failed to load contact info:", err);
      });
  };

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
   * Loads the user's projects to determine which belong
   * to the currently active semester.
   */
  useEffect(() => {
    if (!user?.user) return;

    let cancelled = false;

    setProjectsLoaded(false);

    SecureFetch(config.url.API_GET_MY_PROJECTS)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load projects");
        }
        return response.json();
      })
      .then((projects) => {
        if (!cancelled) {
          setMyProjects(projects);
        }
      })
      .catch((error) => {
        console.error("Failed to get projects:", error);
        if (!cancelled) {
          setMyProjects([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setProjectsLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user?.user, user?.role]);

  /**
   * Determines whether the selected project belongs
   * to the currently active semester.
   */
  const currentProject = myProjects.find(
    (project) => String(project.project_id) === String(projectId),
  );

  const currentSemester = props.semesterData?.find(
    (semester) =>
      String(semester.semester_id) === String(currentProject?.semester),
  );

  const isCurrentProjectSemester = Boolean(
    currentSemester?.start_date &&
      currentSemester?.end_date &&
      isSemesterActive(currentSemester.start_date, currentSemester.end_date),
  );

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

      const submissionActivity = recentActivityConfig.activityFeed
        .showActionSubmissions
        ? actionLogs
            .filter((log) => !isOwnActivity(log, user))
            .map((log) => {
              const action = actionsById.get(String(log.action_template));

              if (!action || !log.submission_datetime) {
                return null;
              }

              return {
                id: `submission-${log.action_log_id}`,
                type: "action_submission",
                timestamp: log.submission_datetime,
                actorType: log.user_type,
                icon: "check circle outline",
                action,
                projectId: log.project || projectId,
                projectName: getProjectName(log),
                semesterName: action.semester,
                mockedById: log.mock_id || null,
                mockedByName: log.mock_name || log.mock_id,
                submissionNote: getSubmissionNote(log.notes),
                tooltipUserId: log.system_id,
                tooltipUserName: log.name || log.system_id,
              };
            })
            .filter(Boolean)
        : [];

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

      const overdueActivity = recentActivityConfig.activityFeed
        .showOverdueActions
        ? actions
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

              return {
                id: `overdue-${action.action_id}-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
                type: "action_overdue",
                timestamp: today,
                daysOverdue,
                icon: "warning sign",
                action,
                projectId,
                projectName: "Current Project",
                semesterName: action.semester,
              };
            })
            .filter(Boolean)
        : [];

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

            const avgTimeResponse = await SecureFetch(
              `${config.url.API_GET_TIME_AVG}?project_id=${encodeURIComponent(projectId)}`,
            );

            const avgTimes = avgTimeResponse.ok
              ? await avgTimeResponse.json()
              : [];

            const avgTimeByStudent = new Map(
              avgTimes.map((student) => [
                String(student.system_id),
                Number(student.avgTime) || 0,
              ]),
            );

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
                (log) =>
                  log.submission_datetime &&
                  String(log.active) !== "0" &&
                  (recentActivityConfig.timeLogSummary.includeCurrentUser ||
                    !isOwnActivity(log, user)),
              )
              .forEach((log) => {
                const studentId = String(log.system_id);

                if (!groupedLogs.has(studentId)) {
                  groupedLogs.set(studentId, {
                    systemId: log.system_id,
                    thisWeek: 0,
                    lastWeek: 0,
                    latestSubmission: null,
                    profileName: log.name || log.system_id || "Unknown User",
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

            const studentSummaries = Array.from(groupedLogs.values())
              .filter((student) => student.latestSubmission)
              .sort((a, b) => {
                const aIsCurrentUser =
                  String(a.systemId) === String(user?.user);
                const bIsCurrentUser =
                  String(b.systemId) === String(user?.user);

                if (aIsCurrentUser !== bIsCurrentUser) {
                  return aIsCurrentUser ? -1 : 1;
                }

                const aName = a.profileName || a.actorName || "";
                const bName = b.profileName || b.actorName || "";

                const aLastName = aName.trim().split(/\s+/).pop();
                const bLastName = bName.trim().split(/\s+/).pop();

                return (
                  aLastName.localeCompare(bLastName) ||
                  aName.localeCompare(bName)
                );
              })
              .map((student) => ({
                ...student,
                weeklyAverage:
                  avgTimeByStudent.get(String(student.systemId)) ?? 0,
              }));

            timeLogActivity =
              studentSummaries.length > 0
                ? [
                    {
                      id: "time-log-summary",
                      type: "time_log_summary",
                      summaries: studentSummaries,
                    },
                  ]
                : [];
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
        const aDate = parseActivityTimestamp(a.timestamp);
        const bDate = parseActivityTimestamp(b.timestamp);

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
    if (
      !preferenceLoaded ||
      !recentActivityConfig.enabled ||
      user?.profile_info?.recent_activity_view === false ||
      !projectsLoaded ||
      !isCurrentProjectSemester
    ) {
      return;
    }

    loadActivity();
  }, [
    loadActivity,
    preferenceLoaded,
    user?.profile_info?.recent_activity_view,
    projectsLoaded,
    isCurrentProjectSemester,
  ]);

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

      const activityDate = parseActivityTimestamp(item.timestamp);

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
      .map((item) => parseActivityTimestamp(item.timestamp))
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
   */
  const renderActivity = (item) => {
    if (item.type === "time_log_summary" && timeReport) {
      const timeLogTrigger = (
        <div className="recent-activity-time-table-trigger">
          <Table celled unstackable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>This Week</TableHeaderCell>
                <TableHeaderCell>Last Week</TableHeaderCell>
                <TableHeaderCell>Weekly Average</TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {item.summaries.map((student) => (
                <TableRow key={student.systemId}>
                  <TableCell>
                    <div className="recent-activity-time-student">
                      <ProfileCircle
                        user={{
                          system_id: student.systemId,
                        }}
                        name={student.profileName}
                        size="tiny"
                        isStudent={true}
                        showFullName
                        allowInfo
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    {student.thisWeek}{" "}
                    {student.thisWeek === 1 ? "hour" : "hours"}
                  </TableCell>

                  <TableCell>
                    {student.lastWeek}{" "}
                    {student.lastWeek === 1 ? "hour" : "hours"}
                  </TableCell>

                  <TableCell>
                    {student.weeklyAverage}{" "}
                    {student.weeklyAverage === 1 ? "hour" : "hours"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
      return (
        <WeeklyHoursViewer
          key={item.id}
          trigger={timeLogTrigger}
          projectName={timeReport.projectName}
          semesterName={timeReport.semesterName}
          weeks={timeReport.weeks}
          timeLog={timeReport.timeLogs}
          students={timeReport.students}
        />
      );
    }

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

          <div className="recent-activity-actor-line">
            {item.type === "action_submission" && (
              <>
                {item.mockedById && (
                  <div style={{ pointerEvents: "none" }}>
                    <ProfileCircle
                      user={{ system_id: item.mockedById }}
                      name={item.mockedByName}
                      size="tiny"
                      isStudent={false}
                      showFullName
                      allowInfo={false}
                    />
                  </div>
                )}

                <div
                  className={item.mockedById ? "recent-activity-mock-as" : ""}
                >
                  {item.mockedById && <span>(as</span>}

                  <div style={{ pointerEvents: "none" }}>
                    <ProfileCircle
                      user={{ system_id: item.tooltipUserId }}
                      name={item.tooltipUserName}
                      size="tiny"
                      isStudent={item.actorType === USERTYPES.STUDENT}
                      showFullName
                      allowInfo={false}
                    />
                  </div>

                  {item.mockedById && (
                    <span className="recent-activity-close-paren">)</span>
                  )}
                </div>
              </>
            )}

            <span className="recent-activity-action-text">
              {item.type === "action_submission" ? (
                <>
                  submitted <strong>{item.action?.action_title}</strong>
                </>
              ) : (
                <>
                  <strong>{item.action?.action_title}</strong>{" "}
                  {item.daysOverdue === 1
                    ? "is 1 day overdue"
                    : `is ${item.daysOverdue} days overdue`}
                </>
              )}
            </span>
          </div>

          {item.type === "action_submission" && item.submissionNote && (
            <Icon name="sticky note outline" aria-label="Has submission note" />
          )}

          <span className="recent-activity-date">
            {formatDateTime(item.timestamp)}
          </span>
        </div>
      </Button>
    );

    const actionTooltip = (
      <ToolTip
        key={item.id}
        trigger={trigger}
        action={item.action}
        projectId={item.projectId}
        projectName={item.projectName}
        semesterName={item.semesterName}
        reloadTimelineActions={loadActivity}
        onActionModalOpen={() => {
          setActionModalVisible(true);
          setHoverRow(null);
        }}
        onActionModalClose={() => {
          setActionModalVisible(false);
          setHoverRow(null);
        }}
      />
    );

    if (item.type !== "action_submission") {
      return actionTooltip;
    }

    return (
      <div
        key={item.id}
        onMouseEnter={(e) => {
          if (actionModalVisible) return;

          setHoverRow({
            item,
            x: e.clientX,
            y: e.clientY,
          });

          loadContactInfo(item.tooltipUserId);
        }}
        onMouseMove={(e) => {
          if (actionModalVisible) return;

          const x = e.clientX;
          const y = e.clientY;

          setHoverRow((prev) => {
            if (prev?.item.id !== item.id) {
              return { item, x, y };
            }

            if (Math.abs(prev.x - x) < 4 && Math.abs(prev.y - y) < 4) {
              return prev;
            }

            return { ...prev, x, y };
          });
        }}
        onMouseLeave={() => setHoverRow(null)}
      >
        {actionTooltip}
      </div>
    );
  };

  const activityContent = (
    <div className="since-last-visit">
      {loading && <Loader active inline="centered" />}

      {!loading && error && <Message negative>{error}</Message>}

      {recentActivityConfig.timeLogSummary.enabled &&
        !loading &&
        !error &&
        timeLogActivity.length > 0 && (
          <>
            <div className="recent-activity-section-header">
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h2
                    className="since-last-visit-header"
                    style={{ marginBottom: 0 }}
                  >
                    {recentActivityConfig.timeLogSummary.title}
                  </h2>

                  {recentActivityConfig.timeLogSummary.showLogTimeButton && (
                    <TimeLogPanel
                      callback={loadActivity}
                      header="Log Time"
                      content="Log Project Time"
                      viewOnly={user.view_only || user.mockUser?.view_only}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="recent-activity-time-logs">
              {timeLogActivity.map((item) => renderActivity(item))}
            </div>

            <div className="recent-activity-divider" />
          </>
        )}

      {recentActivityConfig.activityFeed.enabled && !loading && !error && (
        <>
          <div
            className="recent-activity-section-header"
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
                {recentActivityConfig.activityFeed.title}
              </h2>

              {cutoff && (
                <div className="since-last-visit-cutoff">
                  Showing activity since {formatDateTime(cutoff)}
                </div>
              )}
            </div>

            <div>
              {recentActivityConfig.activityFeed.allowDismiss &&
                visibleActivity.length > 0 && (
                  <Button fluid size="small" onClick={dismissActivity}>
                    <Icon name="check" />
                    Dismiss All
                  </Button>
                )}
            </div>
          </div>

          {visibleActivity.length === 0 && (
            <Message>No new project activity since the last visit.</Message>
          )}

          {displayedActivity.map((item) => renderActivity(item))}

          {visibleActivity.length > MAX_VISIBLE_ACTIVITY && (
            <Button
              basic
              fluid
              size="small"
              onClick={(e) => {
                setShowAll((current) => !current);

                // Remove persistent focus after a mouse click.
                if (e.detail > 0) {
                  e.currentTarget.blur();
                }
              }}
            >
              {showAll
                ? "Show Less"
                : `View All ${visibleActivity.length} Changes`}
            </Button>
          )}
        </>
      )}

      {!actionModalVisible && hoverRow?.item?.type === "action_submission" && (
        <Popup
          open
          className="universal-tooltip"
          position="bottom left"
          offset={[0, 8]}
          style={{ pointerEvents: "none" }}
          trigger={
            <span
              style={{
                position: "fixed",
                left: hoverRow.x,
                top: hoverRow.y,
                width: 0,
                height: 0,
                pointerEvents: "none",
              }}
            />
          }
          content={
            <div>
              {hoverRow.item.tooltipUserName}

              {contactInfo[hoverRow.item.tooltipUserId]?.contact?.value && (
                <div>
                  {contactInfo[hoverRow.item.tooltipUserId].contact.label}:{" "}
                  {contactInfo[hoverRow.item.tooltipUserId].contact.value}
                </div>
              )}

              {contactInfo[hoverRow.item.tooltipUserId]?.additional_info && (
                <div className="profile-hover">
                  Additional Info:{" "}
                  {contactInfo[hoverRow.item.tooltipUserId].additional_info}
                </div>
              )}

              {hoverRow.item.submissionNote && (
                <>
                  <div
                    style={{
                      borderTop: "1px solid var(--border-color)",
                      margin: "6px -16px",
                    }}
                  />
                  <div>Note: {hoverRow.item.submissionNote}</div>
                </>
              )}
            </div>
          }
        />
      )}
    </div>
  );
  if (
    !recentActivityConfig.enabled ||
    !preferenceLoaded ||
    user?.profile_info?.recent_activity_view === false ||
    !projectsLoaded ||
    !isCurrentProjectSemester
  ) {
    return null;
  }
  if (user?.role === USERTYPES.STUDENT) {
    return activityContent;
  }
  return <Segment>{activityContent}</Segment>;
}
