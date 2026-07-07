import React, { useEffect, useState, useContext } from "react";
import { Accordion, Icon, Message, Dropdown } from "semantic-ui-react";
import { config, USERTYPES } from "../../util/functions/constants";
import StudentTeamTable from "./StudentTeamTable";
import { SecureFetch } from "../../util/functions/secureFetch";
import { UserContext } from "../../util/functions/UserContext";
import { isSemesterActive } from "../../util/functions/utils";
import EvalReview from "../../util/components/EvalReview";
import BarGraph from "../../util/components/PeerEvalVisualSummary";
import _ from "lodash";

import "./../../css/components/tabs/student.css";

export default function StudentsTab(props) {
  const [students, setStudentsData] = useState([]);
  const [semesters, setSemestersData] = useState([]);
  const [projects, setProjectsData] = useState([]);
  const [myProjects, setMyProjectsData] = useState([]);
  const [activeSemesters, setActiveSemesters] = useState({});
  const [activeProjectIds, setActiveProjectIds] = useState({});
  const [coachFeedback, setCoachFeedback] = useState({});
  const [sortBy, setSortBy] = useState({});

  const userContext = useContext(UserContext);
  const unassignedStudentsStr = "Unassigned students";

  function updateCoachFeedback(project_id, form_data) {
    setCoachFeedback((prev) => ({ ...prev, [project_id]: form_data }));
  }

  function getSortOptions() {
    const sortOptions = [
      {
        key: "name",
        text: "Student Name",
        value: "student",
      },
      {
        key: "project",
        text: "Project Name",
        value: "project",
      },
    ];

    // coaches and admins are able to see the Last Login column for All Students section
    if (
      userContext.user.role === USERTYPES.ADMIN ||
      userContext.user.role === USERTYPES.COACH
    ) {
      sortOptions.push({
        key: "lastLogin",
        text: "Last Login",
        value: "lastLogin",
      });
    }
    return sortOptions;
  }

  const sortOptions = getSortOptions();

  function getCoachFeedback(project_id) {
    SecureFetch(`${config.url.API_GET_COACH_FEEDBACK}?project_id=${project_id}`)
      .then((response) => response.json())
      .then((data) => {
        const submissions = {};
        data.forEach((s) => {
          if (
            submissions[s.action_id] === undefined ||
            submissions[s.action_id].submission_datetime < s.submission_datetime
          ) {
            submissions[s.action_id] = s;
          }
        });

        const forms = Object.values(submissions).map((s) => {
          let form_data = JSON.parse(s.form_data);
          form_data["ActionData"] = {
            title: s.title,
            start_date: s.date,
            id: s.action_id,
          };
          return form_data;
        });

        updateCoachFeedback(project_id, forms);
      })
      .catch((error) => {
        alert("Failed to get Coach's Feedback" + error);
      });
  }

  useEffect(() => {
    SecureFetch(config.url.API_GET_SEMESTER_STUDENTS)
      .then((response) => response.json())
      .then((studentsData) => {
        setStudentsData(studentsData);
      })
      .catch((error) => {
        alert("Failed to get students data" + error);
      });

    if (props.project_id !== null) {
      getCoachFeedback(props.project_id);
    }

    SecureFetch(config.url.API_GET_SEMESTERS)
      .then((response) => response.json())
      .then((semestersData) => {
        setSemestersData(semestersData);
      })
      .catch((error) => {
        alert("Failed to get semestersData data" + error);
      });

    const getProjects =
      userContext.user.role === USERTYPES.ADMIN
        ? config.url.API_GET_PROJECTS
        : config.url.API_GET_SEMESTER_PROJECTS;
    SecureFetch(getProjects)
      .then((response) => response.json())
      .then((projectsData) => {
        setProjectsData(projectsData);
        const project_ids = projectsData.map((project) => project.project_id);
        project_ids.forEach((project_id) => {
          getCoachFeedback(project_id);
        });
      })
      .catch((error) => {
        alert("Failed to get projectsData" + error);
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

  function generateMappedData(studentData, semesterData, projectData) {
    let projectMap = {};
    projectData.forEach((project) => {
      projectMap[project.project_id] = project;
    });

    let semesterMap = {};
    semesterData.forEach((semester) => {
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
            projects: {
              noProject: { students: [], name: "No Project" },
            },
            name: semesterMap[student.semester_group]?.name,
            start_date: semesterMap[student.semester_group]?.start_date,
            end_date: semesterMap[student.semester_group]?.end_date,
            semester_id: semesterMap[student.semester_group]?.semester_id,
          };
          initialActive[semesterMap[student.semester_group]?.semester_id] =
            isSemesterActive(
              semesterMap[student.semester_group]?.start_date,
              semesterMap[student.semester_group]?.end_date,
            );
        }
        if (student.project) {
          if (
            !mappedData[student.semester_group]["projects"][student.project]
          ) {
            mappedData[student.semester_group]["projects"][student.project] = {
              students: [],
              name:
                projectMap[student.project]?.display_name ||
                projectMap[student.project]?.title,
            };
          }
          mappedData[student.semester_group]["projects"][student.project][
            "students"
          ].push(student);
          initialActiveProjects[student.project] = isSemesterActive(
            semesterMap[student.semester_group]?.start_date,
            semesterMap[student.semester_group]?.end_date,
          );
        } else {
          mappedData[student.semester_group]["projects"]["noProject"][
            "students"
          ].push(student);
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
    if (
      Object.keys(activeProjectIds).length === 0 &&
      !_.isEqual(activeProjectIds, initialActiveProjects)
    ) {
      setActiveProjectIds(initialActiveProjects);
    }

    return mappedData;
  }

  function generateMappedProjects(projectData) {
    let projectMap = {};
    projectData.forEach((project) => {
      projectMap[project.project_id] = project;
    });
    return projectMap;
  }

  if (students.length > 0 && semesters.length > 0) {
    let semesterMap = generateMappedData(students, semesters, projects);
    let projectMap = generateMappedProjects(myProjects);
    semesterMap = _.sortBy(semesterMap, ["end_date", "start_date", "name"]);

    let activeProjects = [];

    // All Students
    semesterMap.forEach((semester) => {
      if (semester.name !== unassignedStudentsStr) {
        let studentsData = [];
        Object.keys(semester.projects).forEach((projectKey) => {
          let studentsList = semester.projects[projectKey].students;
          studentsList.forEach((student) => {
            studentsData.push(student);
          });
        });

        const semesterSort = sortBy[semester.semester_id];
        // sorting based on dropdown selection
        if (semesterSort === "student") {
          studentsData = _.sortBy(
            studentsData || [],
            (student) => `${student.fname} ${student.lname}`,
          );
        } else if (semesterSort === "project") {
          studentsData = _.sortBy(
            studentsData || [],
            (student) =>
              semester.projects[student.project]?.name || "No Project",
          );
        } else if (semesterSort === "lastLogin") {
          studentsData = _.sortBy(studentsData || [], (student) => {
            if (!student.last_login) return 0;
            return new Date(student.last_login).getTime();
          });
          studentsData = studentsData.reverse(); // latest login at top
        }

        Object.keys(semester.projects).forEach((projectKey) => {
          if (
            semester.projects[projectKey].students.length > 0 &&
            projectKey !== "noProject" &&
            semester.projects[projectKey].name !== undefined &&
            projectMap.hasOwnProperty(projectKey)
          ) {
            let sortedStudents = _.sortBy(
              semester.projects[projectKey].students || [],
              ["fname", "lname", "email"],
            );
            activeProjects.push(
              <div className="accordion-button-group" key={projectKey}>
                <Accordion
                  fluid
                  styled
                  onTitleClick={() => {
                    setActiveProjectIds({
                      ...activeProjectIds,
                      [projectKey]: !activeProjectIds[projectKey],
                    });
                  }}
                  panels={[
                    {
                      key: projectKey,
                      title: `${semester.projects[projectKey].name} - ${semester.name} (${semester.projects[projectKey]?.students?.length})`,
                      active: activeProjectIds[projectKey],
                      content: {
                        content: (
                          <StudentTeamTable
                            key={projectKey + "-team"}
                            childKey={projectKey + "-team-child"}
                            students={sortedStudents}
                            semesterData={semesters}
                            projectsData={semester.projects}
                            viewOnly
                            noAccordion={true}
                            studentsTab={true}
                            firstTable
                            isStudent={
                              userContext.user.role === USERTYPES.STUDENT
                            }
                            isMyTeamTable={true}
                          />
                        ),
                      },
                    },
                  ]}
                />
                <div className="accordion-buttons-container">
                  <a
                    href={`mailTo:${semester.projects[projectKey].students
                      ?.map((student) => student.email)
                      .join(",")}`}
                    className="ui icon button"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon
                      name="mail"
                      className="student-icon-color"
                    />
                  </a>
                </div>
              </div>,
            );
          }
        });

        semesterPanels.push(
          <div className="accordion-button-group" key={semester.semester_id}>
            <Accordion
              fluid
              styled
              onTitleClick={() => {
                setActiveSemesters({
                  ...activeSemesters,
                  [semester.semester_id]:
                    !activeSemesters[semester.semester_id],
                });
              }}
              panels={[
                {
                  key: semester.semester_id,
                  title: `${semester.name} (${studentsData?.length})`,
                  active: activeSemesters[semester.semester_id],
                  content: {
                    content: (
                      <StudentTeamTable
                        key={semester.semester_id}
                        childKey={semester.semester_id}
                        students={studentsData}
                        semesterData={semesters}
                        noAccordion={true}
                        viewOnly
                        studentsTab={true}
                        projectsData={semester.projects}
                        isStudent={userContext.user.role === USERTYPES.STUDENT}
                        isMyTeamTable={
                          userContext.user.role !== USERTYPES.ADMIN &&
                          userContext.user.role !== USERTYPES.COACH
                            ? false
                            : true
                        }
                      />
                    ),
                  },
                },
              ]}
            />
            <div className="accordion-buttons-container">
              <Dropdown
                className="student-dropdown"
                text="Sort By"
                direction="left"
                floating
                value={sortBy[semester.semester_id] || null}
                onChange={(e, { value }) =>
                  setSortBy((prev) => ({
                    ...prev,
                    [semester.semester_id]: value,
                  }))
                }
                options={sortOptions}
              />
              <a
                href={`mailTo:${studentsData
                  ?.map((student) => student.email)
                  .join(",")}`}
                className="ui icon button"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="mail" className="student-icon-color" />
              </a>
            </div>
          </div>,
        );
      }
    });

    semesterPanels.push(<h3>All Students</h3>);

    // Admin and Coaches Peer Eval view (separated by semesters)
    if (
      userContext.user.role === USERTYPES.ADMIN ||
      userContext.user.role === USERTYPES.COACH
    ) {
      let peerEvalSemesterPanels = [];
      semesterMap.forEach((semester) => {
        if (semester.name === unassignedStudentsStr) return;

        let peerEvalPanels = [];
        Object.keys(semester.projects).forEach((projectKey) => {
          const project = semester.projects[projectKey];
          const submissions = coachFeedback[projectKey];
          if (!submissions || projectKey === "noProject") return;
          const hasSubmissions = submissions.length > 0;

          const subAccordion = (submission, index) => (
            <Accordion
              key={"Peer-Eval" + projectKey + submission.ActionData.id}
              fluid
              styled
              panels={[
                {
                  key: `${projectKey}eval${submission.ActionData.id}`,
                  title: `${submission.ActionData.title} - ${submission.ActionData.start_date}`,
                  content: {
                    content: (
                      <>
                        <div
                          className="student-content"
                        >
                          <BarGraph
                            data={submission}
                            width={window.innerWidth * 0.9}
                            height={300}
                          />
                        </div>
                        <EvalReview
                          forms={submission}
                          isSub={submission?.Submitter === "COACH"}
                          id={projectKey + semester.name}
                        />
                      </>
                    ),
                  },
                },
              ]}
            />
          );

          peerEvalPanels.push(
            <Accordion
              key={"PEEREVAL" + projectKey}
              fluid
              styled
              panels={[
                {
                  key: `eval-${projectKey}`,
                  title: `${project.name}`,
                  content: {
                    content: hasSubmissions ? (
                      submissions.map((submission, index) =>
                        subAccordion(submission, index),
                      )
                    ) : (
                      <Message>
                        <Icon name="info circle" />
                        <b>
                          No coach feedback for peer-evaluations given at this
                          time.
                        </b>
                      </Message>
                    ),
                  },
                },
              ]}
            />,
          );
        });

        if (peerEvalPanels.length > 0) {
          peerEvalSemesterPanels.push(
            <Accordion
              key={`peer-evals-semester-${semester.semester_id}`}
              fluid
              styled
              onTitleClick={() => {
                setActiveSemesters({
                  ...activeSemesters,
                  [semester.semester_id]:
                    !activeSemesters[semester.semester_id],
                });
              }}
              panels={[
                {
                  key: `peer-evals-${semester.semester_id}`,
                  title: `${semester.name}`,
                  active: activeSemesters[semester.semester_id],
                  content: {
                    content: peerEvalPanels,
                  },
                },
              ]}
            />,
          );
        }
      });

      if (peerEvalSemesterPanels.length > 0) {
        semesterPanels.push(peerEvalSemesterPanels, <h3>Peer Evaluations</h3>);
      }
    }

    // Students Peer Eval View (not separated by semesters)
    if (userContext.user.role === USERTYPES.STUDENT) {
      semesterMap.forEach((semester) => {
        Object.keys(semester.projects).forEach((projectKey) => {
          const project = semester.projects[projectKey];
          const submissions = coachFeedback[projectKey];
          if (!submissions) return;
          const hasSubmissions = submissions.length > 0;

          const subAccordion = (submission, index) => (
            <Accordion
              key={"Peer-Eval" + projectKey + submission.ActionData.id}
              fluid
              styled
              panels={[
                {
                  key: `${projectKey}eval${submission.ActionData.id}`,
                  title: `${submission.ActionData.title} - ${submission.ActionData.start_date}`,
                  content: {
                    content: (
                      <EvalReview
                        forms={submission}
                        isSub={submission?.Submitter === "COACH"}
                        id={projectKey + semester.name}
                      />
                    ),
                  },
                },
              ]}
            />
          );

          if (
            semester.projects[projectKey].students
              .map((student) => `${student.system_id}`)
              .includes(userContext.user.user)
          ) {
            semesterPanels.push(
              <div key={"PeerEval" + projectKey}>
                <Accordion
                  fluid
                  styled
                  panels={[
                    {
                      key: `eval-${projectKey}`,
                      title: `${project.name} - ${semester.name}`,
                      content: {
                        content: hasSubmissions ? (
                          submissions.map((submission, index) =>
                            subAccordion(submission, index),
                          )
                        ) : (
                          <Message>
                            <Icon name="info circle" />
                            <b>
                              No coach feedback for peer-evaluations given at
                              this time.
                            </b>
                          </Message>
                        ),
                      },
                    },
                  ]}
                />
              </div>,
            );
          }
        });
      });
      semesterPanels.push(<h3>Peer Evaluations</h3>);
    }

    // My Teams
    if (
      userContext.user.role !== USERTYPES.ADMIN &&
      activeProjects.length !== 0
    ) {
      semesterPanels.push(activeProjects, <h3>My Teams</h3>);
    }
  }

  return semesterPanels.reverse();
}
