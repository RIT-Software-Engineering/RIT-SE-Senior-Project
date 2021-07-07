import React, { useState } from "react";
import { Button, Icon, Popup } from "semantic-ui-react";
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
    const [loadingSubmissions, setLoadingSubmissions] = useState(false)
    const [loadingTeammateSubmissions, setLoadingTeammateSubmissions] = useState(false)

    let isOpenCallback = function (isOpen) {
        setCloseOnDocClick(!isOpen);
    };

    const loadSubmission = () => {
        setLoadingSubmissions(true)
        SecureFetch(`${config.url.API_GET_ACTION_LOGS}?project_id=${props.projectId}&action_id=${props.action.action_id}`)
            .then(response => response.json())
            .then(actionLogs => {
                setSubmissions(actionLogs);
                setLoadingSubmissions(false)
            })
            .catch(err => {
                console.error("FAILED TO GET SUBMISSIONS: ", err)
            })
        setLoadingTeammateSubmissions(true)
        SecureFetch(`${config.url.API_GET_TEAMMATE_ACTION_LOGS}?project_id=${props.projectId}&action_id=${props.action.action_id}`)
            .then(response => response.json())
            .then(actionLogs => {
                setTeammateActions(actionLogs);
                setLoadingTeammateSubmissions(false)
            })
            .catch(err => {
                console.error("FAILED TO GET TEAMMATE SUBMISSIONS: ", err)
            })
    }

    const content = () => {
        return <div className="content">
            <div dangerouslySetInnerHTML={{ __html: props.action.short_desc }} />
            <p>Starts: {formatDate(props.action.start_date)}</p>
            <p>Due: {formatDate(props.action.due_date)}</p>
            <p>Submission Type: {submissionTypeMap[props.action.action_target]}</p>
            {submissions === null && teammateActions === null && !loadingSubmissions && !loadingTeammateSubmissions && <p className="fake-a" onClick={loadSubmission}>Load submissions</p>}
            {(loadingSubmissions || loadingTeammateSubmissions) && <Icon name="spinner" size="large" />}
            {submissions?.length === 0 && teammateActions?.length === 0 && <p><b>No submissions</b></p>}
            {submissions?.map(submission => {
                return <SubmissionViewerModal
                    key={submission.action_log_id}
                    action={submission}
                    title={props.action?.action_title}
                    target={props.action?.action_target}
                    trigger={<div><div className="fake-a">View <i>{formatDateTime(submission.submission_datetime)}</i> Submission</div></div>}
                />
            })}
            {teammateActions?.map(submission => {
                return <SubmissionViewerModal
                    key={submission.action_log_id}
                    action={submission}
                    title={props.action.action_title}
                    target={props.action?.action_target}
                    noSubmission
                    trigger={<div><div className="fake-a">View <i>{formatDateTime(submission.submission_datetime)}</i> Submission</div></div>}
                />
            })}
            <div className="spacer" />
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

    if (props.noPopup) {
        return <div className={`no-popup-tooltip ${props.color}`}>
            <h4>{props.action.action_title}</h4>
            {content()}
        </div>
    }

    return (
        <Popup
            header={props.action.action_title}
            content={content()}
            closeOnDocumentClick={closeOnDocClick}
            style={{ zIndex: 100 }}
            trigger={props.trigger}
            on="click"
            onOpen={loadSubmission}
        />
    );
}

export default ToolTip;
