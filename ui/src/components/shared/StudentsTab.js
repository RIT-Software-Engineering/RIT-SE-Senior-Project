import React, { useEffect, useState, useContext } from "react";
import {Accordion, Icon} from "semantic-ui-react";
import { config, USERTYPES } from "../util/constants";
import StudentTeamTable from "./StudentTeamTable";
import _ from "lodash";
import { SecureFetch } from "../util/secureFetch";
import { UserContext } from "../util/UserContext";
import { isSemesterActive } from "../util/utils";

export default function StudentsTab() {
    const [students, setStudentsData] = useState([]);
    const [semesters, setSemestersData] = useState([]);
    const [projects, setProjectsData] = useState([]);
    const [myProjects, setMyProjectsData] = useState([]);
    const [activeSemesters, setActiveSemesters] = useState({})
    const [activeProjectIds, setActiveProjectIds] = useState({})
    const userContext = useContext(UserContext);

    const unassignedStudentsStr = "Unassigned students";

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
        const getProjects = userContext.user.role === USERTYPES.ADMIN ? config.url.API_GET_PROJECTS : config.url.API_GET_SEMESTER_PROJECTS;
        SecureFetch(getProjects)
            .then((response) => response.json())
            .then((projectsData) => {
                setProjectsData(projectsData);
            })
            .catch((error) => {
                alert("Failed to get projectsData" + error);
            });
        const getMyProjects = userContext.user.role === USERTYPES.ADMIN ? config.url.API_GET_PROJECTS : config.url.API_GET_MY_PROJECTS;
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
        projectData.forEach(project => {
            projectMap[project.project_id] = project;
        });

        let semesterMap = {}
        semesterData.forEach(semester => {
            semesterMap[semester.semester_id] = semester;
        });

        let mappedData = { [unassignedStudentsStr]: { students: [], name: unassignedStudentsStr, projects: {} } }


        studentData.forEach(student => {
            if (student.semester_group) {
                if (!mappedData[student.semester_group]) {
                    mappedData[student.semester_group] = {
                        projects: { "noProject": { students: [], name: "No Project" } },
                        name: semesterMap[student.semester_group]?.name,
                        start_date: semesterMap[student.semester_group]?.start_date,
                        end_date: semesterMap[student.semester_group]?.end_date,
                        semester_id: semesterMap[student.semester_group]?.semester_id,
                    };
                    initialActive[semesterMap[student.semester_group]?.semester_id] = isSemesterActive(semesterMap[student.semester_group]?.start_date, semesterMap[student.semester_group]?.end_date);
                }
                if (student.project) {
                    if (!mappedData[student.semester_group]["projects"][student.project]) {
                        mappedData[student.semester_group]["projects"][student.project] = {
                            students: [],
                            name: projectMap[student.project]?.display_name || projectMap[student.project]?.title,
                        };
                    }
                    mappedData[student.semester_group]["projects"][student.project]['students'].push(student);
                    initialActiveProjects[student.project] = isSemesterActive(semesterMap[student.semester_group]?.start_date, semesterMap[student.semester_group]?.end_date);
                } else {
                    mappedData[student.semester_group]["projects"]["noProject"]["students"].push(student);
                }
            } else {
                mappedData[unassignedStudentsStr]["students"].push(student);
            }
        });

        // Check if activeSemesters has already been set so that we don't run into issues with infinite re-renders
        if (Object.keys(activeSemesters).length === 0) {
            setActiveSemesters(initialActive)
        }
        if (Object.keys(activeProjectIds).length === 0){
            setActiveProjectIds(initialActiveProjects)
        }
        return mappedData;
    }

    function generateMappedProjects(projectData){
        let projectMap = {}
        projectData.forEach(project => {
            projectMap[project.project_id] = project;
        });
        return projectMap;
    }

    if (students.length > 0 && semesters.length > 0) {

        let semesterMap = generateMappedData(students, semesters, projects);
        let projectMap = generateMappedProjects(myProjects);
        semesterMap = _.sortBy(semesterMap, ["end_date", "start_date", "name"]);

        let activeProjects = [];


        semesterMap.forEach(semester => {
            if (semester.name !== unassignedStudentsStr) {
                let studentsData = [];
                Object.keys(semester.projects).map(projectKey => {
                    let studentsList = semester.projects[projectKey].students;
                    studentsList.forEach(student => {
                        studentsData.push(student);
                    })
                    return true;
                });

                studentsData = _.sortBy(studentsData || [], ["fname", "lname", "email"])

                Object.keys(semester.projects).map(projectKey => {
                    if (semester.projects[projectKey].students.length > 0 && projectKey !== "noProject" && semester.projects[projectKey].name !== undefined && projectMap.hasOwnProperty(projectKey)){
                        let sortedStudents = _.sortBy(semester.projects[projectKey].students || [], ["fname", "lname", "email"])
                        activeProjects.push(
                            <div className="accordion-button-group">
                                <Accordion
                                    key={projectKey}
                                    fluid
                                    styled
                                    onTitleClick={() => {
                                        setActiveProjectIds({ ...activeProjectIds, [projectKey]: !activeProjectIds[projectKey] })
                                    }}
                                    panels={[{
                                        key: projectKey,
                                        title: `${semester.projects[projectKey].name} - ${semester.name} (${semester.projects[projectKey]?.students?.length})`,
                                        active: activeProjectIds[projectKey],
                                        content: {
                                            content:
                                                <StudentTeamTable
                                                    key={projectKey + "-team"}
                                                    childKey={projectKey + "-team-child"}
                                                    students={sortedStudents}
                                                    semesterData={semesters}
                                                    projectsData={semester.projects}
                                                    viewOnly
                                                    noAccordion={true}
                                                    studentsTab={true}
                                                />
                                        }
                                    }]}
                                />
                                <div className="accordion-buttons-container">
                                    <a
                                        href={`mailTo:${semester.projects[projectKey].students?.map(student => student.email).join(",")}`}
                                        className="ui icon button"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Icon name="mail" />
                                    </a>
                                </div>
                            </div>
                        )
                    }
                    return true;
                })

                activeProjects.reverse()


                semesterPanels.push(
                    <div className="accordion-button-group">
                        <Accordion
                            key={semester.semester_id}
                            fluid
                            styled
                            onTitleClick={() => {
                                setActiveSemesters({ ...activeSemesters, [semester.semester_id]: !activeSemesters[semester.semester_id] })
                            }}
                            panels={[{
                                key: semester.semester_id,
                                title: `${semester.name} (${studentsData?.length})`,
                                active: activeSemesters[semester.semester_id],
                                content: {
                                    content:
                                        <StudentTeamTable
                                            key={semester.semester_id}
                                            childKey={semester.semester_id}
                                            students={studentsData}
                                            semesterData={semesters}
                                            noAccordion={true}
                                            viewOnly
                                            studentsTab={true}
                                            projectsData={semester.projects}
                                        />
                                }
                            }]}
                        />
                        <div className="accordion-buttons-container">
                            <a
                                href={`mailTo:${studentsData?.map(student => student.email).join(",")}`}
                                className="ui icon button"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon name="mail" />
                            </a>
                        </div>
                    </div>
                )
            }
        })

        semesterPanels.push(
            <h3>All Students</h3>
        )

        if(userContext.user.role !== USERTYPES.ADMIN && activeProjects.length !== 0){
            semesterPanels.push(
                activeProjects,
                <h3>My Teams</h3>
            )
        }

    }

    return semesterPanels.reverse();
}
