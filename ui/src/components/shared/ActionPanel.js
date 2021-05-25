import React from "react";
import DatabaseTableEditor from "./DatabaseTableEditor";
import { config } from "../util/constants";

export default function ActionPanel(props) {
    let initialState = {
        action_id: props.actionData.action_id || "",
        action_title: props.actionData.action_title || "",
        semester: props.actionData.semester || "",
        action_target: props.actionData.action_target || "",
        date_deleted: props.actionData.date_deleted || "",
        short_desc: props.actionData.short_desc || "",
        start_date: props.actionData.start_date || "",
        due_date: props.actionData.due_date || "",
        page_html: props.actionData.page_html || "",
    };

    let submissionModalMessages = props.create ? {
        SUCCESS: "The action has been updated.",
        FAIL: "We were unable to receive your update to the action.",
    } : {
        SUCCESS: "The action has been created.",
        FAIL: "We were unable to receive your action creation.",
    }
        ;

    let semesterMap = {};

    for (let i = 0; i < props.semesterData.length; i++) {
        const semester = props.semesterData[i];
        semesterMap[semester.semester_id] = semester.name;
    }

    let submitRoute = props.create ? config.url.API_POST_CREATE_ACTION : config.url.API_POST_EDIT_ACTION;

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
            options: Object.keys(semesterMap).map((semester_id, idx) => {
                return { key: idx, text: semesterMap[semester_id], value: semester_id };
            }),
            loading: props.semesterData.loading
        },
        {
            type: "input",
            label: "Action Target",
            placeHolder: "Action Target",
            name: "action_target",
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
        {
            type: "input",
            label: "Upload Files",
            placeHolder: "CSV format please - No filetypes = no files uploaded",
            name: "file_types",
        },
        {
            type: "checkbox",
            label: "Archived",
            placeHolder: "Deleted",
            name: "date_deleted",
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
            create={!!props.create}
        />
    );
}
