import {Segment} from "semantic-ui-react";

export default function SponsorNote(props){

    return(
        <Segment>
            {props.note.note_content}
        </Segment>
    )
}