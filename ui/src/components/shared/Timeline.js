import React from "react";
import ToolTip from "./ToolTip";
import _ from "lodash";

export default function Timeline(props) {

    const renderActionComponents = (data) => {
        const sortedActions = _.sortBy(data?.actions || [], ["due_date", "start_date", "action_title"]);
        let actionsComponents = [];

        sortedActions.forEach((action, idx) => {

            let className = "action-bar ";

            switch (action.state) {
                case "yellow":
                    className += "proposal-row-yellow";
                    break;
                case "red":
                    className += "proposal-row-red";
                    break;
                case "green":
                    className += "proposal-row-green";
                    break;
                default:
                    className += "proposal-row-gray";
                    break;
            }

            const trigger = <div
                className={className}
                key={idx}
            >
                {(action.state === "yellow" || action.state === "red") && <div className="action-bar-text">{action.action_title}</div>}
            </div>

            actionsComponents.push(
                <ToolTip trigger={trigger} key={`tooltip-${action.action_title}-${idx}`} action={action} projectId={props.elementData?.project_id} />
            )
        })

        return actionsComponents;
    }

    return (
        <div>
            <h3>{props.elementData?.display_name || props.elementData?.title}</h3>
            <div className="actions-container">{renderActionComponents(props.elementData || [])}</div>
        </div>
    );
}
