import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config, USERTYPES } from "../../../util/functions/constants";
import _ from "lodash";
import StudentTeamTable from "../../StudentsTab/StudentTeamTable";
import { SecureFetch } from "../../../util/functions/secureFetch";


/**
 * FIXME: This whole component should be redesigned to only
 * get users when opening an accordion. Loading all of the users
 * at the beginning will slow down over time especially as we add
 * nearly 200 users per semester. Overall, the design of this component
 * could be less complex.
 */
export default function UserEditorUserGroups() {
    const [students, setStudentsData] = useState([]);
    const [semesters, setSemestersData] = useState();
    const [projects, setProjectsData] = useState([]);
    const [users, setUserData] = useState([]);

    const unassignedStudentsStr = "Unassigned students";
    const coaches = "Coaches";
    const admins = "Admins";
    const inactive = "Inactive Users";

    let groupings;
    let semesterMap = {};
    let projectMap = {};
    let semesterAccordions = [];

    useEffect(() => {
        SecureFetch(config.url.API_GET_STUDENT_INFO)
            .then((response) => response.json())
            .then((studentsData) => {
                console.log(studentsData)
                setStudentsData(studentsData);
            })
            .catch((error) => {
                alert("Failed to get students data" + error);
            });
        SecureFetch(config.url.API_GET_NON_STUDENT_INFO)
            .then((response) => response.json())
            .then((userData) => {
                setUserData(userData);
            })
            .catch((error) => {
                alert("Failed to get non student data" + error);
            });
        SecureFetch(config.url.API_GET_SEMESTERS)
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

    function groupUsers(studentData, userData, projectMap) {
        let semesterMap = { semesters: [] }

        userData.forEach(user => {
            if (user.active === "") {
                switch (user.type) {
                    case USERTYPES.COACH:
                        if (!semesterMap[coaches]) {
                            semesterMap[coaches] = [];
                        }
                        semesterMap[coaches].push(user);
                        semesterMap[coaches].sort((a, b) => a.lname.localeCompare(b.lname))
                        break;
                    case USERTYPES.ADMIN:
                        if (!semesterMap[admins]) {
                            semesterMap[admins] = [];
                        }
                        semesterMap[admins].push(user);
                        semesterMap[admins].sort((a, b) => a.lname.localeCompare(b.lname))
                        break;

                    default:
                        break;
                }
            } else {
                if (!semesterMap[inactive]) {
                    semesterMap[inactive] = [];
                }
                semesterMap[inactive].push(user);
            }
        });

        for (let i = 0; i < studentData.length; i++) {
            let student = studentData[i];
            if (student.semester_group) {
                if (!semesterMap["semesters"][student.semester_id]) {
                    semesterMap["semesters"][student.semester_id] = { projects: {} };
                }

                if (student.project) {
                    //If a students project doesn't exist inside the semestermap yet, it creates it
                    if (!semesterMap["semesters"][student.semester_id]["projects"][student.project]) {
                        semesterMap["semesters"][student.semester_id]["projects"][student.project] = {
                            name: projectMap[student.project].display_name || projectMap[student.project].title,
                            project_id: projectMap[student.project].project_id,
                            students: []
                        };
                    }
                    semesterMap["semesters"][student.semester_id]["projects"][student.project]["students"].push(student);
                    //Sorting after insertion, not the most optimal, but should be okay.
                    semesterMap["semesters"][student.semester_id]["projects"][student.project]["students"].sort((a, b) => a.lname.localeCompare(b.lname))
                } else {
                    // if a student hasn't been assigned a project yet
                    if (!semesterMap["semesters"][student.semester_id][unassignedStudentsStr]) {
                        semesterMap["semesters"][student.semester_id][unassignedStudentsStr] = [];
                    }
                    semesterMap["semesters"][student.semester_id][unassignedStudentsStr].push(student);
                    semesterMap["semesters"][student.semester_id][unassignedStudentsStr].sort((a, b) => a.lname.localeCompare(b.lname))
                }
            }
            else {
                //if a student doesn't have an assigned semester group yet
                if (!semesterMap[unassignedStudentsStr]) {
                    semesterMap[unassignedStudentsStr] = [];
                }
                semesterMap[unassignedStudentsStr].push(student);
                semesterMap[unassignedStudentsStr].sort((a, b) => a.lname.localeCompare(b.lname))
            }
        }
        return semesterMap;
    }

    function createSemesterAccordion(grouping) {
        let panels = [];

        if (grouping[unassignedStudentsStr]) {
            panels.push(<StudentTeamTable
                key={unassignedStudentsStr}
                childKey={unassignedStudentsStr}
                title={`Unassigned Students (${grouping[unassignedStudentsStr].length})`}
                projectsData={projects}
                semesterData={semesters}
                students={grouping[unassignedStudentsStr]}
            />)
        }

        if (grouping["projects"]) {
            let sortedProjects = _.sortBy(grouping["projects"], ["name"]);

            panels.push(sortedProjects.map(project => {
                return <StudentTeamTable
                    key={`project-${project.project_id}`}
                    childKey={`project-${project.project_id}`}
                    title={`${project["name"]} (${project["students"].length})`}
                    projectsData={projects}
                    semesterData={semesters}
                    students={project["students"]}
                />
            }));
        }
        return panels
    }

    if (!students || !semesters || !Object.keys(projects).length) {
        return <>loading...</>
    }

    semesters.forEach(semester => {
        semesterMap[semester.semester_id] = semester;
    })
    projects.forEach(project => {
        projectMap[project.project_id] = project;
    })

    groupings = groupUsers(students, users, projectMap);

    semesterAccordions = Object.keys(groupings["semesters"]).map(semesterId => {
        return {
            endDate: semesterMap[semesterId]?.end_date,
            startDate: semesterMap[semesterId]?.start_date,
            accordion: <Accordion
                key={semesterId}
                fluid
                styled
                panels={[
                    {
                        key: "StudentsTab-semester-selector-" + semesterId,
                        title: `${semesterMap[semesterId]["name"]} (${Object.keys(groupings["semesters"][semesterId])?.length})`,
                        content: { content: createSemesterAccordion(groupings["semesters"][semesterId]) },
                    },
                ]}
            />,
        }
    })

    semesterAccordions = _.sortBy(semesterAccordions, ["end_date", "start_date"]).reverse();

    return (
        <>
            <StudentTeamTable
                title="Unassigned Students"
                key="Unassigned Students Key"
                childKey="Unassigned Students Key"
                projectsData={projects}
                semesterData={semesters}
                students={groupings[unassignedStudentsStr]}
            />
            <StudentTeamTable
                title="Admins"
                key="Admins"
                childKey="Admins"
                projectsData={projects}
                semesterData={semesters}
                students={groupings[admins]}
            />
            <StudentTeamTable
                title="Coaches"
                key="Coaches"
                childKey="Coaches"
                projectsData={projects}
                semesterData={semesters}
                students={groupings[coaches]}
            />
            {semesterAccordions?.map(semesterAccordion => {
                return semesterAccordion.accordion
            })}
            <StudentTeamTable
                title="Inactive Students"
                key="Inactive Students"
                childKey="Inactive Students"
                projectsData={projects}
                semesterData={semesters}
                students={groupings[inactive]}
            />
        </>
    );
}
