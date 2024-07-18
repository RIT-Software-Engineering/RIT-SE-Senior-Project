import React, { useEffect, useState, useContext } from "react";
import { formatDate } from "../../util/functions/utils";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config, USERTYPES } from "../../util/functions/constants";
import { UserContext } from "../../util/functions/UserContext";
import _ from "lodash";
import TimeLogProjects from "./TimeLogProjects";
import ActionSubmissions from "./ActionSubmissions";

const LOGS_PER_PAGE = 50;
const TIME_LOGS_PER_PAGE = 5;

export default function LoggingTab(props) {
  const [actionLogs, setActionLogs] = useState([]);
  const [actionLogCount, setActionLogCount] = useState(LOGS_PER_PAGE);
  const [timeLogCount, setTimeLogCount] = useState(TIME_LOGS_PER_PAGE);
  const userContext = useContext(UserContext);
  const prevLogin = new Date(userContext.user.prev_login);
  const [projectsData, setProjectsData] = useState({});
  const [currentWeek, setCurrentWeek] = useState("");
  const [pastWeek, setPastWeek] = useState("");
  const [semesterProjects, setSemesterProjects] = useState({});
  const [projectTimelogs, setProjectTimelogs] = useState({});
  const [myProjects, setMyProjectsData] = useState({});
  const [studentTimelogs, setStudentTimelogs] = useState({});

  const generateWeeks = (startDate, endDate) => {
    const weeks = [];
    const currentDate = new Date(startDate);
    currentDate.setDate(
      currentDate.getDate() + ((7 - currentDate.getDay()) % 7)
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

  const onlySemesters = {};

  props.semesterData.forEach((semester) => {
    onlySemesters[semester.semester_id] = semester;
    const getWeeks = generateWeeks(semester.start_date, semester.end_date);
    onlySemesters[semester.semester_id].weeks = getWeeks;
  });

  const setWeekDates = (workDate, timeAmount, thisWeek, lastWeek) => {
    let today = new Date();
    let currentWeekStart = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    let currentWeekEnd = new Date(today.setDate(today.getDate() + 6));

    // Calculate the start and end dates for the past week
    let pastWeekStart = new Date(currentWeekStart);
    pastWeekStart.setDate(pastWeekStart.getDate() - 7);
    let pastWeekEnd = new Date(pastWeekStart);
    pastWeekEnd.setDate(pastWeekEnd.getDate() + 6);

    let currentStart =
      String(currentWeekStart.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(currentWeekStart.getDate()).padStart(2, "0") +
      "/" +
      currentWeekStart.getFullYear();

    let currentEnd =
      String(currentWeekEnd.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(currentWeekEnd.getDate()).padStart(2, "0") +
      "/" +
      currentWeekEnd.getFullYear();

    let pastStart =
      String(pastWeekStart.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(pastWeekStart.getDate()).padStart(2, "0") +
      "/" +
      pastWeekStart.getFullYear();

    let pastEnd =
      String(pastWeekEnd.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(pastWeekEnd.getDate()).padStart(2, "0") +
      "/" +
      pastWeekEnd.getFullYear();

    setCurrentWeek(currentStart + " - " + currentEnd);

    setPastWeek(pastStart + " - " + pastEnd);

    if (
      workDate.setHours(0, 0, 0, 0) >= currentWeekStart.setHours(0, 0, 0, 0) &&
      workDate.setHours(0, 0, 0, 0) <= currentWeekEnd.setHours(0, 0, 0, 0)
    ) {
      thisWeek += timeAmount;
    }
    if (
      workDate.setHours(0, 0, 0, 0) >= pastWeekStart.setHours(0, 0, 0, 0) &&
      workDate.setHours(0, 0, 0, 0) <= pastWeekEnd.setHours(0, 0, 0, 0)
    ) {
      lastWeek += timeAmount;
    }

    return [thisWeek, lastWeek];
  };

  const getPaginationData = (page) => {
    SecureFetch(
      `${
        config.url.API_GET_ALL_ACTION_LOGS
      }/?resultLimit=${LOGS_PER_PAGE}&offset=${LOGS_PER_PAGE * page}`
    )
      .then((response) => response.json())
      .then((action_logs) => {
        setActionLogs(action_logs.actionLogs);
        setActionLogCount(action_logs.actionLogCount);
      })
      .catch((error) => {
        alert("Failed to get action log data " + error);
      });
  };

  useEffect(() => {
    const getMyProjects =
      userContext.user.role === USERTYPES.ADMIN
        ? config.url.API_GET_PROJECTS
        : config.url.API_GET_MY_PROJECTS;
    SecureFetch(getMyProjects)
      .then((response) => response.json())
      .then((projectsData) => {
        // if (projectsData.length > 0) {
        let projects = {};
        let projectData = {};
        const sems = {};

        projectsData.forEach((project) => {
          if (!projects[project.project_id]) {
            projects[project.project_id] = {};
          }

          if (!projectData[project.project_id]) {
            projectData[project.project_id] = {
              details: project,
              weeks: [],
              weeklyHours: [],
            };
          }

          if (project.semester != null) {
            projectData[project.project_id].weeks =
              onlySemesters[project.semester].weeks;

            const hoursWeekly = Array(
              projectData[project.project_id].weeks.length
            ).fill(0);

            projectData[project.project_id].weeklyHours = hoursWeekly;

            if (!sems[project.semester]) {
              sems[project.semester] = {};
            }
            if (!sems[project.semester][project.project_id]) {
              sems[project.semester][project.project_id] = project.title;
            }
          }
        });
        setProjectsData(projectData);
        setMyProjectsData(projects);
        setSemesterProjects(sems);

        // }
      })
      .catch((error) => {
        alert("Failed to get myProjectsData" + error);
      });
  }, [userContext.user?.role]);

  const getStudentData = () => {
    SecureFetch(config.url.API_GET_SEMESTER_STUDENTS)
      .then((response) => response.json())
      .then((studentsData) => {
        if (studentsData.length > 0) {
          Object.entries(studentsData).map(([key, student], i) => {
            if (student.project != null) {
              if (!(student.project in myProjects)) {
                myProjects[student.project] = {};
              }

              const hoursPerWeek = Array(
                projectsData[student.project].weeklyHours.length
              ).fill(0);

              if (!(student.system_id in myProjects[student.project])) {
                myProjects[student.project][student.system_id] = {
                  name: `${student.fname} ${student.lname}`,
                  totalHours: 0,
                  lastWeek: 0,
                  thisWeek: 0,
                  avgHours: 0,
                  hoursPerWeek: hoursPerWeek,
                };
              }
            }

            setMyProjectsData(myProjects);
          });
        }
      })
      .catch((error) => {
        alert("Failed to get students data " + error);
      });
  };

  function getHoursPerWeek(timelog, weeksArray, hoursPerWeek) {
    const targetDate = new Date(timelog.work_date).setHours(0, 0, 0, 0);

    for (let i = 0; i < weeksArray.length; i++) {
      const startDate = new Date(weeksArray[i].startDate).setHours(0, 0, 0, 0);
      const endDate = new Date(weeksArray[i].endDate).setHours(0, 0, 0, 0);
      if (targetDate >= startDate && targetDate <= endDate) {
        projectsData[timelog.project].weeklyHours[i] += timelog.time_amount;
        hoursPerWeek[i] += timelog.time_amount;
        break;
      }
    }

    return hoursPerWeek;
  }

  const getTimeData = () => {
    SecureFetch(config.url.API_GET_ALL_TIME_LOGS)
      .then((response) => response.json())
      .then((time_logs) => {
        if (time_logs.timeLogs.length > 0) {
          const logs = {};
          const students = {};

          time_logs.timeLogs.forEach((timeLog) => {
            if (!logs[timeLog.project]) {
              logs[timeLog.project] = {
                timelogs: [],
                students: {},
              };
            }

            if (!students[timeLog.system_id]) {
              students[timeLog.system_id] = {};
            }

            if (!students[timeLog.system_id][timeLog.project]) {
              students[timeLog.system_id][timeLog.project] = [];
            }

            students[timeLog.system_id][timeLog.project].push(timeLog);

            const hoursPerWeek = Array(
              projectsData[timeLog.project].weeks.length
            ).fill(0);

            if (!logs[timeLog.project].students[timeLog.system_id]) {
              logs[timeLog.project].students[timeLog.system_id] = {
                name: timeLog.name,
                totalHours: 0,
                lastWeek: 0,
                thisWeek: 0,
                avgHours: 0,
                hoursPerWeek: hoursPerWeek,
              };
            }

            if (!(timeLog.system_id in myProjects[timeLog.project])) {
              myProjects[timeLog.project][timeLog.system_id] = {
                name: timeLog.name,
                totalHours: 0,
                lastWeek: 0,
                thisWeek: 0,
                avgHours: 0,
                hoursPerWeek: hoursPerWeek,
              };
            }

            logs[timeLog.project].timelogs.push(timeLog);

            let date = timeLog.work_date.split("-");
            let timelogDate = `${date[1]}/${date[2]}/${date[0]}`;

            if (timeLog.active === null) {
              logs[timeLog.project].students[timeLog.system_id].totalHours +=
                timeLog.time_amount;

              let [thisWeek, lastWeek] = setWeekDates(
                new Date(timelogDate),
                timeLog.time_amount,
                logs[timeLog.project].students[timeLog.system_id].thisWeek,
                logs[timeLog.project].students[timeLog.system_id].lastWeek
              );
              logs[timeLog.project].students[timeLog.system_id].thisWeek =
                thisWeek;
              logs[timeLog.project].students[timeLog.system_id].lastWeek =
                lastWeek;

              logs[timeLog.project].students[timeLog.system_id].hoursPerWeek =
                getHoursPerWeek(
                  timeLog,
                  projectsData[timeLog.project]?.weeks,
                  logs[timeLog.project].students[timeLog.system_id].hoursPerWeek
                );
            }

            myProjects[timeLog.project][timeLog.system_id] =
              logs[timeLog.project].students[timeLog.system_id];
          });

          setStudentTimelogs(students);
          setProjectTimelogs(logs);
          // setMyProjectsData(myProjects);
        }
      })
      .catch((error) => {
        alert("Failed to get time log data " + error);
      });
  };

  useEffect(() => {
    getPaginationData(0);
    // getStudentData();
  }, []);

  useEffect(() => {
    if (Object.keys(projectsData).length > 0) {
      getStudentData();
    }
  }, [projectsData]);

  useEffect(() => {
    if (Object.keys(myProjects).length > 0) {
      // console.log("now time data ");
      getTimeData();
    }
  }, [myProjects]);

  return (
    <>
      <h3>Time Logs</h3>
      {Object.keys(projectTimelogs).length > 0 ? (
        <TimeLogProjects
          semesterProjects={semesterProjects}
          onlySemesters={onlySemesters}
          projectTimelogs={projectTimelogs}
          myProjects={myProjects}
          projectsData={projectsData}
          pastWeek={pastWeek}
          currentWeek={currentWeek}
          prevLogin={prevLogin}
          user={userContext.user}
          reloadData={getTimeData}
        />
      ) : (
        <p>Loading Time log data...</p>
      )}

      <br />

      <h3>Action Submissions</h3>
      <ActionSubmissions
        actionLogs={actionLogs}
        actionLogCount={actionLogCount}
        onlySemesters={onlySemesters}
        userContext={userContext}
        prevLogin={prevLogin}
        getPaginationData={getPaginationData}
      />
    </>
  );
}
