import React, { useState } from 'react'
import { ACTION_TARGETS, config } from "../../../../util/functions/constants";
import { Button, Divider, Icon, Modal } from 'semantic-ui-react';
import { formatDateTime, formatDate } from '../../../../util/functions/utils';
import { SecureFetch } from '../../../../util/functions/secureFetch';

export default function SubmissionViewerModal(props) {

    const [open, setOpen] = useState(false);
    const [submission, setSubmission] = useState({});
    const [files, setFiles] = useState([]);
    const [noSubmission, setNoSubmission] = useState(true)
    const [due, setDue] = useState()
    const [late, setLate] = useState(false);
    const [day, setDay] = useState(0)

    const loadSubmission = () => {
        SecureFetch(`${config.url.API_GET_SUBMISSION}?log_id=${props.action?.action_log_id}`)
            .then((response) => response.json())
            .then((submission) => {
                if (submission.length > 0) {
                    const formData = JSON.parse(submission[0].form_data.toString());
                    const fileData = submission[0].files?.split(",");
                    setSubmission(formData);
                    setFiles(fileData);
                    setNoSubmission(formData.length === 0 && files.length === 0);
                }
            })
            .catch((error) => {
                alert("Failed to get action log data " + error);
            });

        SecureFetch(`${config.url.API_GET_LATE_SUBMISSION}?log_id=${props.action?.action_log_id}`)
            .then((response) => response.json())
            .then((dueDate) => {
                let dueDateTime = new Date(dueDate[0].due_date);
                setDue(dueDateTime);
                let submitDate = new Date(props.action.submission_datetime.split(' ')[0].toString());
                setLate(dueDateTime < submitDate);
                if(dueDateTime < submitDate){
                    daysLate(dueDateTime, submitDate)
                }
            })
            .catch((error) => {
                alert("Failed to get due and submission data " + error);
            })
    }

    const noSubmissionText = (target) => {
        switch (target) {
            case ACTION_TARGETS.individual:
                return "Individual Submissions are Not Viewable by Team Members";
            case ACTION_TARGETS.coach:
                return "Coach Submissions are Not Viewable by Team Members";
            case ACTION_TARGETS.admin:
                return "Admin Submissions are Not Viewable by Team Members";
            default:
                return "You can not view this submission"
        }
    }

    const daysLate = (due, submitted) => {
        const dueDate  = formatDate(due);
        const submitDate    = formatDate(submitted);
        const diffInMs   = new Date(submitDate) - new Date(dueDate)
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        setDay(diffInDays);
    }

    return (
        <Modal
            onClose={() => {
                setOpen(false);
                props?.isOpenCallback(false);
            }}
            onOpen={() => {
                setOpen(true);
                props?.isOpenCallback(true);
            }}
            open={open}
            trigger={
                <div onClick={loadSubmission}>
                    {props.trigger || <Button icon>
                        <Icon name="eye" />
                    </Button>}
                </div>
            }
            header={`Submission for ${props.action.action_title} (${props.target[0]?.toUpperCase()}${props.target?.substring(1)} Action)`}
            actions={[{ content: "Close", key: 0 }]}
            content={{
                content: <div>
                    <p><b>Semester/Project:</b> {props.semesterName} - {props.projectName}</p>
                    <p><b>Submitted:</b>
                        {props.action.mock_id && `${props.action.mock_name} (${props.action.mock_id}) as `}
                        {`${props.action.name} (${props.action.system_id}) `}
                        {formatDateTime(props.action.submission_datetime)}
                        {` (Due ${formatDate(due)})`}
                        {late && ` ${day} days' late`}
                    </p>
                    <Divider />
                    <h3>Submission</h3>
                    {(props.noSubmission || noSubmission) && <p>{noSubmissionText(props.target)}</p>}
                    {!props.noSubmission && <>
                        {Object.keys(submission)?.map((key) => {
                            return (
                                <div key={key}>
                                    <p><b>{key}:</b> {submission[key]}</p>
                                </div>
                            );
                        })}
                        {files?.map((file) => {
                            return <div key={file}>
                                <a
                                    href={`${config.url.API_GET_SUBMISSION_FILE}?file=${file}&log_id=${props.action?.action_log_id}&project=${props.action?.project}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {file.replace(/^[^/]*\/(.*)$/, "$1")}
                                </a>
                                <br />
                            </div>;
                        })}
                    </>}
                </div>
            }}
        />
    );
}
