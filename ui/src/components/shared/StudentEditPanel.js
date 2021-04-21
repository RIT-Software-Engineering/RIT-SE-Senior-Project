import React from "react";
import { config } from "../util/constants";
import DatabaseTableEditor from "./DatabaseTableEditor";

export default function StudentEditPanel(props) {

    let initialState = {
        system_id: props.studentData.system_id || "",
        fname: props.studentData.fname || "",
        lname: props.studentData.lname || "",
        email: props.studentData.email || "",
        type: props.studentData.type || "",
        semester_group: props.studentData.semester_group || "",
        project_id: props.studentData.project || "",
        active: props.studentData.active || "",
    };

    let submissionModalMessages = {
        SUCCESS: "The student info has been updated.",
        FAIL: "We were unable to receive your update to the student's info.",
    };

    let submitRoute = config.url.API_POST_EDIT_USER;

    let formFieldArray = [
        {
            type: "input",
            label: "User ID",
            placeHolder: "User ID",
            name: "system_id",
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
            type: "input",
            label: "Type (student, coach, admin)",
            placeHolder: "Type",
            name: "type",
            //options: typeOptions.map((str, index) => { return { value: str, key: index + 1};})//this needs to be different, it is not loading properly
        },
        {
            type: "dropdown",
            label: "Semester",
            placeHolder: "Semester",
            name: "semester_group",
            //options: semesterOptions, //this is done the same as in the DatabaseTableEditor, but does not work 
        },
        {
            type: "input",
            label: "Project",
            placeHolder: "Project",
            name: "project",
        },
        {
            type: "checkbox",
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
        />
    );
}
