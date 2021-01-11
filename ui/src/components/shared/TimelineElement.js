import React from "react";
import ActionModal from "./ActionModal";
import ToolTip from "./ToolTip";

export default function TimelineElement(props){
    let totalWeight = 0;
    let actionsComponents = [];

    props.actions.forEach((action) => {
        if (action.state === 'yellow' || action.state === 'red'){
            totalWeight += 3;
        }
        else {
            totalWeight += 1;
        }
    });

    let baseSize = (100 - props.actions.length - 1) / totalWeight;

    props.actions.forEach((action, index) => {
        let width = baseSize;
        let rectInnerHtml = (<div></div>);
        if (action.state === 'yellow' || action.state === 'red') {
            width = baseSize * 3;
            rectInnerHtml = (
                <div className = "action-bar-text">
                    {action.action_title}
                </div>
            );
        }

        let rect = (
            <div
                style={{
                    backgroundColor: action.state,
                    width: width + "%",
                }}
                id={props.team_name.replace(/\s/g,'') + '-' + index} 
                className="action-bar"
                key={index}
            >
                {rectInnerHtml}
            </div>
        );

        let actionModal = (<ActionModal key={"action-" + action.action_title + "-" + index} {...action} />);
        let toolTip = (<ToolTip
            actionModal={actionModal}
            trigger={rect}
            key={"tooltip-" + action.action_title + "-" + index}
            action={action}
        />);

        actionsComponents.push(toolTip);
    });


    return (
        <div>
            <h3>
                {props.team_name}
            </h3>
            <div className="actions-container">
                {actionsComponents}
            </div>
        </div>
    );
}