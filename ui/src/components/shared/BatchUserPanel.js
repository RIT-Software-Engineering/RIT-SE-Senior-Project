import React, { useState } from 'react'
import { Button, Form, Modal, Table } from 'semantic-ui-react'
import CSV from 'comma-separated-values'
import { SecureFetch } from '../util/secureFetch'
import { config } from "../util/constants";

export default function BatchUserPanel() {

    const [users, setUsers] = useState([])

    const onFileUpload = (event) => {
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0]);
        fileReader.onload = ((output) => {
            const csv = new CSV(output.target.result, { header: true })
            setUsers(csv.parse());
        })
    }

    const uploadBatchUsers = (e) => {

        let body = new FormData();
        body.append("users", JSON.stringify(users));

        SecureFetch(config.url.API_POST_BATCH_CREAT_USER, {
            method: "post",
            body: body,
        })
    }

    const generateUsers = () => {
        if (users.length) {
            return <>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>system_id</Table.HeaderCell>
                            <Table.HeaderCell>fname</Table.HeaderCell>
                            <Table.HeaderCell>lname</Table.HeaderCell>
                            <Table.HeaderCell>email</Table.HeaderCell>
                            <Table.HeaderCell>type</Table.HeaderCell>
                            <Table.HeaderCell>semester_group</Table.HeaderCell>
                            <Table.HeaderCell>project</Table.HeaderCell>
                            <Table.HeaderCell>active</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {users.map((user, idx) => {
                            return <Table.Row key={idx}>
                                {Object.keys(user).map(key => <Table.Cell>{user[key]}</Table.Cell>)}
                            </Table.Row>
                        })}
                    </Table.Body>
                </Table>
                <Button onClick={uploadBatchUsers}>Upload</Button>
            </>
        }
        return <>No users uploaded yet</>
    }

    let modalContent = <Form>
        <input type="file" onChange={onFileUpload} />
        {generateUsers()}
    </Form>

    return (
        <Modal
            trigger={<Button icon="upload" />}
            header="Upload users (Untested for large number of users)"
            content={{ content: modalContent }}
        />
    )
}
