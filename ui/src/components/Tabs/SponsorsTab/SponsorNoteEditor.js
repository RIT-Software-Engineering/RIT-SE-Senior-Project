import {useEffect, useState} from "react";
import {SecureFetch} from "../../util/functions/secureFetch";
import {config} from "../../util/functions/constants";
import SponsorNote from "./SponsorNote";
import {Button, Header, Segment} from "semantic-ui-react";
import DatabaseTableEditor from "../../shared/editors/DatabaseTableEditor";

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

    function groupByNewRoot(notesMap){
        let newMap = {}
        for (const noteGroup of Object.keys(notesMap)) {
            if(notesMap[noteGroup].length>0) {
                const reversedGroup = notesMap[noteGroup].reverse()
                const newRoot = reversedGroup[0]
                newMap[newRoot.sponsor_note_id] = reversedGroup
            }
        }
        return newMap
    }

    const getSponsorNotesData = () => {
        SecureFetch(`${config.url.API_GET_SPONSOR_NOTES}/?sponsor_id=${props.sponsor_id}`)
            .then((response) => response.json())
            .then((sponsorNotes) => {
                let initNotesArray = [];
                let notesMap = groupRelatedNotes(sponsorNotes)
                notesMap = groupByNewRoot(notesMap)
                for (const noteGroup of Object.keys(notesMap)){
                    let rootNote = <SponsorNote noEdit note={notesMap[noteGroup][0]}/>
                    if(notesMap[noteGroup].length>1){
                        rootNote = <SponsorNote
                            note={notesMap[noteGroup][0]}
                            isRoot={true}
                            noteGroup={notesMap[noteGroup]}
                            callback={getSponsorNotesData}
                        />
                    }
                    initNotesArray.push(rootNote)
                }

                setNotesArray(initNotesArray.reverse())
            })

    }

    useEffect(() => {
        getSponsorNotesData();
    }, [])

    let initialState = {
        sponsor_id: props.sponsor_id,
    };

    let submissionModalMessages = {
        SUCCESS: "The sponsor note has been created.",
        FAIL: "We were unable to create the sponsor note.",
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

    let newNoteTrigger = <Button content='New Note' icon='add' labelPosition='right' floated='right'/>

    let newNoteComponent = <DatabaseTableEditor
        initialState={initialState}
        submissionModalMessages={submissionModalMessages}
        submitRoute={submitRoute}
        formFieldArray={formFieldArray}
        header={"New Sponsor Note"}
        trigger={newNoteTrigger}
        preSubmit={(data) => {
            data.sponsor_id = props.sponsor_id;
            return data;
        }}
        callback={getSponsorNotesData}
    />

    return(
        <Segment.Group>
            <Segment clearing>
                <Header as='h2' floated={'left'}>
                    Sponsor Notes
                </Header>
                {newNoteComponent}
            </Segment>

            <Segment.Group padded>
                {notesArray}
            </Segment.Group>
        </Segment.Group>
    )

}