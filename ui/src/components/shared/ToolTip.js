import React, { useState } from "react";
import { Button, Popup } from "semantic-ui-react";
import { ACTION_TARGETS, config } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";
import { formatDate, formatDateTime } from "../util/utils";
import ActionModal from "./ActionModal";
import SubmissionViewerModal from "./SubmissionViewerModal";

const submissionTypeMap = {
    [ACTION_TARGETS.individual]: "Individual",
    [ACTION_TARGETS.team]: "Team",
    [ACTION_TARGETS.coach]: "Coach",
    [ACTION_TARGETS.admin]: "Admin",
}

function ToolTip(props) {
    const [closeOnDocClick, setCloseOnDocClick] = useState(true);

    const [submissions, setSubmissions] = useState(null)
    const [teammateActions, setTeammateActions] = useState(null)

    let isOpenCallback = function (isOpen) {
        setCloseOnDocClick(!isOpen);
    };

    return (
        <Popup
            header={props.action.action_title}
            content={
                <div className="content">
                    <p dangerouslySetInnerHTML={{ __html: props.action.short_desc }} />
                    <p>Starts: {formatDate(props.action.start_date)}</p>
                    <p>Due: {formatDate(props.action.due_date)}</p>
                    <p>Submission Type: {submissionTypeMap[props.action.target]}</p>
                    {submissions?.map(submission => {
                        return <SubmissionViewerModal
                            key={submission.system_id + submission.submission_datetime}
                            action={submission}
                            target={props.action?.target}
                            trigger={<div><div className="fake-a">View <i>{formatDateTime(submission.submission_datetime)}</i> Submission</div></div>}
                        />
                    })}
                    {teammateActions?.map(submission => {
                        return <SubmissionViewerModal
                            key={submission.system_id + submission.submission_datetime}
                            action={submission}
                            target={props.action?.target}
                            noSubmission
                            trigger={<div><div className="fake-a">View <i>{formatDateTime(submission.submission_datetime)}</i> Submission</div></div>}
                        />
                    })}
                    {/* 
                      * Not sure if it makes more sense to check action.state or action.start_date.
                      * However, action.state is based off of server time whereas if we parse action.start_date, 
                      * we need to deal with parsing with time zones and all of that.
                      */}
                    {props.action.state === "grey" ?
                        <p className="ui fluid button">This Action Can be Submitted On or After {formatDate(props.action?.start_date)}</p>
                        :
                        <ActionModal
                            key={props.action.action_id}
                            {...props.action}
                            isOpenCallback={isOpenCallback}
                            projectId={props.projectId}
                            trigger={submissions?.length > 0 ? <Button fluid >Resubmit Action</Button> : <Button fluid >Submit Action</Button>}
                        />
                    }
                </div>
            }
            closeOnDocumentClick={closeOnDocClick}
            style={{ zIndex: 100 }}
            trigger={props.trigger}
            on="click"
            onOpen={() => {
                SecureFetch(`${config.url.API_GET_ACTION_LOGS}?project_id=${props.projectId}&action_id=${props.action.action_id}`)
                    .then(response => response.json())
                    .then(actionLogs => {
                        setSubmissions(actionLogs);
                    })
                    .catch(err => {
                        console.error("FAILED TO GET SUBMISSIONS: ", err)
                    })
                SecureFetch(`${config.url.API_GET_TEAMMATE_ACTION_LOGS}?project_id=${props.projectId}&action_id=${props.action.action_id}`)
                    .then(response => response.json())
                    .then(actionLogs => {
                        setTeammateActions(actionLogs);
                    })
                    .catch(err => {
                        console.error("FAILED TO GET TEAMMATE SUBMISSIONS: ", err)
                    })
            }}
        />
    );
}

export default ToolTip;
