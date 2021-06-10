import React from "react";
import _ from "lodash";
import { config, USERTYPES } from "../util/constants";
import DatabaseTableEditor from "./DatabaseTableEditor";

export default function StudentEditPanel(props) {

    let idx = 0;
    let semesterProjectDropdownMap = [{ semester: null, project: null }];
    let semesterProjectDropdownOptions = [{ key: "No Project/Semester", text: "No Project/Semester", value: idx++ }]

    // Have to do this mapping because you can't set the value of a dropdown to an object.
    let visited = {}
    _.sortBy(props.projectsData, ["end_date", "start_date"]).reverse()
        ?.forEach((semesterProject) => {
            if (!visited[semesterProject.semester_id]) {
                visited[semesterProject.semester_id] = true;
                semesterProjectDropdownMap.push({
                    semester: semesterProject.semester_id
                })
                semesterProjectDropdownOptions.push({
                    key: `${semesterProject.semester_id}`,
                    text: `${semesterProject.name} - No Semester`,
                    value: idx++,
                })
            }
            semesterProjectDropdownMap.push({ semester: semesterProject.semester_id, project: semesterProject.project_id })
            semesterProjectDropdownOptions.push({
                key: `${semesterProject.semester_id} - ${semesterProject.project_id}`,
                text: `${semesterProject.name} - ${semesterProject.display_name || semesterProject.title}`,
                value: idx++,
            })
        });

    let initialState = {
        system_id: props.studentData.system_id || "",
        fname: props.studentData.fname || "",
        lname: props.studentData.lname || "",
        email: props.studentData.email || "",
        type: props.studentData.type || "",
        active: props.studentData.active || "",
        semesterProject: _.findIndex(semesterProjectDropdownMap, { 'semester': props.studentData.semester_group, 'project': props.studentData.project }),
    };

    let submissionModalMessages = {
        SUCCESS: "The student info has been updated.",
        FAIL: "We were unable to receive your update to the student's info.",
    };

    let semesterMap = {};

    for (let i = 0; i < props.semesterData.length; i++) {
        const semester = props.semesterData[i];
        semesterMap[semester.semester_id] = semester.name;
    }

    let submitRoute = config.url.API_POST_EDIT_USER;

    let formFieldArray = [
        {
            type: "input",
            label: "User ID",
            placeHolder: "User ID",
            name: "system_id",
            disabled: true
        },
        {
            type: "input",
            label: "First Name",
            placeHolder: "First Name",
            name: "fname",
        },
        {
            type: "input",
            label: "Last Name",
            placeHolder: "Last Name",
            name: "lname",
        },
        {
            type: "input",
            label: "Email",
            placeHolder: "Email",
            name: "email",
        },
        {
            type: "dropdown",
            label: "Type (student, coach, admin)",
            placeHolder: "Type",
            name: "type",
            options: Object.values(USERTYPES).map((type, idx) => { return { key: idx, text: type, value: type } })
        },
        {
            type: "dropdown",
            label: "Semester/Project",
            placeHolder: "Semester/Project",
            name: "semesterProject",
            options: semesterProjectDropdownOptions,
        },
        {
            type: "activeCheckbox",
            label: "Active",
            placeHolder: "Active",
            name: "active",
        },
    ];

    return (
        <DatabaseTableEditor
            initialState={initialState}
            submissionModalMessages={submissionModalMessages}
            submitRoute={submitRoute}
            formFieldArray={formFieldArray}
            semesterData={props.semesterData}
            header={props.header}
            button="edit"
            preSubmit={(data) => {
                data.semester_group = semesterProjectDropdownMap[data.semesterProject].semester;
                data.project = semesterProjectDropdownMap[data.semesterProject].project;
                return data;
            }}
        />
    );
}
