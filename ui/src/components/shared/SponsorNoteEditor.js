import {useEffect, useState} from "react";
import {SecureFetch} from "../util/secureFetch";
import {config} from "../util/constants";
import SponsorNote from "./SponsorNote";
import {Header, Segment} from "semantic-ui-react";

export default function SponsorNoteEditor(props){
    const [notesArray, setNotesArray] = useState([]);

    function groupRelatedNotes(notes){
        let noteMap = {}
        let noteMapWithPreviousNotes = {}

        for(const note of notes) {
            noteMap[note.sponsor_note_id] = note
        }

        for(const note of notes){
            if(!noteMapWithPreviousNotes.hasOwnProperty(note.sponsor_note_id)){
                noteMapWithPreviousNotes[note.sponsor_note_id] = []
            }

            if(note.previous_note === null){
                noteMapWithPreviousNotes[note.sponsor_note_id].push(note)
            }
            else{
                let currentNote = note
                while(currentNote.previous_note !== null){
                    currentNote = noteMap[currentNote.previous_note]
                }
                noteMapWithPreviousNotes[currentNote.sponsor_note_id].push(note)
            }
        }
        return noteMapWithPreviousNotes
    }

    const getSponsorNotesData = () => {
        SecureFetch(`${config.url.API_GET_SPONSOR_NOTES}/?sponsor_id=${props.sponsor_id}`)
            .then((response) => response.json())
            .then((sponsorNotes) => {
                let initNotesArray = [];
                const notesMap = groupRelatedNotes(sponsorNotes)
                for (const noteGroup of Object.keys(notesMap)){
                    if(notesMap[noteGroup].length>0){
                        let noteAccordionContent = []
                        console.log("notesMap", notesMap)
                        for (const note of notesMap[noteGroup]){
                            noteAccordionContent.push(<SponsorNote note={note}/>)
                        }
                        initNotesArray.push(noteAccordionContent)
                    }
                }

                setNotesArray(initNotesArray)
            })

    }

    useEffect(() => {
        getSponsorNotesData();
    }, [])

    return(
        <Segment.Group>
            <Segment>
                <Header as='h4'>
                    Sponsor Notes
                </Header>
            </Segment>

            <Segment.Group padded>
                {notesArray}
            </Segment.Group>
        </Segment.Group>
    )

}