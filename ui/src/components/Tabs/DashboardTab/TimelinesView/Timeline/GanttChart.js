import React, { act, createElement } from 'react'
import { ACTION_STATES } from '../../../../util/functions/constants';
import { formatDate, formatDateNoOffset, isSemesterActive, parseDate } from "../../../../util/functions/utils";
import _ from "lodash";
import ToolTip from "./ToolTip";
import { Grid } from 'semantic-ui-react';

// not sure if class is getting too big yet
export default function GanttChart(props) {
    const semesterStartDate = props.semesterStart;
    const semesterEndDate = props.semesterEnd;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekNames = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];
    const timeSpans = {'week' : 14, 'month' : 31, 'project' : dateDiff(semesterStartDate, semesterEndDate)};
    const sortedActions = _.sortBy(props.actions || [], ["due_date", "start_date", "action_title"]);
    let ganttCols = []
    let ganttBars = [];
    let leftSideRows = []

    const [selectTimeSpan, setSelectTimeSpan] = React.useState("week");

    function onTimeSpanChange(e) {
        setSelectTimeSpan(e.target.value);
    }

    leftSideRows.push(<div className="left-row-empty" style={{'gridRow' : 1}}></div>)
    leftSideRows.push(<div className="left-row-empty" style={{'gridRow' : 2}}></div>)
    leftSideRows.push(<div className="left-row-empty" style={{'gridRow' : 3}}></div>);

    // eventually set it to current date (no param). this is for dev
    let today = new Date();
    let startCol = new Date(semesterStartDate);
    if (!isSemesterActive(semesterStartDate, semesterEndDate)) {
        // snap to today
    }

    let cols = dateDiff(semesterStartDate, semesterEndDate);

    // curr for current ___ in the construction of the chart
    let currDate = startCol.getDate();
    let currMonth = startCol.getMonth();
    let currYear = startCol.getFullYear();
    let monthLength = daysInMonth(startCol.getMonth(), startCol.getFullYear());    

    const monthLabel = <div
        className="gantt-first-row"
        style={{'gridColumn' : 1 + ' / span ' + (monthLength - currDate + 1)}}
        >
            {monthNames[currMonth]}
        </div>
    ganttCols.push(monthLabel);

    // columns
    for (let i = 0; i < cols; i++) {
        // if new month
        if (currDate == monthLength + 1) {
            currDate = 1;
            currMonth = currMonth + 1;
            if (currMonth == 12) {
                currMonth = 0;
                currYear++;
            }
            monthLength = daysInMonth(currMonth, currYear);
            if (i + monthLength > cols) { // to cut off the month at the end of the calendar
                monthLength = monthLength - (i + monthLength - cols);
            }
            const monthLabel = <div
                className="gantt-first-row"
                style={{'gridColumn' : i + 1 + ' / span ' + monthLength}}
                >{monthNames[currMonth]}</div>
            ganttCols.push(monthLabel);
        }
        ganttCols.push(<div className="gantt-second-row">{currDate}</div>); // date
        // ganttCols.push(<div className="gantt-second-row">{weekNames[(startCol.getDay() + i)%7]}</div>); //days of week

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
        const startDate = new Date(action?.start_date);
        const dueDate = new Date(action?.due_date);
        const barStart = dateDiff(startCol, startDate) + 1; 
        const barSpan = dateDiff(startDate, dueDate) + 1;

        const ganttRow = <button
            className={`action-bar ${color}`}
            style={{'gridRow' : gridrow, 'gridColumn' : barStart + ' / span ' + barSpan,
                    'textWrap' : 'nowrap', 'overflow' : 'visible'}}
            key={idx}
            >{action.action_title}</button>

        const ganttBar = <ToolTip
            autoLoadSubmissions={props.autoLoadSubmissions}
            color={color} noPopup={props.noPopup}
            trigger={ganttRow}
            action={action} projectId={props.projectId}
            semesterName={props.semesterName}
            projectName={props.projectName}
            key={`tooltip-${action.action_title}-${idx}`}
            reloadTimelineActions={props.reloadTimelineActions}
        />

        ganttBars.push(ganttBar)


        const leftRowButton = 
            <button className="left-row">
                {action.action_title}
            </button>

        const leftRow = <ToolTip
            autoLoadSubmissions={props.autoLoadSubmissions}
            color={color} noPopup={props.noPopup}
            trigger={leftRowButton}
            action={action} projectId={props.projectId}
            semesterName={props.semesterName}
            projectName={props.projectName}
            key={`tooltip-${action.action_title}-${idx}`}
            reloadTimelineActions={props.reloadTimelineActions}
        />

        leftSideRows.push(leftRow)
    })

    let container = <div
        className="gantt-container"
        style={{'gridAutoColumns' : 100/timeSpans[selectTimeSpan] + '%'}}>
            {ganttCols}{ganttBars}
        </div>

    return (
        <div className="gantt">
            <div className="gantt-left">
                <div className="left-column">
                    {leftSideRows}
                </div>
            </div>
            <div className="gantt-right">
                <div>
                    <label htmlFor="TimeSpan">Time Span </label>
                    <select name="TimeSpan" defaultValue={selectTimeSpan} onChange={onTimeSpanChange}>
                        <option value="week">2 weeks</option>
                        <option value="month">month</option>
                        <option value="project">project</option>
                    </select>
                </div>
                <div>
                    {container}
                </div>
            </div>
        </div>
    );
}

// Month+1 in Date constructor to account for how it determines month from numbers
function daysInMonth (month, year) {
    return new Date(year, month+1, 0).getDate();
}

// magic number 86400000 is milli * sec * min * hr
// difference in days
function dateDiff (firstDate, secondDate) {
    return (parseDate(secondDate) - parseDate(firstDate)) / 86400000;
}