import React, {useEffect, useState} from 'react';
import {Accordion} from "semantic-ui-react";

export default function StudentsTab(){
    const [students, setStudentsData] = useState([]);
    const [semesters, setSemestersData] = useState([]);
    const [projects, setProjectsData] = useState([]);


    useEffect(() => {
        fetch("http://localhost:3001/db/selectAllStudentInfo")
            .then((response) => response.json())
            .then((studentsData) => {
                setStudentsData(studentsData);
                console.log('studentsData', studentsData);
            })
            .catch((error) => {
                alert("Failed to get students data" + error);
            });
        fetch("http://localhost:3001/db/getActiveSemesters")
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
                console.log('semestersData', semestersData);
            })
            .catch((error) => {
                alert("Failed to get semestersData data" + error);
            });
        fetch("http://localhost:3001/db/getActiveProjects")
            .then((response) => response.json())
            .then((projectsData) => {
                setProjectsData(projectsData);
                console.log('projectsData', projectsData);
            })
            .catch((error) => {
                alert("Failed to get projectsData" + error);
            });
    }, []);

    let semesterPanels = [];

    function fillInSemesterMap(semesterMap, studentData, semesterData, projectData) {
        for(let i = 0; i < semesterData.length; i ++){
            let semester = semesterData[i];
            if (!semesterMap[semester.name]) { semesterMap[semester.name] = {}; }

        }
        for(let i = 0; i < projectData.length; i ++){
            let project = projectData[i];
            if (!semesterMap[project.name]) { semesterMap[project.name] = {}; }
            if (!semesterMap[project.name][project.project_id]) { semesterMap[project.name][project.project_id] = []; }
        }

        for(let i = 0; i < studentData.length; i ++){
            let student = studentData[i];
            if(student.semester_group){
                if (!semesterMap[student.name]) { semesterMap[student.name] = {}; }

                if(student.project){
                    if (!semesterMap[student.name][student.project]) { semesterMap[student.name][student.project] = []; }
                    semesterMap[student.name][student.project].push(<p>This will be a student component who's name is {student.fname + ' ' + student.lname}</p>);

                }
                else{
                    if (!semesterMap[student.name]['Unassigned students']) { semesterMap[student.name]['Unassigned students'] = []; }
                    semesterMap[student.name]['Unassigned students'].push(<p>This will be a student component who's name is {student.fname + ' ' + student.lname}</p>);
                }

            }
            else{
                if (!semesterMap['Unassigned students']) { semesterMap['Unassigned students'] = []; }
                semesterMap['Unassigned students'].push(<p>This will be a student component who's name is {student.fname + ' ' + student.lname}</p>);

            }
        }
        console.log('semesterMap: ', semesterMap);
        return semesterMap
    }

    if(students && semesters && projects) {
        let semesterMap = {};
        let projectMap = new Map();

        semesterMap = fillInSemesterMap(semesterMap, students, semesters, projects);

        for(let i = 0; i < projects.length; i ++){
            projectMap[projects[i]['project_id']] = projects[i]['team_name'];

        }

        for (const [semesterName, projects] of Object.entries(semesterMap)) {
            if(semesterName){
                let projectPanels = [];

                let val = projects || {};

                for (const [projectId, studentPanels] of Object.entries(val)) {
                    projectPanels.push(
                        <Accordion fluid styled panels={[{
                            key: 'StudentsTab-project-selector-' + projectMap[projectId]||'Unassigned students',
                            title: projectMap[projectId] || 'Unassigned students',
                            content: {content:studentPanels}
                        }]} />
                    );
                }


                semesterPanels.push(
                    <Accordion fluid styled panels={[{
                        key: 'StudentsTab-semester-selector-'+semesterName,
                        title: semesterName,
                        content: {content:projectPanels}
                    }]} />
                )
            }
        }

    }

    return(
        <div>
            {semesterPanels}
        </div>
    );}