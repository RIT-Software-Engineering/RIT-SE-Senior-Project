import React, { useState, useEffect, useContext } from "react";
import { Button } from "semantic-ui-react";
import {
  formatDateTime,
  formatDate,
  isSemesterActive,
  formatActionTarget,
} from "../../util/functions/utils";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Icon,
  Popup,
} from "semantic-ui-react";
import SubmissionViewerModal from "../DashboardTab/TimelinesView/Timeline/SubmissionViewerModal";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config, USERTYPES } from "../../util/functions/constants";
import { UserContext } from "../../util/functions/UserContext";
import _ from "lodash";
import ProfileCircle from "../../util/components/ProfileCircle";
import "./../../../css/components/tabs/action.css";

const LOGS_PER_PAGE = 10;
const TIME_LOGS_PER_PAGE = 5;

export default function ActionLogs(props) {
  const onlySemesters = {};
  props.semesterData.forEach(
    (semester) => (onlySemesters[semester.semester_id] = semester),
  );

  const [actionLogs, setActionLogs] = useState([]);
  const [actionLogCount, setActionLogCount] = useState(LOGS_PER_PAGE);
  const [timeLogs, setTimeLogs] = useState([]);
  const [timeLogCount, setTimeLogCount] = useState(TIME_LOGS_PER_PAGE);
  const userContext = useContext(UserContext);
  const prevLogin = new Date(userContext.user.prev_login);
  const [activePage, setActivePage] = useState(0);
  const [currentWeek, setCurrentWeek] = useState("");
  const [pastWeek, setPastWeek] = useState("");
  const [timeStats, setTimeStats] = useState({});
  const [students, setStudentsData] = useState([]);
  const [semesters, setSemestersData] = useState([]);
  // const [projects, setProjectsData] = useState([]);
  const [myProjects, setMyProjectsData] = useState([]);
  const [activeSemesters, setActiveSemesters] = useState({});
  const [openSubmissionIdx, setOpenSubmissionIdx] = useState(null);

  const unassignedStudentsStr = "Unassigned students";

  const [hoverRow, setHoverRow] = useState(null);
  const [contactInfo, setContactInfo] = useState({});

  const loadContactInfo = (systemId) => {
    if (!systemId || contactInfo[systemId] !== undefined) return;
    setContactInfo((prev) => ({ ...prev, [systemId]: null }));
    SecureFetch(`${config.url.API_GET_ADDITIONAL_INFO}?system_id=${systemId}`)
      .then((r) => r.json())
      .then((data) => setContactInfo((prev) => ({ ...prev, [systemId]: data })))
      .catch((err) => console.error("Error fetching additional info:", err));
  };

  const [notes, setNotes] = useState({});

  const loadNote = (logId) => {
    if (!logId || notes[logId] !== undefined) return;
    setNotes((prev) => ({ ...prev, [logId]: "" }));
    SecureFetch(`${config.url.API_GET_SUBMISSION}?log_id=${logId}`)
      .then((r) => r.json())
      .then((data) => {
        let note = "";
        try {
          note = data?.[0]?.notes ? JSON.parse(data[0].notes).note : "";
        } catch (e) {}
        setNotes((prev) => ({ ...prev, [logId]: note || "" }));
      })
      .catch((err) => console.error("Error fetching note:", err));
  };

  const getPaginationData = () => {
    const apiUrl = `${config.url.API_GET_ALL_ACTION_LOGS}/?resultLimit=${LOGS_PER_PAGE}&offset=${activePage}`;
    SecureFetch(apiUrl)
      .then((response) => response.json())
      .then((action_logs) => {
        setActionLogs(action_logs.actionLogs);
        setActionLogCount(action_logs.actionLogCount);
      })
      .catch((error) => {
        alert("Failed to get action log data " + error);
      });
  };

  const getTimeData = (page) => {
    SecureFetch(
      config.url.API_GET_ALL_TIME_LOGS,
      // `${
      //   config.url.API_GET_ALL_TIME_LOGS
      // }/?resultLimit=${TIME_LOGS_PER_PAGE}&offset=${TIME_LOGS_PER_PAGE * page}`
    )
      .then((response) => response.json())
      .then((time_logs) => {
        setTimeLogs(time_logs.timeLogs);
        setTimeLogCount(time_logs.timeLogCount);
        // timeLogCount = time_logs.timeLogCount;

        const today = new Date();
        const currentWeekStart = new Date(
          today.setDate(today.getDate() - today.getDay()),
        );
        const currentWeekEnd = new Date(today.setDate(today.getDate() + 6));
        setCurrentWeek(
          formatDate(currentWeekStart) + " - " + formatDate(currentWeekEnd),
        );

        // Calculate the start and end dates for the past week
        const pastWeekStart = new Date(currentWeekStart);
        pastWeekStart.setDate(pastWeekStart.getDate() - 7);
        const pastWeekEnd = new Date(pastWeekStart);
        pastWeekEnd.setDate(pastWeekEnd.getDate() + 6);
        setPastWeek(
          formatDate(pastWeekStart) + " - " + formatDate(pastWeekEnd),
        );

        const logs = {};

        time_logs.timeLogs.forEach((timeLog) => {
          const workDate = new Date(timeLog.work_date).toLocaleDateString();

          if (!logs[timeLog.system_id]) {
            logs[timeLog.system_id] = {
              timelogs: [],
              totalHours: 0,
              lastWeek: 0,
              thisWeek: 0,
              project: "",
            };
          }
          logs[timeLog.system_id].timelogs.push(timeLog);
          logs[timeLog.system_id].project = timeLog.project;
          if (timeLog.active === null) {
            logs[timeLog.system_id].totalHours += timeLog.time_amount;

            if (
              workDate >= currentWeekStart.toLocaleDateString() &&
              workDate <= currentWeekEnd.toLocaleDateString()
            ) {
              logs[timeLog.system_id].thisWeek += timeLog.time_amount;
            }
            if (
              workDate >= pastWeekStart.toLocaleDateString() &&
              workDate <= pastWeekEnd.toLocaleDateString()
            ) {
              logs[timeLog.system_id].lastWeek += timeLog.time_amount;
            }
          }
        });
        setTimeStats(logs);
      })
      .catch((error) => {
        alert("Failed to get time log data " + error);
      });
  };

  useEffect(() => {
    getPaginationData();
  }, [activePage]);

  useEffect(() => {
    setActivePage(0); // Reset to first page on mount
  }, []);

  useEffect(() => {
    getTimeData(0);
  }, []);

  useEffect(() => {
    SecureFetch(config.url.API_GET_SEMESTER_STUDENTS)
      .then((response) => response.json())
      .then((studentsData) => {
        setStudentsData(studentsData);
      })
      .catch((error) => {
        alert("Failed to get students data" + error);
      });
    SecureFetch(config.url.API_GET_SEMESTERS)
      .then((response) => response.json())
      .then((semestersData) => {
        setSemestersData(semestersData);
      })
      .catch((error) => {
        alert("Failed to get semestersData data" + error);
      });

    const getMyProjects =
      userContext.user.role === USERTYPES.ADMIN
        ? config.url.API_GET_PROJECTS
        : config.url.API_GET_MY_PROJECTS;
    SecureFetch(getMyProjects)
      .then((response) => response.json())
      .then((projectsData) => {
        setMyProjectsData(projectsData);
      })
      .catch((error) => {
        alert("Failed to get myProjectsData" + error);
      });
  }, [userContext.user?.role]);

  let semesterPanels = [];
  let initialActive = {};
  let initialActiveProjects = {};

  const generateWeeks = (startDate, endDate) => {
    const weeks = [];
    const currentDate = new Date(startDate);
    currentDate.setDate(
      currentDate.getDate() + ((7 - currentDate.getDay()) % 7),
    ); // Move to the next Sunday
    endDate = new Date(endDate);

    while (currentDate <= endDate) {
      const weekStartDate = new Date(currentDate);
      const weekEndDate = new Date(currentDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6); // Move to the next Saturday
      weeks.push({ startDate: weekStartDate, endDate: weekEndDate });

      currentDate.setDate(currentDate.getDate() + 7); // Move to the next Sunday
    }

    return weeks;
  };

  function findWeeksForDates(id, datesArray, weeksArray, hoursPerWeek) {
    const result = Array(weeksArray.length).fill(0);

    for (let log of datesArray) {
      const targetDate = new Date(log.work_date).setHours(0, 0, 0, 0);

      for (let i = 0; i < weeksArray.length; i++) {
        const startDate = new Date(weeksArray[i].startDate).setHours(
          0,
          0,
          0,
          0,
        );
        const endDate = new Date(weeksArray[i].endDate).setHours(0, 0, 0, 0);
        if (
          targetDate >= startDate &&
          targetDate <= endDate &&
          log.active == null
        ) {
          result[i] += log.time_amount;
          hoursPerWeek[i] += log.time_amount;
          break;
        }
      }
    }

    // console.log("ID check ", id);
    timeStats[id].weeklyHours = result;
    // console.log("week HERE ", timeStats[id].weeklyHours);
    // console.log("timestats ", timeStats[id]);

    return hoursPerWeek;
  }

  function generateMappedData(studentData, semesterData, projectData) {
    let projectMap = {};
    projectData.forEach((project) => {
      projectMap[project.project_id] = project;
    });

    let semesterMap = {};
    semesterData.forEach((semester) => {
      const weeks = generateWeeks(semester.start_date, semester.end_date);
      semester.weeks = weeks;
      semester.hoursPerWeek = Array(weeks.length).fill(0);
      semesterMap[semester.semester_id] = semester;
    });

    let mappedData = {
      [unassignedStudentsStr]: {
        students: [],
        name: unassignedStudentsStr,
        projects: {},
      },
    };

    studentData.forEach((student) => {
      if (student.semester_group) {
        if (!mappedData[student.semester_group]) {
          mappedData[student.semester_group] = {
            projects: {},
            name: semesterMap[student.semester_group]?.name,
            start_date: semesterMap[student.semester_group]?.start_date,
            end_date: semesterMap[student.semester_group]?.end_date,
            semester_id: semesterMap[student.semester_group]?.semester_id,
            weeks: semesterMap[student.semester_group]?.weeks,
          };

          initialActive[semesterMap[student.semester_group]?.semester_id] =
            isSemesterActive(
              semesterMap[student.semester_group]?.start_date,
              semesterMap[student.semester_group]?.end_date,
            );
        }
        if (student.project) {
          if (projectMap.hasOwnProperty(student.project)) {
            if (
              !mappedData[student.semester_group]["projects"][student.project]
            ) {
              mappedData[student.semester_group]["projects"][student.project] =
                {
                  students: [],
                  name:
                    projectMap[student.project]?.display_name ||
                    projectMap[student.project]?.title,
                  timelogs: [],
                  hoursPerWeek: Array(
                    mappedData[student.semester_group].weeks.length,
                  ).fill(0),
                };
            }
            mappedData[student.semester_group]["projects"][student.project][
              "students"
            ].push(student);

            if (!timeStats[student.system_id]) {
              timeStats[student.system_id] = {
                timelogs: [],
                totalHours: 0,
                lastWeek: 0,
                thisWeek: 0,
                project: "",
                weeklyHours: Array(
                  mappedData[student.semester_group].weeks.length,
                ).fill(0),
              };
            }

            if (
              timeStats[student.system_id] !== undefined &&
              timeStats[student.system_id].timelogs.length !== 0
            ) {
              var currlogs = timeStats[student.system_id];

              mappedData[student.semester_group]["projects"][
                student.project
              ].hoursPerWeek = findWeeksForDates(
                student.system_id,
                currlogs.timelogs,
                mappedData[student.semester_group].weeks,
                mappedData[student.semester_group]["projects"][student.project]
                  .hoursPerWeek,
              );
              for (const log of currlogs.timelogs) {
                mappedData[student.semester_group]["projects"][student.project][
                  "timelogs"
                ].push(log);
              }
            }

            // initialActiveProjects[student.project] = isSemesterActive(
            //   semesterMap[student.semester_group]?.start_date,
            //   semesterMap[student.semester_group]?.end_date
            // );
          }
        }
      } else {
        mappedData[unassignedStudentsStr]["students"].push(student);
      }
    });

    // Check if activeSemesters has already been set so that we don't run into issues with infinite re-renders
    if (
      Object.keys(activeSemesters).length === 0 &&
      !_.isEqual(activeSemesters, initialActive)
    ) {
      setActiveSemesters(initialActive);
    }

    return mappedData;
  }

  if (students.length > 0 && semesters.length > 0) {
    let semesterMap = generateMappedData(students, semesters, myProjects);
    semesterMap = _.orderBy(
      semesterMap,
      ["end_date", "start_date", "name"],
      "desc",
    );

    console.log("semester map ", semesterMap);

    semesterPanels = [];

    semesterPanels.push(<h3>Action Submissions</h3>);
    semesterPanels.push(
      <div>
        <Table stackable className="stackable-hide-header">
          <TableHeader>
            <TableRow>
              {userContext.user?.role !== USERTYPES.STUDENT && (
                <TableHeaderCell>Project</TableHeaderCell>
              )}
              <TableHeaderCell>Action</TableHeaderCell>
              <TableHeaderCell>Action Type</TableHeaderCell>
              <TableHeaderCell>Submitted By</TableHeaderCell>
              <TableHeaderCell>Submission Time</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {actionLogs?.map((action, idx) => {
              let submittedBy = `${action.name} (${action.system_id})`;
              if (action.mock_id) {
                submittedBy = `${action.mock_name} (${action.mock_id}) as ${action.name} (${action.system_id})`;
              }
              let showNewSubmissionHighlight =
                new Date(action.submission_datetime) > prevLogin;

              return (
                <TableRow
                  key={idx}
                  // Using same color schema as in-progress projects
                  className={`action-row-clickable${
                    showNewSubmissionHighlight ? " action-row-highlight" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setHoverRow(null);
                    setOpenSubmissionIdx(idx);
                  }}
                  onMouseEnter={(e) => {
                    setHoverRow({
                      idx,
                      x: e.clientX,
                      y: e.clientY,
                      el: e.currentTarget,
                    });
                    loadContactInfo(action.system_id);
                    loadNote(action.action_log_id);
                  }}
                  onMouseLeave={() => setHoverRow(null)}
                >
                  {userContext.user?.role !== USERTYPES.STUDENT && (
                    <TableCell>{action.display_name || action.title}</TableCell>
                  )}
                  <TableCell>{action.action_title}</TableCell>
                  <TableCell>
                    <span className="mobile-only-label">Type: </span>
                    {action.action_target}
                    {formatActionTarget(action.action_target)}
                  </TableCell>
                  <TableCell>
                    <span className="action-table">
                      {action.mock_id ? (
                        <>
                          <ProfileCircle
                            name={action.mock_name ?? ""}
                            size="tiny"
                            className="universal-tooltip"
                            isStudent={false}
                            showFullName
                            allowInfo
                          />
                          as
                        </>
                      ) : (
                        ""
                      )}
                      <ProfileCircle
                        name={action.name ?? ""}
                        size="tiny"
                        showFullName
                        allowInfo
                        className="action-profile"
                      />
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="mobile-only-label">Submission Date: </span>{" "}
                    {formatDateTime(action.submission_datetime)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="pagination-container">
          <Pagination
            firstItem={null}
            lastItem={null}
            prevItem={{ content: <Icon name="angle left" />, icon: true }}
            nextItem={{ content: <Icon name="angle right" />, icon: true }}
            activePage={activePage + 1}
            totalPages={Math.ceil(actionLogCount / LOGS_PER_PAGE)}
            onPageChange={(event, data) => {
              setActivePage(data.activePage - 1);
            }}
          />
        </div>

        {openSubmissionIdx !== null && actionLogs[openSubmissionIdx] && (
          <SubmissionViewerModal
            open
            projectName={
              actionLogs[openSubmissionIdx].display_name ||
              actionLogs[openSubmissionIdx].title
            }
            semesterName={
              onlySemesters[actionLogs[openSubmissionIdx].semester]?.name
            }
            action={actionLogs[openSubmissionIdx]}
            target={actionLogs[openSubmissionIdx].action_target}
            trigger={<span style={{ display: "none" }} />}
            isOpenCallback={(isOpen) => {
              if (!isOpen) setOpenSubmissionIdx(null);
            }}
          />
        )}

        {hoverRow &&
          actionLogs[hoverRow.idx] &&
          (() => {
            const a = actionLogs[hoverRow.idx];
            const extra = contactInfo[a.system_id];
            const contact = extra?.contact;
            const info = extra?.additional_info;
            const noteText = notes[a.action_log_id] || "";

            return (
              <Popup
                open
                className="universal-tooltip"
                position="bottom left"
                offset={[0, 8]}
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
                    {a.name}
                    {contact?.value && (
                      <div>
                        {contact.label}: {contact.value}
                      </div>
                    )}
                    {info && (
                      <div className="profile-hover">
                        Additional Info: {info}
                      </div>
                    )}

                    {noteText && (
                      <>
                        <div
                          style={{
                            borderTop: "1px solid var(--border-color)",
                            margin: "6px -16px",
                          }}
                        />
                        <div>Note: {noteText}</div>
                      </>
                    )}
                  </div>
                }
              />
            );
          })()}
      </div>,
    );
  }

  return semesterPanels;
}
