import React, { act } from 'react'
import ActionElements from './ActionElements';
import { ACTION_STATES } from '../../../../util/functions/constants';
import _ from "lodash";
import ToolTip from "./ToolTip";

// a copy of UpcomingActions
export default function ActionGantt(props) {
    const sortedActions = _.sortBy(props.actions || [], ["due_date", "start_date", "action_title"]);
    let actionsComponents = [];

    sortedActions.forEach((action, idx) => {

        let color = "";

        switch (action.state) {
            case ACTION_STATES.YELLOW:
                color += "proposal-row-yellow";
                break;
            case ACTION_STATES.RED:
                color += "proposal-row-red";
                break;
            case ACTION_STATES.GREEN:
                color += "proposal-row-green";
                break;
            case ACTION_STATES.GREY:
                color += "proposal-row-gray";
                break;
            default:
                color += `proposal-row-${action.state}`;
                break;
        }

        // this may be messy
        // having the entirety of the row be the "button" so the tooltip will appear
        // no matter where on the row you click- but now it's a matter of changing the
        // html within the button contents to get the desired "row" look
        // we may just scrap all of this after
        const ganttRow = <button
            class="gantt-action-instance"
            // className={`action-bar ${color}`}
            key={idx}
        >
            <div class="ganttSidepane">{action.action_title}</div>
            {<div className="gantt-action-bar" title={action.action_title}>{action.action_title}</div>}
        </button>
        actionsComponents.push(
            <ToolTip
                autoLoadSubmissions={props.autoLoadSubmissions}
                color={color} noPopup={props.noPopup}
                trigger={ganttRow}
                action={action} projectId={props.projectId}
                semesterName={props.semesterName}
                projectName={props.projectName}
                key={`tooltip-${action.action_title}-${idx}`}
                reloadTimelineActions={props.reloadTimelineActions}
            />
        )
    })


    // time span currently does nothing
    return (
        <div>
            <div>
                <label for="TimeSpan">Time Span </label>
                <select name="TimeSpan" defaultValue={"weekly"}>
                    <option value="week">week</option>
                    <option value="month">month</option>
                    <option value="project">project</option>
                </select>
            </div>
            <div class="gantt-grid"></div>
            <div>{actionsComponents}</div>
        </div>
    );
}
