import {Button, Modal, Segment} from "semantic-ui-react";
import React from "react";

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

    let content = <div>
        {props.note.note_content}
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp; {props.note.creation_date} {props.note.author} {revisionsModal}
    </div>

    return(
        <Segment>
            {content}
        </Segment>
    )
}