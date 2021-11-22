import DatabaseTableEditor from "./DatabaseTableEditor";
import {config} from "../util/constants";
import {useEffect, useState} from "react";
import {SecureFetch} from "../util/secureFetch";

export default function SponsorEditor(props){

    const [sponsorNotes, setSponsorNotes] = useState([]);

    const getSponsorNotesData = () => {
        SecureFetch(`${config.url.API_GET_SPONSOR_NOTES}/?sponsor_id=${props.sponsor.sponsor_id}`)
            .then((response) => response.json())
            .then((sponsors) => {
                setSponsorNotes(sponsors);
                console.log("sponsor notes", sponsors)
            })
            .catch((error) => {
                alert("Failed to get sponsor notes data " + error);
            });
    }

    useEffect(() => {
        getSponsorNotesData();
    }, [])

    let initialState = {
        sponsor_id: props.sponsor.sponsor_id,
        fname: props.sponsor.fname,
        lname: props.sponsor.lname,
        company: props.sponsor.company,
        division: props.sponsor.division,
        email: props.sponsor.email,
        phone: props.sponsor.phone,
        association: props.sponsor.association,
        type: props.sponsor.type
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
            disabled: false
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
        },
        {
            type: "textArea",
            label: "Sponsor Notes",
            placeHolder: "Sponsor Notes",
            name: "note_content",
            disabled: false
        }
    ]

    return (
        <DatabaseTableEditor
            initialState={initialState}
            submissionModalMessages={submissionModalMessages}
            submitRoute={submitRoute}
            formFieldArray={formFieldArray}
            header={props.header}
            button="edit"
            childComponents={<div></div>}
        />
    );
}