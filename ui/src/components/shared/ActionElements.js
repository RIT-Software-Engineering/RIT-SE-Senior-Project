import React from 'react';
import ToolTip from "./ToolTip";
import { ACTION_STATES } from '../util/constants';
import _ from "lodash";

export default function ActionElements(props) {
    const sortedActions = _.sortBy(props.actions || [], ["due_date", "start_date", "action_title"]);
    let actionsComponents = [];

    sortedActions.forEach((action, idx) => {

        let className = "action-bar ";

        switch (action.state) {
            case ACTION_STATES.YELLOW:
                className += "proposal-row-yellow";
                break;
            case ACTION_STATES.RED:
                className += "proposal-row-red";
                break;
            case ACTION_STATES.GREEN:
                className += "proposal-row-green";
                break;
            case ACTION_STATES.GREY:
                className += "proposal-row-gray";
                break;
            default:
                className += `proposal-row-${action.state}`;
                break;
        }

        const trigger = <div
            className={className}
            key={idx}
        >
            {(action.state === "yellow" || action.state === "red") && <div className="action-bar-text">{action.action_title}</div>}
        </div>
        actionsComponents.push(
            <ToolTip trigger={trigger} key={`tooltip-${action.action_title}-${idx}`} action={action} projectId={props.projectId} />
        )
    })

    return <div className="actions-container">
        {actionsComponents}
    </div>
}
