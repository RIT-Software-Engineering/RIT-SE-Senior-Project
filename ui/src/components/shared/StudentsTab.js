import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../util/constants";
import StudentTeamTable from "./StudentTeamTable";
import _ from "lodash";
import { SecureFetch } from "../util/secureFetch";

export default function StudentsTab() {
    const [students, setStudentsData] = useState([]);
    const [semesters, setSemestersData] = useState([]);
    const [projects, setProjectsData] = useState([]);

    const unassignedStudentsStr = "Unassigned students";

    useEffect(() => {
        SecureFetch(config.url.API_GET_STUDENT_INFO)
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
            if (student.semester_id) {
                if (!mappedData[student.semester_id]) {
                    mappedData[student.semester_id] = {
                        projects: { "noProject": { students: [], name: "No Project" } },
                        name: semesterMap[student.semester_id]?.name,
                        start_date: semesterMap[student.semester_id]?.start_date,
                        end_date: semesterMap[student.semester_id]?.end_date,
                        semester_id: semesterMap[student.semester_id]?.semester_id,
                    };
                }
                if (student.project) {
                    if (!mappedData[student.semester_id]["projects"][student.project]) {
                        mappedData[student.semester_id]["projects"][student.project] = {
                            students: [],
                            name: projectMap[student.project]?.display_name || projectMap[student.project]?.title,
                        };
                    }
                    mappedData[student.semester_id]["projects"][student.project]['students'].push(student);
                } else {
                    mappedData[student.semester_id]["projects"]["noProject"]["students"].push(student);
                }
            } else {
                mappedData[unassignedStudentsStr]["students"].push(student);
            }
        });

        return mappedData;
    }

    if (students.length > 0 && semesters.length > 0 && projects.length > 0) {

        let semesterMap = generateMappedData(students, semesters, projects);

        semesterMap = _.sortBy(semesterMap, ["end_date", "start_date", "name"]);

        semesterMap.forEach(semester => {
            if (semester.name === unassignedStudentsStr) {
                semesterPanels.push(
                    <Accordion
                        key={unassignedStudentsStr}
                        fluid
                        styled
                        panels={[{
                            key: unassignedStudentsStr,
                            title: `${semester.name} (${semester.students?.length})`,
                            content: {
                                content:
                                    <StudentTeamTable
                                        key={unassignedStudentsStr}
                                        title={unassignedStudentsStr}
                                        students={semester.students}
                                        semesterData={semesters}
                                        noAccordion
                                        viewOnly
                                    />
                            }
                        }]}
                    />
                )
            } else {
                semesterPanels.push(
                    <Accordion
                        key={semester.semester_id}
                        fluid
                        styled
                        panels={[{
                            key: semester.semester_id,
                            title: `${semester.name} (${Object.keys(semester.projects)?.length})`,
                            content: {
                                content:
                                    Object.keys(semester.projects).map(projectKey => {
                                        return semester.projects[projectKey].students.length > 0 &&
                                            <StudentTeamTable
                                                key={projectKey}
                                                title={semester.projects[projectKey].name}
                                                students={semester.projects[projectKey].students}
                                                semesterData={semesters}
                                                viewOnly
                                            />
                                    })
                            }
                        }]}
                    />
                )
            }
        })
    }

    return semesterPanels.reverse();
}
