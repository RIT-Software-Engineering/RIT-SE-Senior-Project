import React, { useState } from 'react'
import { Button, Icon, Modal, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react'
import { config, USERTYPES } from '../../util/functions/constants';
import { SecureFetch } from '../../util/functions/secureFetch';

const CLOSE_BUTTON_TEXT = "Close";

export default function ViewProjectMembers(props) {

    const [projectUsers, setProjectUsers] = useState(null);
    const [userType, setUserType] = useState(null);


    const fetchProjectCoaches = () => {
        if (!projectUsers || projectUsers.length === 0) {
            refresh();
        }
    }

    const refresh = () => {
        let url;
        switch (props.type) {
            case USERTYPES.STUDENT:
                url = config.url.API_GET_PROJECT_STUDENTS;
                setUserType("Students");
                break;
            case USERTYPES.COACH:
                url = config.url.API_GET_PROJECT_COACHES;
                setUserType("Coaches");
                break;

            default:
                console.error(`Unsupported project member type ${props.type}`)
                break;
        }
        SecureFetch(`${url}?project_id=${props.projectId}`)
            .then(response => response.json())
            .then(coaches => {
                setProjectUsers(coaches);
            })
            .catch(err => {
                console.error("Failed to fetch project coaches", err);
            })
    }

    const content = () => {
        if (projectUsers === null) {
            return <p>loading...</p>
        }
        else if (projectUsers.length === 0) {
            return <p>No Users</p>
        }

        return <Table celled>
            <TableHeader>
                <TableRow>
                    <TableHeaderCell>{userType === 'Coaches'?'Coach':'Student'}</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projectUsers.map(user => {
                    return <TableRow TableRow key={user.system_id} >
                        <TableCell>{`${user.fname} ${user.lname}`}</TableCell>
                        <TableCell><a href={`mailTo:${user.email}`}>{user.email}</a></TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    }

    return (
        <Modal
            className={"sticky"}
            trigger={<Button onClick={fetchProjectCoaches} icon={<Icon name="eye" />} />}
            header={`${userType} for '${props.projectName}'`}
            content={{
                content: content()
            }}
            actions={[{ key: "Close", content: CLOSE_BUTTON_TEXT }]}
        />
    )
}
