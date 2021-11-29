import {Button, Segment} from "semantic-ui-react";

export default function SponsorNote(props){

    let modalButton = <div></div>

    if (props.isRoot){
        modalButton = <Button compact>Most recent revision</Button>
    }

    let content = <div>
        {props.note.note_content}
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp; {props.note.creation_date} {props.note.author} {modalButton}
    </div>

    return(
        <Segment>
            {content}
        </Segment>
    )
}