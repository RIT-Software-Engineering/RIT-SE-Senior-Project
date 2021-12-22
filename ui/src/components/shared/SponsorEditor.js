import DatabaseTableEditor from "./DatabaseTableEditor";
import {config} from "../util/constants";
import SponsorNoteEditor from "./SponsorNoteEditor";
import {Modal} from "semantic-ui-react";
import React from "react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";

export default function SponsorEditor(props){

    let initialState = {
        sponsor_id: props?.sponsor?.sponsor_id || "",
        fname: props?.sponsor?.fname || "",
        lname: props?.sponsor?.lname || "",
        company: props?.sponsor?.company || "",
        division: props?.sponsor?.division || "",
        email: props?.sponsor?.email || "",
        phone: props?.sponsor?.phone || "",
        association: props?.sponsor?.association || "",
        type: props?.sponsor?.type || "",
        changed_fields: {}
    };

    let submissionModalMessages = {
        SUCCESS: "The sponsor info has been updated.",
        FAIL: "We were unable to receive your update to the sponsor's info.",
    };

    let submitRoute = config.url.API_POST_EDIT_SPONSOR;

    let formFieldArray = [
        {
            type: "input",
            label: "Sponsor ID",
            placeHolder: "Sponsor ID",
            name: "sponsor_id",
            disabled: !initialState.sponsor_id
        },
        {
            type: "input",
            label: "First Name",
            placeHolder: "First Name",
            name: "fname",
            disabled: false
        },
        {
            type: "input",
            label: "Last Name",
            placeHolder: "Last Name",
            name: "lname",
            disabled: false
        },
        {
            type: "input",
            label: "Sponsor's Company",
            placeHolder: "Sponsor's Company",
            name: "company",
            disabled: false
        },
        {
            type: "input",
            label: "Sponsor's Division",
            placeHolder: "Sponsor's Division",
            name: "division",
            disabled: false
        },
        {
            type: "input",
            label: "Email",
            placeHolder: "Email",
            name: "email",
            disabled: false
        },
        {
            type: "input",
            label: "Phone Number",
            placeHolder: "Phone Number",
            name: "phone",
            disabled: false
        },
        {
            type: "input",
            label: "Association",
            placeHolder: "Association",
            name: "association",
            disabled: false
        },
        {
            type: "input",
            label: "Type",
            placeHolder: "Type",
            name: "type",
            disabled: false
        }
    ]

    let noteEditor = (<SponsorNoteEditor sponsor_id={props?.sponsor?.sponsor_id || ""}/>);

    let trigger = <Button icon={"edit"} />;

    if (initialState.sponsor_id === "") {
        submitRoute = config.url.API_POST_CREATE_SPONSOR;
        trigger = <Button icon={"plus"} />
        noteEditor = <></>
        submissionModalMessages = {
            SUCCESS: "The sponsor has been created.",
            FAIL: "We were unable to create the sponsor.",
        }
    }

    let editor = (
        <DatabaseTableEditor
            initialState={initialState}
            submissionModalMessages={submissionModalMessages}
            submitRoute={submitRoute}
            formFieldArray={formFieldArray}
            header={props.header}
            trigger={trigger}
            childComponents={noteEditor}
            callback={props.callback}
        />
    );

    const modalActions = () => {
        return [
            {
                key: "Close",
                content: "Close",
            },
        ]
    }


    let name = `${initialState.fname} ${initialState.lname}`;
    let compAndDiv = `${initialState.company} `
    if(initialState.division !== null){
        compAndDiv += ("("+ initialState?.division + ")")
    }

    const generateSponsorSummary = () => {
        return <div>
            <h3>Sponsor Info</h3>
            <b>Name:</b> {name} <br />
            <b>Company and Division:</b> {compAndDiv} <br />
            <b>Email:</b> {initialState.email} <br />
            <b>Phone:</b> {initialState.phone} <br />
            <b>Association:</b> {initialState.association} <br />
            <b>Type:</b> {initialState.type} <br />
        </div>
    };

    if(props.summaryView){
        editor = <Modal
            trigger={trigger}
            header={"Sponsor Summary View"}
            content={{ content:
                    <div>
                        {generateSponsorSummary()}
                        {noteEditor}
                    </div>
            }}
            actions={modalActions()}
        />
    }

    return editor;
}