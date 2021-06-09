import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../util/constants";
import StudentTeamTable from "./StudentTeamTable";
import StudentRow from "./StudentRow";
import { SecureFetch } from "../util/secureFetch";
/**
 * This needs some edits, it makes the accorions for users in the admin tab
 * It should be altered to be generic to eventually replace the code behind 
 * the Student and Coaches tabs, all that could be done through here with 
 * params. 
 * 
 * This is pretty janky right now, need to remove dependency on StudentRow
 * 
 * This was ripped from StudentTab and edited fast to get it working. It still
 * needs to be refactored slightly to make it easier to read and use elsewhere
 * 
 * Still not aesthetically pleasing, rows for admins and coaches have individual 
 * headers
 * 
 * There needs to be an "inactive users" accordion
 * 
 */
export default function UsersTab() {
    const [students, setStudentsData] = useState([]);
    const [semesters, setSemestersData] = useState([]);
    const [projects, setProjectsData] = useState([]);
    const [users, setUserData] = useState([]);

    const unassignedStudentsStr = "Unassigned students";
    const coaches = "Coaches";
    const admins = "Admins";
    const inactive = "Inactive Users";

    useEffect(() => {
        SecureFetch(config.url.API_GET_STUDENT_INFO)
            .then((response) => response.json())
            .then((studentsData) => {
                setStudentsData(studentsData);
            })
            .catch((error) => {
                alert("Failed to get students data" + error);
            });
        SecureFetch(config.url.API_GET_USERS)
            .then((response) => response.json())
            .then((userData) => {
                setUserData(userData);
            })
            .catch((error) => {
                alert("Failed to get user data" + error);
            });
        SecureFetch(config.url.API_GET_ACTIVE_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
            })
            .catch((error) => {
                alert("Failed to get semestersData data" + error);
            });
        SecureFetch(config.url.API_GET_ACTIVE_PROJECTS)
            .then((response) => response.json())
            .then((projectsData) => {
                setProjectsData(projectsData);
            })
            .catch((error) => {
                alert("Failed to get projectsData" + error);
            });
    }, []);

    let semesterPanels = [];

    function fillInSemesterMap(semesterMap, studentData, semesterData, projectData, userData) {
        for (let i = 0; i < semesterData.length; i++) {
            let semester = semesterData[i];
            if (!semesterMap[semester.name]) {
                semesterMap[semester.name] = {};
            }
        }
        for (let i = 0; i < projectData.length; i++) {
            let project = projectData[i];
            if (!semesterMap[project.name]) {
                semesterMap[project.name] = {};
            }
            if (!semesterMap[project.name][project.project_id]) {
                semesterMap[project.name][project.project_id] = [];
            }
        }

        for(let i = 0; i < users.length; i++) {
            let user = userData[i];
            if(user.type === "coach") {
                if (!semesterMap[coaches]) {
                    semesterMap[coaches] = [];
                }
                semesterMap[coaches].push(<StudentRow student = {user} semesterData = {semesters} />);
            }
        }

        for(let i = 0; i < users.length; i++) {
            let user = userData[i];
            if (user.active === false) {
                if (!semesterMap[inactive]) {
                    semesterMap[inactive] = [];
                }
                semesterMap[inactive].push(<StudentRow student = {user} semesterData = {semesters} />);
            }
        }

        for(let i = 0; i < users.length; i++) {
            let user = userData[i];
            if(user.type === "admin") {
                if (!semesterMap[admins]) {
                    semesterMap[admins] = [];
                }
                semesterMap[admins].push(<StudentRow student = {user} semesterData = {semesters} />);
            }
        }

        for (let i = 0; i < studentData.length; i++) {
            let student = studentData[i];
            if (student.semester_group) {
                if (!semesterMap[student.name]) {
                    semesterMap[student.name] = {};
                }

                if (student.project) {
                    if (!semesterMap[student.name][student.project]) {
                        semesterMap[student.name][student.project] = [];
                    }
                    semesterMap[student.name][student.project].push(
                        <StudentRow student={student} semesterData={semesters} projectsData={projects} />
                    );
                } else {
                    // if a student hasn't been assigned a project yet
                    if (!semesterMap[student.name][unassignedStudentsStr]) {
                        semesterMap[student.name][unassignedStudentsStr] = [];
                    }
                    semesterMap[student.name][unassignedStudentsStr].push(
                        <StudentRow student={student} semesterData={semesters} projectsData={projects} />
                    );
                }
            } else {
                //if a student doesn't have an assigned semester group yet
                if (!semesterMap[unassignedStudentsStr]) {
                    semesterMap[unassignedStudentsStr] = [];
                }
                semesterMap[unassignedStudentsStr].push(<StudentRow student={student} semesterData={semesters} projectsData={projects} />);
            }
        }
        return semesterMap;
    }

    if (students && semesters && projects) {
        let semesterMap = {};
        let projectMap = new Map();

        semesterMap = fillInSemesterMap(semesterMap, students, semesters, projects, users);

        for (let i = 0; i < projects.length; i++) {
            projectMap[projects[i]["project_id"]] = projects[i]["team_name"];
        }
        for (const [semesterName, projects] of Object.entries(semesterMap)) {
            if (semesterName) {
                let projectPanels = [];

                let val = projects || {};

                for (const [projectId, studentPanels] of Object.entries(val)) {
                    if (semesterName === unassignedStudentsStr) {
                        let key = `StudentsTab-project-selector-${unassignedStudentsStr}-${projectId}`;
                        projectPanels.push(
                            <StudentTeamTable
                                childKey={key}
                                title={`Semester-unassigned Students (${studentPanels.length})`}
                                content={studentPanels}
                                unassignedSemester={true}
                            />
                        );
                    } else if (semesterName === "Coaches") {
                        let key = `StudentsTab-project-selector-${coaches}-${projectId}`;
                        projectPanels.push(
                            <StudentTeamTable
                                childKey={key}
                                title={`Semester-Coaches (${studentPanels.length})`}
                                content={studentPanels}
                                unassignedSemester={true}
                            />
                        );
                    } else if (semesterName === "Inactive Users") {
                        let key = `StudentsTab-project-selector-${inactive}-${projectId}`;
                        projectPanels.push(
                            <StudentTeamTable
                                childKey={key}
                                title={`Semester-Coaches (${studentPanels.length})`}
                                content={studentPanels}
                                unassignedSemester={true}
                            />
                        );
                    } else if (semesterName === "Admins") {
                        let key = `StudentsTab-project-selector-${admins}-${projectId}`;
                        projectPanels.push(
                            <StudentTeamTable
                                childKey={key}
                                title={`Semester-Coaches (${studentPanels.length})`}
                                content={studentPanels}
                                unassignedSemester={true}
                            />
                        );
                    } else if (projectId !== unassignedStudentsStr) {
                        let key = `StudentsTab-project-selector-${projectMap[projectId]}-${projectId}`;
                        projectPanels.push(
                            <StudentTeamTable
                                childKey={key}
                                title={`${projectMap[projectId]} (${studentPanels.length})`}
                                content={studentPanels}
                            />
                        );
                    } else {
                        let key = `StudentsTab-project-selector-${unassignedStudentsStr}-${projectId}`;
                        projectPanels.push(
                            <StudentTeamTable
                                childKey={key}
                                title={`Team-unassigned Students (${studentPanels.length})`}
                                content={studentPanels}
                            />
                        );
                    }
                }

                semesterPanels.push(
                    <Accordion
                        fluid
                        styled
                        panels={[
                            {
                                key: "StudentsTab-semester-selector-" + semesterName,
                                title: `${semesterName} (${projectPanels.length})`,
                                content: { content: projectPanels },
                            },
                        ]}
                    />
                );
            }
        }
    }

    return (
        <div>
            {semesterPanels.reverse()}
        </div>
    );
}
