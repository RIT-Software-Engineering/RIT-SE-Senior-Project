import React from "react";
import DatabaseTableEditor from "./DatabaseTableEditor";

export default function StudentEditPanel(props) {
    let editProject = props.editProject;

    let initialState = {
        system_id: props.studentData.system_id || "",
        fname: props.studentData.fname || "",
        lname: props.studentData.lname || "",
        email: props.studentData.email || "",
        type: props.studentData.type || "",
        semester_group: props.studentData.semester_group || "",
        project: props.studentData.project || "",
    };

    let submissionModalMessages = {
        SUCCESS: "The student info has been updated.",
        FAIL: "We were unable to receive your update to the student's info.",
    };

    let submitRoute = "http://localhost:3001/db/editUser";

    let formFieldArray = [
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
            label: "Email Address",
            placeHolder: "Email Address",
            name: "email",
        },
        {
            type: "input",
            label: "Semester Group",
            placeHolder: "Semester Group",
            name: "semester_group",
        },
    ];

    if (editProject) {
        formFieldArray.push({
            type: "input",
            label: "Project Id",
            placeHolder: "Project Id",
            name: "project",
        });
    }

    return (
        <DatabaseTableEditor
            initialState={initialState}
            submissionModalMessages={submissionModalMessages}
            submitRoute={submitRoute}
            formFieldArray={formFieldArray}
            semesterData={props.semesterData}
        />
    );
}
