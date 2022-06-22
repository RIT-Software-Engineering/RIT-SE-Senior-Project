import DatabaseTableEditor from "../../../shared/editors/DatabaseTableEditor";
import {config} from "../../../util/functions/constants";
import React, {useEffect, useState} from "react";
import {SecureFetch} from "../../../util/functions/secureFetch";
import {Modal} from "semantic-ui-react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";

export default function ArchivePanel(props){

    let initialState = {
        featured: props?.project?.featured || "",
        outstanding: props?.project?.outstanding || "",
        creative: props?.project?.creative || "",
        archive_id: props?.project?.archive_id || ""
    }

    let submissionModalMessages = props.create ? {
        SUCCESS: "The archive project has been created.",
        FAIL: "We were unable to add to archive.",
    } : {
        SUCCESS: "The archived project has been Edited.",
        FAIL: "Could not make edits.",
    }

    //TODO JA Make a route to update the archived project.
    let submitRouter = config.url.API_POST_EDIT_ARCHIVE;

    let formFieldArray = [
        {
            type: "checkbox",
            label: "featured",
            placeHolder: "featured",
            name: "featured",
            disabled: false
        },
        {
            type: "checkbox",
            label: "outstanding",
            placeHolder: "outstanding",
            name: "outstanding",
            disabled: false
        },
        {
            type: "checkbox",
            label: "creative",
            placeHolder: "creative",
            name: "creative",
            disabled: false
        }
    ];


    return (
        <DatabaseTableEditor
            initialState={initialState}
            submissionModalMessages={submissionModalMessages}
            submitRoute={submitRouter}
            formFieldArray={formFieldArray}
            header={props.header}
            button={props.buttonIcon || (!!props.create ? "plus" : "edit")}
        />
    );
}