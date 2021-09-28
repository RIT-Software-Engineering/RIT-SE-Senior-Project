import React from 'react';
import ToolTip from "./ToolTip";
import { ACTION_STATES } from '../util/constants';
import _ from "lodash";

export default function ActionElements(props) {
    const sortedActions = _.sortBy(props.actions || [], ["due_date", "start_date", "action_title"]);
    let actionsComponents = [];

    sortedActions.forEach((action, idx) => {

        let color = "";

        switch (action.state) {
            case ACTION_STATES.YELLOW:
                color += "proposal-row-yellow";
                break;
            case ACTION_STATES.RED:
                color += "proposal-row-red";
                break;
            case ACTION_STATES.GREEN:
                color += "proposal-row-green";
                break;
            case ACTION_STATES.GREY:
                color += "proposal-row-gray";
                break;
            default:
                color += `proposal-row-${action.state}`;
                break;
        }

        const trigger = <div
            className={`action-bar ${color}`}
            key={idx}
        >
            {<div className="action-bar-text">{action.action_title}</div>}
        </div>
        actionsComponents.push(
            <ToolTip
                autoLoadSubmissions={props.autoLoadSubmissions}
                color={color} noPopup={props.noPopup}
                trigger={trigger}
                action={action} projectId={props.projectId}
                semesterName={props.semesterName}
                projectName={props.projectName}
                key={`tooltip-${action.action_title}-${idx}`}
                reloadTimelineActions={props.reloadTimelineActions}
            />
        )
    })

    return <div className={props.noPopup ? "relevant-actions-container" : "actions-container"}>
        {actionsComponents}
    </div>
}
