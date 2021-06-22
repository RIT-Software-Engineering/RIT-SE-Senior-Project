import React, { useState, useEffect } from "react";
import { config } from "../util/constants";
import { formatDateTime } from "../util/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from "semantic-ui-react";
import { SecureFetch } from "../util/secureFetch";
import SubmissionViewerModal from "./SubmissionViewerModal";

// TODO: TO BE RENAMED
export default function TeamFiles() {
    const [actionLogs, setActionLogs] = useState([]);

    useEffect(() => {
        // TODO: Do pagination
        SecureFetch(config.url.API_GET_ACTION_LOGS)
            .then((response) => response.json())
            .then((action_logs) => {
                setActionLogs(action_logs);
            })
            .catch((error) => {
                alert("Failed to get team files data " + error);
            });
    }, []);


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
                                <TableCell>{formatDateTime(action.submission_datetime)}</TableCell>
                                <TableCell><SubmissionViewerModal action={action} /></TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
