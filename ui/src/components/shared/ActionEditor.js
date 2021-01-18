import React from 'react';
import ActionPanel from "./ActionPanel";
import {Accordion} from "semantic-ui-react";

export default function ActionEditor() {
    let semesterPanels = [];

    if(props.actions){
        let semesterMap = {};
        for(let i = 0; i < props.actions.length; i ++){
            let actionData = props.actions[i];
            if (!semesterMap[actionData.name]) { semesterMap[actionData.name] = []; }
            semesterMap[actionData.name].push (<Accordion fluid styled panels={[{
                key: actionData.action_id,
                title: actionData.action_title,
                content: {
                    content: <ActionPanel {...actionData} key={'editAction-' + i}/>
                }
            }]} key={'editingTheAction-'+i} />)
        }
        console.log('semesterMap: ', Object.entries(semesterMap));
        for (const [key, value] of Object.entries(semesterMap)) {
            console.log('key, value', key, value);
            semesterPanels.push(
                <Accordion fluid styled panels={[{
                    key: 'actionEditor-semester-selector-'+key,
                    title: key,
                    content: {content:value}
                }]} key={'actionEditor'} />
            )
        }
    }

    console.log('semester panels: ', semesterPanels);

    return(
        <div>
            <Accordion fluid styled panels={[{
                key: 'actionEditor',
                title: 'Action Editor',
                content: {content:semesterPanels}
            }]}
            />
        </div>
    );

}