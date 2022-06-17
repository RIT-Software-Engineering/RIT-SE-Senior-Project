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
        creative: props?.project?.creative || ""
    }

    let submissionModalMessages = {
        SUCCESS: "The archive data has been updated.",
        FAIL: "We were unable to receive your update to the archived project.",
    };

    //TODO JA Make a route to update the archived project.
    let submitRouter = "";

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

    let trigger = <Button icon {"edit"} />;
}