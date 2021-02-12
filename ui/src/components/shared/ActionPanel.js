import React from "react";
import DatabaseTableEditor from "./DatabaseTableEditor";
import { config } from "../util/constants";

export default function ActionPanel(props) {
    let initialState = {
        action_id: props.actionData.action_id || "",
        action_title: props.actionData.action_title || "",
        semester: props.actionData.semester || "",
        action_target: props.actionData.action_target || "",
        is_null: props.actionData.is_null || "",
        short_desc: props.actionData.short_desc || "",
        start_date: props.actionData.start_date || "",
        due_date: props.actionData.due_date || "",
        page_html: props.actionData.page_html || "",
    };

    let submissionModalMessages = {
        SUCCESS: "The action has been updated.",
        FAIL: "We were unable to receive your update to the action.",
    };

    let submitRoute = config.url.API_POST_EDIT_ACTION;

    let formFieldArray = [
        {
            type: "input",
            label: "Action Title",
            placeHolder: "Action Title",
            name: "action_title",
        },
        {
            type: "dropdown",
            label: "Semester",
            placeHolder: "Semester",
            name: "semester",
        },
        {
            type: "input",
            label: "Action Target",
            placeHolder: "Action Target",
            name: "action_target",
        },
        {
            type: "input",
            label: "Is Null",
            placeHolder: "Is Null",
            name: "is_null",
        },
        {
            type: "input",
            label: "Short Desc",
            placeHolder: "Short Desc",
            name: "short_desc",
        },
        {
            type: "date",
            label: "Start Date",
            placeHolder: "Start Date",
            name: "start_date",
        },
        {
            type: "date",
            label: "Due Date",
            placeHolder: "Due Date",
            name: "due_date",
        },
        {
            type: "textArea",
            label: "Page Html",
            placeHolder: "Page Html",
            name: "page_html",
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
