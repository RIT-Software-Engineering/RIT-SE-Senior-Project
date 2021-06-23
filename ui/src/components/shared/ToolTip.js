import React, { useState } from "react";
import { Button, Popup } from "semantic-ui-react";
import { ACTION_TARGETS } from "../util/constants";
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
                    {props.action?.submissions?.length > 0 && props.action?.submissions.map(submission => {
                        return <SubmissionViewerModal
                            key={submission.system_id + submission.submission_datetime}
                            action={submission}
                            trigger={<div><a href="#">View <i>{formatDateTime(submission.submission_datetime)}</i> Submission</a><br /></div>}
                        />
                    })}
                    <ActionModal
                        key={props.action.action_id}
                        {...props.action}
                        isOpenCallback={isOpenCallback}
                        trigger={props.action?.submissions?.length > 0 ? <Button fluid >Resubmit Action</Button> : <Button fluid >Submit Action</Button>}
                    />
                </div>
            }
            closeOnDocumentClick={closeOnDocClick}
            style={{ zIndex: 100 }}
            trigger={props.trigger}
            on="click"
        />
    );
}

export default ToolTip;
