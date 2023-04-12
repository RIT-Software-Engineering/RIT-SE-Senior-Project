import React from "react";
import { config } from "../../util/functions/constants";
import DatabaseTableEditor from "../../shared/editors/DatabaseTableEditor";

export default function TimeLogPanel(props) {
    let initialState = {};

    let submissionModalMessages = {
        SUCCESS: "The time log has been removed.",
        FAIL: "We were unable to delete the log.",
    };

    let submitRoute = initialState.time_log_id === config.url.API_POST_CREATE_TIME_LOG;

    let formFieldArray = [];

    return (
        <DatabaseTableEditor
            initialState={initialState}
            submissionModalMessages={submissionModalMessages}
            header={props.header}
            submitRoute={submitRoute}
            formFieldArray={formFieldArray}
            create={initialState.time_log_id === ""}
            button="trash"
        />
    );
}
