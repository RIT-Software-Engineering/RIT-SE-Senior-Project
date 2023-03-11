import {Button, Modal, Segment} from "semantic-ui-react";
import React from "react";
import DatabaseTableEditor from "../../shared/editors/DatabaseTableEditor";
import {config} from "../../util/functions/constants";

export default function SponsorNote(props){

    let modalButton = <div></div>
    let noteGroup = []

    if (props.isRoot && !props.revisionsView){
        modalButton = <Button compact>Most recent revision</Button>
        for (const note of Object.keys(props.noteGroup)){
            noteGroup.push(<SponsorNote revisionsView note={props.noteGroup[note]}/>)
        }
    }

    let revisionsModal =
        <Modal className={"sticky"}
            trigger={modalButton}
            header={"Sponsor Note Revisions"}
            content={{ content:
                    <Segment.Group>
                        {noteGroup}
                    </Segment.Group>
            }}
            actions={[{
                key: "Close",
                content: "Close",
            }]}
        />

    let initialState = {
        sponsor_id: props.note.sponsor_id,
        note_content: props.note.note_content
    };

    let submissionModalMessages = {
        SUCCESS: "The sponsor note has been updated.",
        FAIL: "We were unable to update the sponsor note.",
    };

    let submitRoute = config.url.API_POST_CREATE_SPONSOR_NOTE;

    let formFieldArray = [
        {
            type: "textArea",
            label: "Sponsor Note Content",
            placeHolder: "Sponsor Note Content",
            name: "note_content",
            disabled: false
        }
    ]

    let noteEditTrigger = <Button icon='edit' floated='right'/>

    let editNoteComponent = (
        <div className={"sponsor-note-actions"}>
            {revisionsModal}
            <DatabaseTableEditor
                initialState={initialState}
                submissionModalMessages={submissionModalMessages}
                submitRoute={submitRoute}
                formFieldArray={formFieldArray}
                header={"Edit Sponsor Note"}
                trigger={noteEditTrigger}
                preSubmit={(data) => {
                    data.sponsor_id = props.note.sponsor;
                    data.previous_note = props.note.previous_note;
                    return data;
                }}
                callback={props.callback}
            />
        </div>
    );

    let content = <Segment float={'left'} basic>
        <h5>{props.note.fname} {props.note.lname}, &nbsp;{props.note.email}, &nbsp;{props.note.creation_date}</h5>
        {props.note.note_content}
        <br/>
    </Segment>

    if(props.noEdit || props.revisionsView){
        editNoteComponent = <></>
    }

    return(
        <Segment.Group horizontal>
            {content}
            {editNoteComponent}
        </Segment.Group>
    )
}