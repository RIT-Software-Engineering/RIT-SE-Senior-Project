import React, { act, createElement } from 'react'
import { ACTION_STATES } from '../../../../util/functions/constants';
import { parseDate } from "../../../../util/functions/utils";
import _ from "lodash";
import ToolTip from "./ToolTip";
  
export default function GanttChart(props) {
    const sortedActions = _.sortBy(props.actions || [], ["due_date", "start_date", "action_title"]);
    let ganttCols = []
    let ganttBars = [];

    // not actually the first day, but I didn't feel like sorting the actions again by start date
    // let firstDay = sortedActions[0]?.start_date;

    // eventually set it to current date (no param). this is for dev
    let today = new Date("2019/8/27");

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekNames = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];

    let cols = 70; // arbitrary for now

    // curr for current ___ in the construction of the chart
    let currDate = today.getDate();
    let currMonth = today.getMonth();
    let currYear = today.getFullYear();
    let monthLength = daysInMonth(today.getMonth(), today.getFullYear());    

    const monthLabel = <div
        className="gantt-first-row"
        style={{'gridColumn' : 1 + ' / span ' + (monthLength - currDate + 1)}}
        >
            {monthNames[currMonth]} {currYear}
        </div>
    ganttCols.push(monthLabel);

    // columns
    for (let i = 0; i < cols; i++) {
        // if new month
        if (currDate == monthLength + 1) {
            currDate = 1;
            currMonth = currMonth + 1;
            if (currMonth == 13) {
                currMonth = 1;
                currYear++;
            }
            monthLength = daysInMonth(currMonth, currYear);
            const monthLabel = <div
                className="gantt-first-row"
                style={{'gridColumn' : i + 1 + ' / span ' + monthLength}}
                >{monthNames[currMonth]} {currYear}</div>
            ganttCols.push(monthLabel);
        }
        ganttCols.push(<div className="gantt-second-row">{currDate}</div>); // date
        // ganttCols.push(<div className="gantt-second-row">{weekNames[(today.getDay() + i)%7]}</div>); //days of week

        // ganttCols.push(<div className="gantt-cols">.</div>);

        currDate++;
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

        const gridrow = 3 + idx;
        const startDate = action?.start_date;
        const dueDate = action?.due_date;        
        const barStart = dateDiff(today, startDate) < 1 ? 1 : dateDiff(today, startDate); 
        const barSpan = dateDiff(today, startDate) < 1 ? dateDiff(startDate, dueDate) + dateDiff(today, startDate) : dateDiff(startDate, dueDate);

        const ganttRow = <button
            className={`action-bar ${color}`}
            style={{'gridRow' : gridrow, 'gridColumn' : barStart + ' / span ' + barSpan}}
            key={idx}
            >{action.action_title}</button>

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

    let container = <div className="gantt-container">{ganttCols}{ganttBars}</div>

    // time span currently does nothing
    return (
        <div>
            <div>
                <label htmlFor="TimeSpan">Time Span </label>
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

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

// magic number 86400000 is milli * sec * min * hr
// difference in days
function dateDiff (firstDate, secondDate) {
    return (parseDate(secondDate) - parseDate(firstDate)) / 86400000;
}

