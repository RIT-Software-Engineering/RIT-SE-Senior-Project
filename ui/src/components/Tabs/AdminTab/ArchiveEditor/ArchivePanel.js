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
        archive_id: props?.project?.archive_id || "",
        project_id: props?.project?.project_id || "",
        title: props?.project?.title || "",
        team_name: props?.project?.team_name || "",
        members: props?.project?.members || "",
        sponsor: props?.project?.sponsor || "",
        coach: props?.project?.coach || "",
        poster_thumb: props?.project?.poster_thumb || "",
        poster_full: props?.project?.poster_full || "",
        synopsis: props?.project?.synopsis || "",
        video: props?.project?.video || "",
        name: props?.project?.name || "",
        dept: props?.project?.dept || "",
        start_date: props?.project?.start_date || "",
        end_date: props?.project?.end_date || "",
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
            type: "input",
            label: "Project ID",
            placeHolder: "Project ID",
            name: "project_id",
            disabled: true
        },
        {
            type: "input",
            label: "Archive Project Title",
            placeHolder: "Archive Project Title",
            name: "title",
        },
        {
            type: "input",
            label: "Team Name",
            placeHolder: "Team Name",
            name: "team_name"
        },
        {
            type: "input",
            label: "Members",
            placeHolder: "Members",
            name: "members"
        },
        {
            type: "input",
            label: "Sponsor",
            placeHolder: "Sponsor",
            name: "sponsor"
        },
        {
            type: "input",
            label: "Coach",
            placeHolder: "Coach",
            name: "coach"
        },
        {
            type: "input",
            label: "Poster Thumb",
            placeHolder: "Poster Thumb",
            name: "poster_thumb"
        },
        {
            type: "input",
            label: "Poster Full",
            placeHolder: "Poster Full",
            name: "poster_full"
        },
        {
            type: "input",
            label: "Synopsis",
            placeHolder: "Synopsis",
            name: "synopsis"
        },
        {
            type: "input",
            label: "Video",
            placeHolder: "Video",
            name: "video"
        },
        {
            type: "input",
            label: "Name",
            placeHolder: "Name",
            name: "name"
        },
        {
            type: "input",
            label: "Department",
            placeHolder: "Department",
            name: "dept"
        },
        {
            type: "date",
            label: "Start Date",
            placeHolder: "Start Date",
            name: "start_date"
        },
        {
            type: "date",
            label: "End Date",
            placeHolder: "End Date",
            name: "end_date"
        },
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