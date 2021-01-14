import React from 'react';
import SemesterPanel from "./SemesterPanel";
import {Accordion} from "semantic-ui-react";

export default function ActionEditor(props) {
    let actionPanels = [];

    if(props.actions){
        for(let i = 0; i < props.actions.length; i ++){
            let actionData = props.actions[i];
            actionPanels.push({
                key: actionData.action_id,
                title: actionData.action_title,
                content: {
                    // content: <SemesterPanel {...semesterData}/>
                }
            })
        }
    }


    return(
        <div>
            <Accordion fluid styled panels={actionPanels} key={'actionEditor'} />
        </div>
    );

}