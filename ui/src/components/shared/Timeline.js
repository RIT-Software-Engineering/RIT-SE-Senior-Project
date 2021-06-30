import React, { useEffect, useState } from "react";
import ToolTip from "./ToolTip";
import _ from "lodash";
import { SecureFetch } from "../util/secureFetch";
import { config } from "../util/constants";

export default function Timeline(props) {

    const [actions, setActions] = useState([])

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_TIMELINE_ACTIONS}?project_id=${props.elementData?.project_id}`)
            .then(response => response.json())
            .then(actions => setActions(actions))
            .catch(error => console.error(error))
    }, [])

    const renderActionComponents = (data) => {
        const sortedActions = _.sortBy(actions || [], ["due_date", "start_date", "action_title"]);
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
                case "grey":
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
