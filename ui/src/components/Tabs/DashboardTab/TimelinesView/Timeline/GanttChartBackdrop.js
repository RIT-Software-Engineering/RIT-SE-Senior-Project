import React, { forwardRef } from 'react'
import { numDaysLeftInYear, isSemesterActive, dateDiff, daysInMonth } from "../../../../util/functions/utils";
import _ from "lodash";

export default forwardRef(function GanttChartBackdrop(props, todayRef) {
    const semesterActive = props.semesterActive;
    const today = props.today;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekNames = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"];
    let ganttHeader = [];
    let ganttCols = [];

    // ------------- CHART CONSTRUCTION -------------
    let startCol = props.ganttStart;
    let cols = props.ganttLength;
    // curr for current ___ in the construction of the chart
    let currDate = startCol.getUTCDate();
    let currMonth = startCol.getUTCMonth();
    let currYear = startCol.getUTCFullYear();
    let monthLength = daysInMonth(startCol.getUTCMonth(), startCol.getUTCFullYear());  

    // sticky text left - 200px is fixed sidebar width
    let sidebarWidth = props.isMobile ? 0 : '200px';
    let isToday;
    let isProjectStart;
    let isProjectEnd;

    if (props.timeSpan == 'week') {
        ganttHeader.push(<div
            key={props.timeSpan + 'first' + 0}
            className="gantt-header first"
            style={{'gridColumn' : 1 + ' / span ' + (7-(startCol.getDay()%7))}}
            ><p style={{'left' : sidebarWidth}}>{monthNames[currMonth]} {currDate}</p></div>);

    } else if (props.timeSpan == 'month') {
        ganttHeader.push(<div
            key={props.timeSpan + 'first' + 0}
            className="gantt-header first"
            style={{'gridColumn' : 1 + ' / span ' + (monthLength - currDate + 1)}}
            ><p style={{'left' : sidebarWidth}}>{monthNames[currMonth]}</p></div>);

    } else { // project
        ganttHeader.push(<div
            key={props.timeSpan + 'first' + 0}
            className="gantt-header first"
            style={{'gridColumn' : 1 + ' / span ' + (numDaysLeftInYear(startCol) + 1)}}
            ><p style={{'left' : sidebarWidth}}>{currYear}</p></div>);

        ganttHeader.push(<div
            key={props.timeSpan + 'second' + 0}
            className="gantt-header second"
            style={{'gridColumn' : 1 + ' / span ' + (monthLength - currDate + 1)}}
            ><p style={{'left' : sidebarWidth}}>{monthNames[currMonth]}</p></div>);

    }

    // columns
    for (let i = 1; i < cols; i++) {
        isToday = semesterActive ? (today.getUTCDate() == currDate && today.getUTCMonth() == currMonth && today.getUTCFullYear() == currYear) : false;
        isProjectStart = props.projectStart.getUTCDate() == currDate && props.projectStart.getUTCMonth() == currMonth && props.projectStart.getUTCFullYear() == currYear;
        isProjectEnd = props.projectEnd.getUTCDate() == currDate && props.projectEnd.getUTCMonth() == currMonth && props.projectEnd.getUTCFullYear() == currYear;

        if (props.timeSpan == 'week') {
            // if new month
            if (currDate == monthLength + 1) {
                currDate = 1;
                currMonth = currMonth + 1;
                if (currMonth == 12) {
                    currMonth = 0;
                    currYear++;
                }
                monthLength = daysInMonth(currMonth, currYear);
            }

            if ((startCol.getDay() + i - 1)%7 == 0) {
                ganttHeader.push(<div
                key={props.timeSpan + 'first' + i}
                className="gantt-header first"
                style={{'gridColumn' : i + ' / span ' + 7}}
                ><p style={{'left' : sidebarWidth}}>{monthNames[currMonth]} {currDate}</p></div>);
            }

            // per day (header names)
            ganttHeader.push(<div
                key={props.timeSpan + 'second' + i}
                className="gantt-header second"
                style={{'gridColumn' : i}}
                ><p style={{'left' : sidebarWidth}}>{weekNames[(startCol.getDay() + i - 1)%7]}</p></div>); // days of week

        } else if (props.timeSpan == 'month') {
            // if new month
            if (currDate == monthLength + 1) {
                currDate = 1;
                currMonth = currMonth + 1;
                if (currMonth == 12) {
                    currMonth = 0;
                    currYear++;
                }
                monthLength = daysInMonth(currMonth, currYear);
                if (i + monthLength > cols) { // to cut off the month at the end of the calendar (not really necessary)
                    monthLength = monthLength - (i + monthLength - cols);
                }
    
                ganttHeader.push(<div
                    key={props.timeSpan + 'first' + i}
                    className="gantt-header first"
                    style={{'gridColumn' : i + ' / span ' + monthLength}}
                    ><p style={{'left' : sidebarWidth}}>{monthNames[currMonth]}</p></div>);
            }

            let paddingLeft = props.isMobile ? 0 : '5px';
            // per day (header names)
            ganttHeader.push(<div
                key={props.timeSpan + 'second' + i}
                className="gantt-header second"
                style={{'gridColumn' : i}}
                ><p style={{'left' : sidebarWidth, 'paddingLeft' : paddingLeft}}>{currDate}</p></div>); // date

    
        } else { // project
            // if new month
            if (currDate == monthLength + 1) {
                currDate = 1;
                currMonth = currMonth + 1;
                if (currMonth == 12) {
                    currMonth = 0;
                    currYear++;

                    ganttHeader.push(<div
                    key={props.timeSpan + 'first' + i}
                    className="gantt-header first"
                        style={{'gridColumn' : i + ' / span ' + (((currYear % 4 === 0 && currYear % 100 > 0) || currYear %400 == 0) ? 366 : 365)}}
                        ><p style={{'left' : sidebarWidth}}>{currYear}</p></div>);
                }
                monthLength = daysInMonth(currMonth, currYear);
                if (i + monthLength > cols) { // to cut off the month at the end of the calendar
                    monthLength = monthLength - (i + monthLength - cols);
                }

                // per month (header names)
                ganttHeader.push(<div
                    key={props.timeSpan + 'second' + i}
                    className="gantt-header second"
                    style={{'gridColumn' : i + '/ span ' + monthLength}}
                    ><p style={{'left' : sidebarWidth}}>{monthNames[currMonth]}</p></div>); // month
                }

            
        }

        // per day (column colors)
        ganttCols.push(<div
            key={props.timeSpan + i}
            className={isToday ? 'gantt-col today' : isProjectStart ? 'gantt-col projectStart' : isProjectEnd ? 'gantt-col projectEnd' 
                : ((startCol.getUTCDay() + i - 1)%7 == 0 || ((startCol.getUTCDay() + i - 1)%7) == 6 ? 'gantt-col weekend' : 'gantt-col weekday')}
            ref={isToday ? todayRef : null}
            style={{'gridColumn' : i}}
            ></div>);
    
        currDate++;
    }
    
    // ---------------- RENDER ------------------
    return (<>
        <div className="gantt-header" style={{'gridColumn' : '2/' + (props.ganttLength+1)}}>
            {ganttHeader}</div>
        <div className='gantt-background' style={{'gridColumn' : '2/' + (props.ganttLength+1)}}>
            {ganttCols}</div>
    </>);
});
