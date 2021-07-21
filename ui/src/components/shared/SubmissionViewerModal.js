import React, { useState } from 'react'
import { ACTION_TARGETS, config } from "../util/constants";
import { Button, Divider, Icon, Modal } from 'semantic-ui-react';
import { formatDateTime } from '../util/utils';
import { SecureFetch } from '../util/secureFetch';

export default function SubmissionViewerModal(props) {

    const [submission, setSubmission] = useState({})

    const loadSubmission = () => {
        SecureFetch(`${config.url.API_GET_SUBMISSION}?log_id=${props.action?.action_log_id}`)
            .then((response) => response.json())
            .then((submission) => {
                if (submission.length > 0) {
                    setSubmission(JSON.parse(submission[0].form_data.toString()))
                }
            })
            .catch((error) => {
                alert("Failed to get action log data " + error);
            });
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

    return (
        <Modal
            trigger={
                <div onClick={loadSubmission}>
                    {props.trigger || <Button icon>
                        <Icon name="eye" />
                    </Button>}
                </div>
            }
            header={"Submission"}
            actions={[{ content: "Done", key: 0 }]}
            content={{
                content: <div>
                    <h5>Action:</h5> <p>{props.title}</p>
                    <h5>Submission Type:</h5> <p>{props.target}</p>
                    <h5>Submitted By:</h5> <p>{props.action.mock_id && `${props.action.mock_name} (${props.action.mock_id}) as `}<b>{`${props.action.name} (${props.action.system_id})`}</b></p>
                    <h5>Submitted At:</h5> <p>{formatDateTime(props.action.submission_datetime)}</p>
                    <Divider />
                    <h3>Submission</h3>
                    {!props.noSubmission && <>
                        {Object.keys(submission)?.map((key) => {
                            return (
                                <div key={key}>
                                    <h5>{key}:</h5> <p>{submission[key]}</p>
                                </div>
                            );
                        })}
                        {props.action.files?.split(",").map((file) => {
                            return <div key={file}><a href={`${config.url.BASE_URL}/#`} >{file}</a><br /></div>;
                        })}
                    </>}
                    {(props.noSubmission || Object.keys(submission).length === 0) && <p>{noSubmissionText(props.target)}</p>}
                </div>
            }}
        />
    );
}
