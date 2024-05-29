import React, { act, createElement, useEffect, useLayoutEffect, useRef } from 'react'
import { ACTION_STATES } from '../../../../util/functions/constants';
import { formatDate, formatDateNoOffset, isSemesterActive, parseDate } from "../../../../util/functions/utils";
import _ from "lodash";
import ToolTip from "./ToolTip";
import { Grid } from 'semantic-ui-react';

export default function GanttChart(props) {
    const containerRef = React.useRef(null);
    const semesterStartDate = props.semesterStart;
    const semesterEndDate = props.semesterEnd;
    const semesterLength = dateDiff(semesterStartDate, semesterEndDate) + 1; // + 1 to account for left side panel column
    // useEffect(()=> {
    //     const today = new Date();
    //     containerRef.current.scrollTop += 200;
    // }, semesterStartDate, semesterEndDate);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekNames = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];
    const timeSpans = {'week' : 14, 'month' : 31, 'project' : semesterLength};
    const sortedActions = _.sortBy(props.actions || [], ["due_date", "start_date", "action_title"]);
    let ganttHeader = [];
    let ganttBars = [];
    let leftSideRows = []

    const [selectTimeSpan, setSelectTimeSpan] = React.useState("week");

    function onTimeSpanChange(e) {
        setSelectTimeSpan(e.target.value);
    }

    leftSideRows.push(<div className="sidebar header empty" style={{'gridRow' : 1}}></div>);
    leftSideRows.push(<div className="sidebar header" style={{'gridRow' : 2}}>Name</div>);

    // eventually set it to current date (no param). this is for dev
    let today = new Date('2018-10-02');
    let startCol = new Date(semesterStartDate);
    if (!isSemesterActive(semesterStartDate, semesterEndDate)) {
        today = startCol;
    }

    let cols = semesterLength;

    // curr for current ___ in the construction of the chart
    let currDate = startCol.getDate() + 1; // + 1 to account for left side panel column
    let currMonth = startCol.getMonth();
    let currYear = startCol.getFullYear();
    let monthLength = daysInMonth(startCol.getMonth(), startCol.getFullYear());    

    const monthLabel = <div
        className="gantt-header first"
        style={{'gridColumn' : 1 + ' / span ' + (monthLength - currDate + 1)}}
        >
            {monthNames[currMonth]}
        </div>
    ganttHeader.push(monthLabel);

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
                className="gantt-header first"
                style={{'gridColumn' : i + 1 + ' / span ' + monthLength}}
                >{monthNames[currMonth]}</div>
            ganttHeader.push(monthLabel);
        }
        ganttHeader.push(<div className="gantt-header second">{currDate}</div>); // date
        // ganttHeader.push(<div className="gantt-header second">{weekNames[(startCol.getDay() + i)%7]}</div>); //days of week
        currDate++;
    }

    // ----------------- ROWS -------------------
    sortedActions.forEach((action, idx) => {
        // use this to determine if scroll
        if (!isSemesterActive(semesterStartDate, semesterEndDate)) {

        }
        
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

        const ganttRowButton = <button
            className={`action-bar ${color}`}
            style={{'gridRow' : gridrow, 'gridColumn' : barStart + ' / span ' + barSpan,
                    'textWrap' : 'nowrap', 'overflow' : 'visible'}}
            key={idx}
            >{action.action_title}</button>
        const ganttBar = <ToolTip
            autoLoadSubmissions={props.autoLoadSubmissions}
            color={color} noPopup={props.noPopup}
            trigger={ganttRowButton}
            action={action} projectId={props.projectId}
            semesterName={props.semesterName}
            projectName={props.projectName}
            key={`tooltip-${action.action_title}-${idx}`}
            reloadTimelineActions={props.reloadTimelineActions}
        />
        ganttBars.push(ganttBar)

        const leftRowButton = <button
            className="sidebar"
            style={{'gridRow' : gridrow}}>{action.action_title}</button>
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

    // const container = (<div
    //     className="gantt-container"
    //     style={{'gridAutoColumns' : 100/timeSpans[selectTimeSpan] + '%'}}>
    //         {ganttHeader}{ganttBars}
    //     </div>)


    const container = (<div
        ref={containerRef}
        className="gantt-container"
        style={{'gridAutoColumns' : 100/timeSpans[selectTimeSpan] + '%'}}>
            {ganttHeader}{ganttBars}
        </div>);
    
    const sidebarContainer = (<div
        className='sidebar-container'>
        {leftSideRows}
    </div>)
    
    // ---------------- RENDER ------------------
    return (
        <div>
            <div>
                <label htmlFor="TimeSpan">Time Span </label>
                <select name="TimeSpan" defaultValue={selectTimeSpan} onChange={onTimeSpanChange}>
                    <option value="week">2 weeks</option>
                    <option value="month">month</option>
                    <option value="project">project</option>
                </select>
            </div>
            <div className="gantt">
                {leftSideRows}
                {container}
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