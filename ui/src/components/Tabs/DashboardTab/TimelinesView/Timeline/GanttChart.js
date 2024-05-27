import React, { act, createElement } from 'react'
import ActionElements from './ActionElements';
import { ACTION_STATES } from '../../../../util/functions/constants';
import _ from "lodash";
import ToolTip from "./ToolTip";
import {
    formatDateNoOffset,
    formatDateTime,
  } from "../../../../util/functions/utils";
  
// a copy of UpcomingActions
export default function GanttChart(props) {
    const sortedActions = _.sortBy(props.actions || [], ["due_date", "start_date", "action_title"]);
    let ganttBars = [];


    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let weekNames = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];

    
    let cols = 7;

    // columns - currently only a weekly view
    let ganttCols = []
    for (let i = 0; i < cols; i++) {
        ganttCols.push(<div class="gantt-first-row">monthname</div>);
        ganttCols.push(<div class="gantt-second-row">{weekNames[i]}</div>);
        // ganttCols.push(<div class="gantt-cols">.</div>);
    }

    // rows
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

        // perhaps find way to not use css inline? feels messy
        const gridrow = 3 + idx;

        // will want to use span from start to end date
        // props.action?.start_date
        // props.action?.due_date
        // these are date(?) objects, or at least formatted strangely. must get the start and end
        // dates from them first.
        const ganttRow = <button
            className="gantt-bars"
            style={{'gridRow' : gridrow, 'gridColumn' : '4 / span 3'}} //example span
            // className={`action-bar ${color}`}
            key={idx}
        >
            {<div className="gantt-action-bar" title={action.action_title}>{action.action_title}</div>}
        </button>
        ganttBars.push(
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

    // full container
    let container = <div class="gantt-container">{ganttCols}{ganttBars}</div>

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
            <div className={props.noPopup ? "relevant-actions-container" : "actions-container"}>
            {container}
            </div>
        </div>
    );
}
