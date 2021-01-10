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
        let rectInnerHtml = (<div style={{}}></div>);
        if (action.state === 'yellow' || action.state === 'red') {
            width = baseSize * 3;
            rectInnerHtml = (
                <div style={{margin: "auto", width: "50%", textAlign: "center", textWrap: "wrap", verticalAlign: "middle"}}>
                    {action.action_title}
                </div>
            );
        }

        let rect = (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px black solid",
                    backgroundColor: action.state,
                    width: width + "%",
                    height: "80%",
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginLeft: "1%"
                }}
                id={props.team_name.replace(/\s/g,'') + '-' + index} 
                className="rect"
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
            <div className="container" style={{width: '100%', height: '70px', display: 'flex'}}>
                {actionsComponents}
            </div>
        </div>
    );
}