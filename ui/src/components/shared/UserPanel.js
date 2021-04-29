import React from "react";
import DatabaseTableEditor from "./DatabaseTableEditor";
import { config } from "../util/constants";

export default function UserPanel(props) {

    let initialState = {
        system_id: props.userData?.system_id || "",
        fname: props.userData?.fname || "",
        lname: props.userData?.lname || "",
        email: props.userData?.email || "",
        type: props.userData?.type || "",
        semester_group: props.userData?.semester_group || "",
        project: props.userData?.project || "",
        active: props.userData?.active || "",
    };


    let submissionModalMessages = {
        SUCCESS: "The user has been updated.",
        FAIL: "Error updating the user.",
    };

    let submitRoute = config.url.API_POST_EDIT_USER;

    if (initialState.system_id == "") {
        submitRoute = config.url.API_POST_CREATE_USER;
    }

    let semesterMap = {}; //create a map of semesters
    for (let i = 0; i < props.semesterData.length; i++) {
        const semester = props.semesterData[i];
        semesterMap[semester.semester_id] = semester.name;
    }

    let semesterOptions = {}//options to be mapped for semesters
    semesterOptions = Object.keys(semesterMap).map((semester_id, idx) => {
        return { key: idx, text: semesterMap[semester_id], value: semester_id };
    });

    let typeOptions = ["student", "coach", "admin"];

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
            //TODO: send json of the options and make this a dropdown
            type: "input",
            label: "User Type (student, coach, admin)",
            placeHolder: "Type",
            name: "type",
            //options: typeOptions.map((str, index) => { return { value: str, key: index + 1};})//this needs to be different, it is not loading properly
        },
        {
            //TODO: send json of the options and make this a dropdown that isn't hardcoded in DatabaseTableEditor
            type: "dropdown",
            label: "Semester",
            placeHolder: "Semester",
            name: "semester_group",
            //options: semesterOptions, //this is done the same as in the DatabaseTableEditor, but does not work 
        },
        {
            //TODO: send json of the options and make this a dropdown
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
