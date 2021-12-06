import DatabaseTableEditor from "./DatabaseTableEditor";
import {config} from "../util/constants";
import SponsorNoteEditor from "./SponsorNoteEditor";

export default function SponsorEditor(props){

    let initialState = {
        sponsor_id: props.sponsor.sponsor_id,
        fname: props.sponsor.fname,
        lname: props.sponsor.lname,
        company: props.sponsor.company,
        division: props.sponsor.division,
        email: props.sponsor.email,
        phone: props.sponsor.phone,
        association: props.sponsor.association,
        type: props.sponsor.type,
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
            childComponents={<SponsorNoteEditor sponsor_id={props.sponsor.sponsor_id}/>}
            callback={props.callback}
        />
    );
}