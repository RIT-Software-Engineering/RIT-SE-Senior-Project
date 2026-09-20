import { useContext, useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config } from "../../util/functions/constants";
import { UserContext } from "../../util/functions/UserContext";
import { isSemesterActive } from "../../util/functions/utils";
import ProjectTime from "./ProjectTime";

const LOGS_PER_PAGE = 50;

export default function TimeLog(props) {
  const semesterMap = {};
  props.semesterData.forEach(
    (semester) => (semesterMap[semester.semester_id] = semester),
  );
  const [timeLogs, setTimeLogs] = useState([]);
  const [timeStats, setTimeStats] = useState([]);
  const userContext = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [key, setKey] = useState(Math.random());
  const [activeSemesters, setActiveSemesters] = useState({});
  const [students] = useState([]);
  const { eachWeekOfInterval } = require("date-fns");

  useEffect(() => {
    SecureFetch(config.url.API_GET_MY_PROJECTS)
      .then((response) => response.json())
      .then((project) => {
        if (project.length !== 0) {
          //Get list of semesters
          const tracker = [];
          for (let x of project) {
            if (!tracker.includes(x.semester)) {
              tracker.push(x.semester);
            }
          }
          const tracker2 = [];
          for (let x of props.semesterData) {
            if (tracker.includes(x.semester_id)) {
              tracker2.push(x);
            }
          }
          setSemesters(tracker2);
          //Get projects
          setProjects(project);
        }
      })
      .catch((error) => {
        alert("Failed to get proposal data " + error);
      });
  }, [userContext, eachWeekOfInterval, props.semesterData]);

  const resetKey = () => {
    setKey(Math.random());
  };
  const getTimeData = () => {
    SecureFetch(
      `${config.url.API_GET_ALL_TIME_LOGS}/?resultLimit=${LOGS_PER_PAGE}&offset=0`,
    )
      .then((response) => response.json())
      .then((time_logs) => {
        setTimeLogs(time_logs.timeLogs);
        var userNames = [];
        for (var i = 0; i < time_logs.timeLogs.length; i++) {
          let timeLog = time_logs.timeLogs[i];
          if (!userNames.some((e) => e.name === timeLog.name)) {
            userNames.push({
              name: timeLog.name,
              system_id: timeLog.system_id,
            });
          }
        }

        // Sort the array of user objects by system_id. This is necessary because the
        // the timeLogs array is sorted by date, and we want to group the time logs
        // by user in the order of their system_id.
        userNames.sort(function (a, b) {
          // If a's system_id is less than b's, return -1 (a should come before b)
          if (a.system_id < b.system_id) return -1;
          // If a's system_id is greater than b's, return 1 (change nothing,a should come before b)
          else if (a.system_id > b.system_id) return 1;
          // If the system_ids are equal, return 0 (the order of the users doesn't matter)
          else return 0;
        });

        var users = [];
        for (let i = 0; i < userNames.length; i++) {
          users.push(userNames[i].name);
        }

        var userStats = [];
        for (let i = 0; i < users.length; i++) {
          let userTimeLogs = time_logs.timeLogs.filter(
            (log) => log.name === users[i],
          );
          let userTotal = userTimeLogs
            .filter((log) => log.active !== 0)
            .map((log) => log.time_amount)
            .reduce((a, b) => a + b, 0);
          let uProject = userTimeLogs[0].project;
          let sysid = userTimeLogs[0].system_id;
          userStats.push({
            name: users[i],
            total: userTotal,
            lastWeek: 4,
            thisWeek: 2,
            project: uProject,
            system_id: sysid,
          });
        }
        setTimeStats(userStats);
      })
      .catch((error) => {
        alert("Failed to get time log data " + error);
      });
  };

  function getPaginationData(number) {}

  useEffect(() => {
    getPaginationData(0);
  }, []);
  useEffect(() => {
    console.log("changed");
    getTimeData(0);
  }, [key]);

  return (
    <>
      {semesters.length > 0 && <h3>Time Log</h3>}
      {semesters.map((sem) => {
        const isActive = isSemesterActive(sem?.start_date, sem?.end_date);
        const isAccordionActive =
          activeSemesters[sem.semester_id] === undefined
            ? isActive
            : activeSemesters[sem.semester_id];

        return (
          <>
            <div className="accordion-button-group">
              <Accordion
                fluid
                styled
                onTitleClick={() => {
                  setActiveSemesters((prevActiveSemesters) => ({
                    ...prevActiveSemesters,
                    [sem.semester_id]: !isAccordionActive,
                  }));
                }}
                panels={[
                  {
                    key: "Semester Here",
                    title: sem.name,
                    active: isAccordionActive,
                    content: {
                      content: (
                        <>
                          {projects
                            .filter((log) => log.semester === sem.semester_id)
                            .map((proj, counter) => {
                              return (
                                <ProjectTime
                                  reset={resetKey}
                                  semester={sem}
                                  proj={proj}
                                  studentData={students}
                                  timeStats={timeStats}
                                  timeLogs={timeLogs}
                                  viewOnly={props.viewOnly}
                                ></ProjectTime>
                              );
                            })}
                        </>
                      ),
                    },
                  },
                  {},
                ]}
              />
            </div>
          </>
        );
      })}
    </>
  );
}
