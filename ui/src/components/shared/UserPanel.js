import React from "react";
import DatabaseTableEditor from "./DatabaseTableEditor";
import { config } from "../util/constants";

export default function UserPanel(props) {
    let initialState = {
        user_id: "",
    }
    if (typeof(props.userData) != 'undefined') {
            initialState = {
            system_id: props.userData.system_id | "",
            fname: props.userData.fname | "",
            lname: props.userData.lname | "",
            email: props.userData.email | "",
            type: props.userData.type | "",
            semester_group: props.userData.semester_group | "",
            project: props.userData.project | "",
            active: props.userData.active | "",
        };
    }

    let submissionModalMessages = {
        SUCCESS: "The user has been updated.",
        FAIL: "Error updating the user.",
    };

    let submitRoute = config.url.API_POST_EDIT_USER;

    if (initialState.user_id == "") {
        submitRoute = config.url.API_POST_CREATE_USER;
    }


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
            name: "lanme",
        },
        {
            type: "input",
            label: "Email",
            placeHolder: "Email",
            name: "email",
        },
        {
            type: "dropdown",
            label: "Type",
            placeHolder: "Type",
            name: "type",
        },
        {
            type: "dropdown",
            label: "Semester",
            placeHolder: "Semester",
            name: "semester_group",
        },
        {
            type: "dropdown",
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
