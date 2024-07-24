import React, {useContext, useState} from 'react'

import {Button, Divider, Icon, Modal, ModalActions} from 'semantic-ui-react';
import {formatDate, formatDateTime} from "../../util/functions/utils";
import {SecureFetch} from "../../util/functions/secureFetch";
import InnerHTML from "dangerously-set-html-content";
import {UserContext} from "../../util/functions/UserContext";
import { config } from "../../util/functions/constants";


export default function IndividualTimeModal(props) {

    const [open, setOpen] = useState(false);
    const [submission, setSubmission] = useState({});
    const [files, setFiles] = useState([]);
    const [noSubmission, setNoSubmission] = useState(true)
    const [due, setDue] = useState()
    const [late, setLate] = useState(false);
    const [day, setDay] = useState(0)
    const { user } = useContext(UserContext);

    const handleDelete = function (e) {
        let body = new FormData();
        body.append("id", e);

        SecureFetch(config.url.API_DELETE_TIME_LOG, {
            method: "POST",
            body: body,
        }).catch((e) => {
          alert("There was an error deleting the time log.")
        }).finally((_) => {
          props.resetKey()
          onClose()
        })
    };

    const deleteButton =  <Button
            content={ "Delete"}
            labelPosition="right"
            icon="x"
            negative

            onClick={() => handleDelete(props.id)}
        />

    const onClose = (page) => {
                setOpen(false)
            }
    return (
        <Modal

            className={"sticky"}

            onOpen={() => {
                setOpen(true);

            }}
            open={open}
            trigger={
                <div >
                    {props.trigger || <Button icon>

                        <Icon name="eye" />
                    </Button>}
                </div>
            }
        >
        <Modal.Header>Time Submission For {props.user}</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <p>
                        <b>Semester/Project:</b> {props.semesterName} - {props.projectName}
                    </p>
                    <p>
                        <b>Date of Work:</b> {formatDate(props.timeLog.work_date)}
                    </p>
                    <p>
                        <b>Total Hours:</b> {props.timeLog.time_amount}
                    </p>
                    <p>
                        <b>Comment:</b> {props.timeLog.work_comment}
                    </p>
                    {/*{avgTime[idx] !== undefined ? Math.floor(avgTime[idx].avgTime) : 0}*/}
                    <p>
                        <b>Submission Date:</b> {formatDateTime(props.timeLog.submission_datetime)}
                    </p>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                { props.userId === user.user && props.delete === 1? deleteButton: ""}
                <Button onClick={() =>  onClose()}>
                    Close
                </Button>

            </Modal.Actions>
        </Modal>
);
}
