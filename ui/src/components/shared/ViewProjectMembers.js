import React, { useState } from 'react'
import { Button, Icon, Modal, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react'
import { config, USERTYPES } from '../util/constants';
import { SecureFetch } from '../util/secureFetch';

const CLOSE_BUTTON_TEXT = "Done";

export default function ViewProjectMembers(props) {

    const [projectCoaches, setProjectCoaches] = useState(null);

    const fetchProjectCoaches = () => {
        if (!projectCoaches || projectCoaches.length === 0) {
            refresh();
        }
    }

    const refresh = () => {
        let url;
        switch (props.type) {
            case USERTYPES.STUDENT:
                url = config.url.API_GET_PROJECT_STUDENTS
                break;
            case USERTYPES.COACH:
                url = config.url.API_GET_PROJECT_COACHES
                break;

            default:
                console.error(`Unsupported project member type ${props.type}`)
                break;
        }
        SecureFetch(`${url}?project_id=${props.projectId}`)
            .then(response => response.json())
            .then(coaches => {
                setProjectCoaches(coaches);
            })
            .catch(err => {
                console.error("Failed to fetch project coaches", err);
            })
    }

    const content = () => {
        if (projectCoaches === null) {
            return <p>loading...</p>
        }
        else if (projectCoaches.length === 0) {
            return <p>No coaches</p>
        }

        return <Table celled>
            <TableHeader>
                <TableRow>
                    <TableHeaderCell>Coach</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projectCoaches.map(coach => {
                    return <TableRow TableRow key={coach.system_id} >
                        <TableCell>{`${coach.fname} ${coach.lname}`}</TableCell>
                        <TableCell><a href={`mailTo:${coach.email}`}>{coach.email}</a></TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    }

    return (
        <Modal
            trigger={<Button onClick={fetchProjectCoaches} icon={<Icon name="eye" />} />}
            header={`Coaches for '${props.projectName}'`}
            content={{
                content: content()
            }}
            actions={[{ key: "Done", content: CLOSE_BUTTON_TEXT }]}
        />
    )
}
