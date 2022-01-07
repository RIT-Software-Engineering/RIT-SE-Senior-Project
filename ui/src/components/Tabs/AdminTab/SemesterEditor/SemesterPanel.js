import React from "react";
import { config } from "../../../util/functions/constants";
import DatabaseTableEditor from "../../../shared/editors/DatabaseTableEditor";

export default function SemesterPanel(props) {
    let initialState = {
        semester_id: props.semester?.semester_id || "",
        name: props.semester?.name || "",
        dept: props.semester?.dept || "",
        start_date: props.semester?.start_date || "",
        end_date: props.semester?.end_date || "",
    };

    let submissionModalMessages = {
        SUCCESS: "The semester has been updated.",
        FAIL: "We were unable to receive your update to the semester.",
    };

    let submitRoute = initialState.semester_id === "" ? config.url.API_POST_CREATE_SEMESTER : config.url.API_POST_EDIT_SEMESTER;

    let formFieldArray = [
        {
            type: "input",
            label: "Semester Name",
            placeHolder: "Semester Name",
            name: "name",
        },
        {
            type: "input",
            label: "Department",
            placeHolder: "Department",
            name: "dept",
        },
        {
            type: "date",
            label: "Start Date",
            placeHolder: "Start Date",
            name: "start_date",
        },
        {
            type: "date",
            label: "End Date",
            placeHolder: "End Date",
            name: "end_date",
        },
    ];

    return (
        <DatabaseTableEditor
            initialState={initialState}
            submissionModalMessages={submissionModalMessages}
            header={props.header}
            submitRoute={submitRoute}
            formFieldArray={formFieldArray}
            create={initialState.semester_id === ""}
            button={initialState.semester_id === "" ? "plus" : "edit"}
        />
    );
}
