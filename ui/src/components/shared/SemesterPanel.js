import React from "react";
import DatabaseTableEditor from "./DatabaseTableEditor";

export default function SemesterPanel(props) {
    let initialState = {
        semester_id: props.semester.semester_id || "",
        name: props.semester.name || "",
        dept: props.semester.dept || "",
        start_date: props.semester.start_date || "",
        end_date: props.semester.end_date || "",
    };

    let submissionModalMessages = {
        SUCCESS: "The semester has been updated.",
        FAIL: "We were unable to receive your update to the semester.",
    };

    let submitRoute = "http://localhost:3001/db/editSemester";

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
            type: "input",
            label: "Start Date",
            placeHolder: "Start Date",
            name: "start_date",
        },
        {
            type: "input",
            label: "End Date",
            placeHolder: "End Date",
            name: "end_date",
        },
    ];

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
