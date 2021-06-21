import React, { useState } from "react";
import { Popup } from "semantic-ui-react";
import { ACTION_TARGETS, config } from "../util/constants";
import { formatDate } from "../util/utils";
import ActionModal from "./ActionModal";

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
                    <ActionModal key={props.action.action_id} {...props.action} isOpenCallback={isOpenCallback} />
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
