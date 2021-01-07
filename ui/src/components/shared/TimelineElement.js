import React from "react";
import ActionModal from "./ActionModal";
import { Popup } from 'semantic-ui-react'

export default function(props){
    let totalWeight = 0;
    let actionsComponents = [];

    props.actions.forEach((action, index) => {
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

        let toolTipContent = (

            <div className="content">
                <p>{action.short_desc}</p>
                <p>Starts: {action.start_date}</p>
                <p>Due: {action.due_date}</p>
                <ActionModal key={"action-" + action.action_title + "-" + index} {...action} />
            </div>
        );

        let popup = (
            < Popup
                key = {action.action_title}
                header = {action.action_title}
                content = {toolTipContent}
                trigger = {rectInnerHtml}
                on = 'click'
            />
        );

        let rect = (
            <div style={
                {
                    display: "flex",
                    alignItems: "center",
                    border: "1px black solid",
                    backgroundColor: action.state,
                    width: {width} + "%",
                    height: "80%",
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginLeft: "1%"
                }
            } id={props.team_name.replace(/\s/g,'') + '-' + index} className="rect">
                {popup}
            </div>
        );

        actionsComponents.push(rect);
    });


    return (
        <div>
            <h3>
                {props.team_name}
            </h3>
            <div className="container">
                {actionsComponents}
            </div>
        </div>
    );
}