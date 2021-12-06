import {Button, Modal, Segment} from "semantic-ui-react";
import React from "react";
import DatabaseTableEditor from "./DatabaseTableEditor";
import {config} from "../util/constants";

export default function SponsorNote(props){

    let modalButton = <div></div>
    let noteGroup = []

    if (props.isRoot){
        modalButton = <Button compact>Most recent revision</Button>
        for (const note of Object.keys(props.noteGroup)){
            noteGroup.push(<SponsorNote note={props.noteGroup[note]}/>)
        }
    }

    let revisionsModal =
        <Modal
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
        <Segment basic float={'right'}>
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
        </Segment>
    );

    let content = <Segment float={'left'} basic>
        {props.note.note_content}
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp; {props.note.creation_date} {props.note.author} {revisionsModal}
    </Segment>

    if(props.noEdit){
        editNoteComponent = <></>
    }

    return(
        <Segment.Group horizontal>
            {content}
            {editNoteComponent}
        </Segment.Group>
    )
}