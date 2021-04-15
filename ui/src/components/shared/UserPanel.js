import React from "react";
import DatabaseTableEditor from "./DatabaseTableEditor";
import { config } from "../util/constants";

export default function UserPanel(props) {
    let initialState = {
        user_id: props.userData.user_id || "",
    };

    let submissionModalMessages = {
        SUCCESS: "The action has been updated.",
        FAIL: "We were unable to receive your update to the action.",
    };

    let submitRoute = config.url.API_POST_EDIT_ACTION;

    let formFieldArray = [
        {
            type: "input",
            label: "User ID",
            placeHolder: "User ID",
            name: "User ID",
        },

    ];

    return false/*(
        <DatabaseTableEditor
            initialState={initialState}
            submissionModalMessages={submissionModalMessages}
            submitRoute={submitRoute}
            formFieldArray={formFieldArray}
            header={props.header}
        />
    )*/;
}
