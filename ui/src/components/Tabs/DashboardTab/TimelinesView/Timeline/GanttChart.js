import React, { act, createElement, useEffect, useRef } from 'react'
import { ACTION_STATES } from '../../../../util/functions/constants';
import { isSemesterActive, dateDiff } from "../../../../util/functions/utils";
import GanttChartBackdrop from './GanttChartBackdrop';
import _ from "lodash";
import ToolTip from "./ToolTip";
import ActionToolTip from '../../../AdminTab/ActionEditor/ActionToolTip';

export default function GanttChart(props) {
    const containerRef = useRef(null);
    const firstActionRef = useRef(null);
    const todayRef = useRef(null);
    const semesterStartDate = props.semesterStart;
    const semesterEndDate = props.semesterEnd;
    const semesterLength = dateDiff(semesterStartDate, semesterEndDate) + 2;
    const semesterActive = isSemesterActive(semesterStartDate, semesterEndDate);
    const sortedActions = _.sortBy(props.actions || [], ["due_date", "start_date", "action_title"]);
    let today = new Date();
    if (!(semesterActive)) {
        today = new Date(semesterStartDate);
    }
    let firstAction = sortedActions.find((action) => {return new Date(action?.due_date) >= today}); // make this work
    const timeSpans = {'week' : 14, 'month' : 31, 'project' : semesterLength};
    const [selectedTimeSpan, setSelectedTimeSpan] = React.useState("week");
    let sidebarWidth = isMobile() ? 0 : 200;    // sticky text left - 200px is fixed sidebar width

    useEffect(()=> {
        document.documentElement.style.setProperty('--gantt-maximum-columns', semesterLength + 1);
        document.documentElement.style.setProperty('--gantt-maximum-rows', sortedActions.length + 4);

        if (semesterActive && firstAction) {
            try {
                let viewTop = firstActionRef.current.offsetTop - todayRef.current.offsetTop;
                let viewLeft = todayRef.current.offsetLeft - sidebarWidth;
                containerRef.current.scrollTo(viewLeft, viewTop);    
            } catch (e) {
                console.log('issue with snapping to current day (x), first action (y)', e);
            }
        }
    }, [semesterStartDate, semesterEndDate, firstAction, today]);

    function onTimeSpanChange(e) {
        setSelectedTimeSpan(e.target.value);
    }

    // Function to check if a user a on a mobile device in multiple ways, 
    // also limits the sidebar to a small screen of 768px.
    function isMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
        const hasOrientation = typeof window.orientation !== "undefined";

        return isMobileDevice || isSmallScreen || hasOrientation;
    }

    // ----------------- ROWS -------------------
    let ganttBars = [];
    let leftSideRows = [];
    let startCol = new Date(semesterStartDate);
    leftSideRows.push(<div className="sidebar header">Name</div>);

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
        const barStart = Math.round(dateDiff(startCol, startDate)) + 1; 
        const barSpan = Math.round(dateDiff(startDate, dueDate)) + 1;

        let admin = false;
        if(props.admin && props.admin == "true") {
            admin = true
        }

        const ganttRowButton = <button
            ref={(action == firstAction) ? firstActionRef : null}
            className={`action-bar ${color}`}
            style={{'gridRow' : gridrow, 'gridColumn' : barStart + ' / span ' + barSpan,
                    'textWrap' : 'nowrap', 'overflow' : 'visible'}}
            key={idx}
            ><p style={{'left' : sidebarWidth + 'px'}}>{action.action_title}</p></button>
        let ganttBar;
        if(admin) {
            ganttBar = <ActionToolTip
                autoLoadSubmissions={props.autoLoadSubmissions}
                color={color} noPopup={props.noPopup}
                trigger={ganttRowButton}
                action={action} projectId={props.projectId}
                semesterData={props.semesterData}
                semesterName={props.semesterName}
                projectName={props.projectName}
                key={`tooltip-${action.action_title}-${idx}`}
                index={idx}
                reloadTimelineActions={props.reloadTimelineActions}
            />
        } else {
            ganttBar = <ToolTip
                autoLoadSubmissions={props.autoLoadSubmissions}
                color={color} noPopup={props.noPopup}
                trigger={ganttRowButton}
                action={action} projectId={props.projectId}
                semesterName={props.semesterName}
                projectName={props.projectName}
                key={`tooltip-${action.action_title}-${idx}`}
                reloadTimelineActions={props.reloadTimelineActions}
            />
        }
        ganttBars.push(ganttBar)

        const leftRowButton = <button
            className="sidebar"
            style={{'gridRow' : gridrow}}>{action.action_title}</button>
        let leftRow;
        if(admin) {
            leftRow = <ActionToolTip
                autoLoadSubmissions={props.autoLoadSubmissions}
                color={color} noPopup={props.noPopup}
                trigger={leftRowButton}
                action={action} projectId={props.projectId}
                semesterData={props.semesterData}
                semesterName={props.semesterName}
                projectName={props.projectName}
                key={`tooltip-${action.action_title}-${idx}`}
                index={idx}
                reloadTimelineActions={props.reloadTimelineActions}
            />
        } else {
            leftRow = <ToolTip
                autoLoadSubmissions={props.autoLoadSubmissions}
                color={color} noPopup={props.noPopup}
                trigger={leftRowButton}
                action={action} projectId={props.projectId}
                semesterName={props.semesterName}
                projectName={props.projectName}
                key={`tooltip-${action.action_title}-${idx}`}
                reloadTimelineActions={props.reloadTimelineActions}
            />
        }
        leftSideRows.push(leftRow)
    })

    const ganttChartContainer = (<div
        className="gantt-chart">
            {ganttBars}
        </div>);

    const ganttContainer = (<div
        className='gantt-container'
        style={{'gridAutoColumns' : 100/timeSpans[selectedTimeSpan] + '%'}}>
        <GanttChartBackdrop
            ref={todayRef}
            semesterStart={semesterStartDate}
            semesterEnd={semesterEndDate}
            timeSpan={selectedTimeSpan}
            isMobile={isMobile()}/>
        {ganttChartContainer}
    </div>)
    
    // Show or hide sidebar according to if the user is on mobile or not
    let containerClassname;
    let ganttSideContainer;
    if(isMobile()) {
        // If it is a mobile device allow 0px col size using "gantt no-sidebar" style
        // and set sidebar size to 0px
        containerClassname = "gantt no-sidebar";
        ganttSideContainer = (<div className='sidebar-container empty'></div>);
    } else {
        // If it isn't mobile just use the default "gantt" style with a 
        // min 200px size to allow for the sidebar and add in the sidebar
        containerClassname = "gantt";
        ganttSideContainer = (<div
            className='sidebar-container'>
            {leftSideRows}
        </div>);
    }
    
    // ---------------- RENDER ------------------
    return (
        <div>
            <div>
                <label htmlFor="TimeSpan">Time Span </label>
                <select name="TimeSpan" defaultValue={selectedTimeSpan} onChange={onTimeSpanChange}>
                    <option value="week">2 weeks</option>
                    <option value="month">month</option>
                    <option value="project">project</option>
                </select>
            </div>
            <div className={containerClassname}
                ref={containerRef}
                style={{'gridAutoColumns' : 100/timeSpans[selectedTimeSpan] + '%'}}>
                {ganttSideContainer}
                {ganttContainer}
            </div>
        </div>
    );
}
