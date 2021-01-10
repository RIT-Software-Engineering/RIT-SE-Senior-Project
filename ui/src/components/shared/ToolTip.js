import React from 'react';
import {Popup} from "semantic-ui-react";

function ToolTip (props){

    return (
        < Popup
            header={props.action.action_title}
            content={
                <div className="content">
                    <p>{props.action.short_desc}</p>
                    <p>Starts: {props.action.start_date}</p>
                    <p>Due: {props.action.due_date}</p>
                    {props.actionModal}
                </div>
            }
            closeOnDocumentClick={false}
            style={{zIndex: 100}}
            trigger={props.trigger}
            on='click'
        />
    );
}

export default ToolTip;