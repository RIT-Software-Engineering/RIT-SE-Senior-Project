import React, { useState, useEffect } from "react";
import { config } from "../util/constants";
import { formatDateTime } from "../util/utils";
import {
    Button,
    Divider,
    Icon,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from "semantic-ui-react";
import { SecureFetch } from "../util/secureFetch";

// TODO: TO BE RENAMED
export default function TeamFiles() {
    const [actionLogs, setActionLogs] = useState([]);

    useEffect(() => {
        // TODO: Do pagination
        SecureFetch(config.url.API_GET_ACTION_LOGS + "?system_id=admin")
            .then((response) => response.json())
            .then((action_logs) => {
                console.log(action_logs);
                setActionLogs(action_logs);
            })
            .catch((error) => {
                alert("Failed to get team files data " + error);
            });
    }, []);

    const viewSubmissionModal = (action) => {
        const formData = {};
        // const formData = JSON.parse(action.form_data);
        return (
            <Modal
                trigger={
                    <Button icon>
                        <Icon name="eye" />
                    </Button>
                }
                header={"Submission"}
                actions={[{ content: "Done", key: 0 }]}
                content={
                    <div>
                        <h5>Action:</h5> <p>{action.action_title}</p>
                        <h5>Submission Type:</h5> <p>{action.action_target}</p>
                        <h5>Submitted By:</h5> <p>{action.system_id}</p>
                        <h5>Submitted At:</h5> <p>{formatDateTime(action.creation_datetime)}</p>
                        <Divider />
                        <h3>Submission</h3>
                        {Object.keys(formData)?.map((key) => {
                            console.log("key?", key, formData[key]);
                            return (
                                <div>
                                    <h5>{key}:</h5> <p>{formData[key]}</p>
                                </div>
                            );
                        })}
                        {action.files?.split(",").map((file) => {
                            return <><a >{file}</a><br/></>;
                        })}
                    </div>
                }
            />
        );
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Action</TableHeaderCell>
                        <TableHeaderCell>Action Type</TableHeaderCell>
                        <TableHeaderCell>Submitted By</TableHeaderCell>
                        <TableHeaderCell>Submission Time</TableHeaderCell>
                        <TableHeaderCell>Submission</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {actionLogs.map((action, idx) => {
                        return (
                            <TableRow key={idx}>
                                <TableCell>{action.action_title}</TableCell>
                                <TableCell>{action.action_target}</TableCell>
                                <TableCell>{action.system_id}</TableCell>
                                <TableCell>{formatDateTime(action.creation_datetime)}</TableCell>
                                <TableCell>{viewSubmissionModal(action)}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
