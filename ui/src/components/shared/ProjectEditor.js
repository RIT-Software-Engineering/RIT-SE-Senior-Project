import React, {useState} from 'react';
import { Button, Dropdown, Modal, Input } from 'semantic-ui-react'

const PROJECT_STATUSES = {
    SUBMITTED: "submitted",
    NEEDS_REVISION: "needs revision",
    FUTURE_PROJECT: "future project",
    CANDIDATE: "candidate",
    IN_PROGRESS: "in progress",
    COMPLETE: "completed",
    ARCHIVED: "archive",
}

export default function ProjectEditor(props) {

    const [editedProject, setEditedProject] = useState(props.project);

    const generateModalContent = () => {

        const options = Object.keys(PROJECT_STATUSES).map((status, idx) => {
            return {key:  idx, text: PROJECT_STATUSES[status], value: PROJECT_STATUSES[status]}
        })

        return <>
            {Object.keys(editedProject).map((key) => {
                return <>{`${key}: ${editedProject[key]}`}<br/></>
            })}
            <Dropdown
                selection
                options={options}
                value={editedProject.editedStatus || editedProject.status}
                onChange={(event, change) => {
                    
                }}
            />
            <Input  />
        </>
    }

    const submitProject = (event, target) => {
        fetch('http://localhost:3001/db/editProposal',{
            method: "post",
            body: null,
        }).then((response) => {
            if(response.ok) {
                alert("Success!")
            } else {
                alert("Error...")
            }
        }).catch((error) => {
            // TODO: Redirect to failed page or handle errors
            console.error(error);
        })
    }

    return (
        <Modal
            trigger={<Button icon="edit" />}
            header='Create a project'
            content={{content: generateModalContent()}}
            actions={[{ key: 'submit', content: "Submit", onClick:(event, target) => submitProject(event, target), positive: true }]}
        />
    )
}
