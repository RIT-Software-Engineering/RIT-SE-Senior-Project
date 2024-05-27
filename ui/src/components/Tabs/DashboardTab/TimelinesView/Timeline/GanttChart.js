import React, { act, createElement, useEffect, useRef } from 'react'
import { ACTION_STATES } from '../../../../util/functions/constants';
// import "./../../../../../css/gantt.css";
import { isSemesterActive, dateDiff } from "../../../../util/functions/utils";
import GanttChartBackdrop from './GanttChartBackdrop';
import _ from "lodash";
import ToolTip from "./ToolTip";
import ActionToolTip from '../../../AdminTab/ActionEditor/ActionToolTip';

export default function GanttChart(props) {
    const containerRef = useRef(null);
    const firstActionRef = useRef(null);
    const todayRef = useRef(null);

    const projectStartDate = new Date(props.projectStart);
    const projectEndDate = new Date(props.projectEnd);

    // use these for the beginning and end of the gantt chart
    const ganttStartDate = new Date(projectStartDate.getFullYear(), projectStartDate.getMonth());
    const ganttEndDate = new Date(projectEndDate.getFullYear(), projectEndDate.getMonth()+1, 0);
    const ganttLength = dateDiff(ganttStartDate, ganttEndDate) + 2;

    const semesterActive = isSemesterActive(props.projectStart, props.projectEnd);
    let today = new Date();
    if (!(semesterActive)) {
        today = ganttStartDate;
    }
    const sortedActions = _.sortBy(props.actions || [], ["due_date", "start_date", "action_title"]);
    today.setHours(0,0,0,0);
    const firstAction = sortedActions.find((action) => {
        let dueDate = new Date(action?.due_date);
        return dateDiff(dueDate, today) <= 0;});
    const timeSpans = {'week' : 14, 'month' : 31, 'project' : ganttLength};
    const [selectedTimeSpan, setSelectedTimeSpan] = React.useState(semesterActive ? 'week' : 'project');
    let sidebarWidth = isMobile() ? 0 : 200;    // sticky text left - 200px is fixed sidebar width

    useEffect(()=> {
        if (semesterActive && firstAction) {
            try {
                let viewTop = firstActionRef.current.offsetTop - todayRef.current.offsetTop;
                let viewLeft = todayRef.current.offsetLeft - sidebarWidth;
                containerRef.current.scrollTo(viewLeft, viewTop);    
            } catch (e) {
                console.log('issue with snapping to current day (x), first action (y)', e);
            }
        }
    }, [props.actions, selectedTimeSpan, props.isOpen]);

    function onTimeSpanChange(e) {
        setSelectedTimeSpan(e.target.value);
    }

    // Function to check if a user a on a mobile device.
    // *** Uncomment commented lines if you want to limit sidebar 
    // to a certain screen size, but this will only happen on initial load. 
    // You need to refresh to get sidebar back if resizing to bigger screen. ***
    function isMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        // const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;;

        return isMobileDevice; //|| isSmallScreen;
    }

    // ----------------- ROWS -------------------
    let ganttBars = [];
    let leftSideRows = [];
    let startCol = ganttStartDate;
    leftSideRows.push(<div key={'sidebar header'} className="sidebar header">Name</div>);

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
        const barSpan = dateDiff(startDate, dueDate) + 1 + 1; // plus 1 for an action's reach (midnight of day 1 looks like start of day 2)

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
                containerRef={containerRef}
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
                containerRef={containerRef}
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
        className="gantt-chart"
        style={{'gridColumn' : '2/' + (ganttLength+1)}}>
            {ganttBars}
        </div>);

    const ganttContainer = (<div
        className='gantt-container'
        // style would be in dashboard.css, but gantt length changes between
        // different projects, so must be specified here
        style={{'gridColumn' : '1/' + (ganttLength+1)}}>
        <GanttChartBackdrop
            ref={todayRef}
            ganttStart={ganttStartDate}
            ganttEnd={ganttEndDate}
            ganttLength={ganttLength}
            projectStart={projectStartDate}
            projectEnd={projectEndDate}
            semesterActive={semesterActive}
            today={today}
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
                style={{'gridAutoColumns' : 100/(timeSpans[selectedTimeSpan] > 200 ? 200 : timeSpans[selectedTimeSpan]) + '%'}}>
                {ganttSideContainer}
                {ganttContainer}
            </div>
        </div>
    );
}
