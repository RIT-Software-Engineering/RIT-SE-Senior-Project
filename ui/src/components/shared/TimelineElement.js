import React from "react";
import ActionModal from "./ActionModal";

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


        let toolTipHtml = (
            <div>
                <div className="header">
                    {action.action_title}
                </div>
                <div className="content">
                    <p>{action.short_desc}</p>
                    <p>Starts: {action.start_date}</p>
                    <p>Due: {action.due_date}</p>
                    <ActionModal {...action} />
                </div>
            </div>
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
                {rectInnerHtml}
                {toolTipHtml}
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
                {/*{actionsComponents}*/}
            </div>
        </div>
    );
}