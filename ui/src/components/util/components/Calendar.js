import { useState, useEffect } from "react";
import ToolTip from "../../Tabs/DashboardTab/TimelinesView/Timeline/ToolTip.js";
import _ from "lodash";
import { max } from "moment";
import { Popup } from "semantic-ui-react";
import "./../../../css/components/calendar.css";
import "./../../../css/utils/responsive.css";

const SPECIAL_DATES = {
  "01-01": "New Year's Day",
  "06-19": "Juneteenth",
  "07-04": "Independence Day",
  "12-24": "Christmas Eve",
  "12-25": "Christmas Day",
  "12-26": "St. Stephen's Day",
  "12-31": "New Year's Eve",
};

// this holds the holidays for the year, gets reset when the year changes
var This_Years_Holidays = {};

export function Calendar(props) {
  const [currentDate, setCurrentDate] = useState(props.initialDate);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedPopUp, setSelectedPopUp] = useState(false);

  // want reload on date change
  useEffect(() => {
    setCurrentMonth(currentDate.getMonth());
    setCurrentYear(currentDate.getFullYear());
  }, [currentDate]);

  // only want re-calculation on year change
  useEffect(() => {
    getVariableHolidays(currentYear);
  }, [currentYear]);

  function getVariableHolidays(year) {
    // reset this year's holidays NOTE: This_Years_Holidays = SPECIAL_DATES COPIES THE MEM ADDRESS of SPECIAL_DATES use spreading instead
    This_Years_Holidays = { ...SPECIAL_DATES };
    console.log("reset holidays", This_Years_Holidays);

    function getNthDayOfMonth(n, day, month) {
      let date = new Date(year, month, 1);
      let count = 0;
      while (date.getMonth() === month) {
        if (date.getDay() === day) {
          count++;
          if (count === n) return date;
        }
        date.setDate(date.getDate() + 1);
      }
      return null;
    }

    function getLastThursdayOfNovember() {
      let date = new Date(year, 10, 30); // Start at Nov 30
      while (date.getDay() !== 4) {
        // Thursday
        date.setDate(date.getDate() - 1);
      }
      return date;
    }

    function getDayAfter(date) {
      let nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }

    const variableHolidays = {
      "Memorial Day": getNthDayOfMonth(4, 1, 4), // Last Monday of May
      "Labor Day": getNthDayOfMonth(1, 1, 8), // First Monday of September
      "Thanksgiving Day": getLastThursdayOfNovember(), // Fourth Thursday of November
      "Day After Thanksgiving": getDayAfter(getLastThursdayOfNovember()),
    };

    console.log(
      "variableHolidays",
      variableHolidays,
      "\n",
      This_Years_Holidays,
    );

    Object.entries(variableHolidays).forEach(([name, date]) => {
      const key = date.toISOString().slice(5, 10);
      This_Years_Holidays[key] = name;
    });
  }

  //actions dont nativly have a color field for display, this adds it for the calendar
  const sortedActions = _.sortBy(
    props.actions.map((action) => ({
      ...action,
      color: (() => {
        switch (action.state) {
          case "yellow":
            return "#885601";
          case "red":
            return "#fd2723";
          case "green":
            return "#0000ff";
          case "grey":
            return "#484848";
          case "purple":
            return "#b66dff";
          default: //defaults to grey
            return `#484848`;
        }
      })(),
    })),
    ["due_date", "start_date", "action_title"],
  );

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setCurrentMonth(currentMonth - 1);
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setCurrentMonth(currentMonth + 1);
  };

  // Check if a date is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (day) => {
    return (
      selectedDate?.getDate() === day &&
      selectedDate?.getMonth() === currentMonth &&
      selectedDate?.getFullYear() === currentYear
    );
  };

  // Get actions for a specific day
  // Actions are displayed in a hierarchical order: TOP (Holidays, breaks, tasks) BOTTOM
  const getActionsForDay = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const monthDay = `${date.toLocaleString("default", { month: "2-digit" })}-${date.toLocaleString("default", { day: "2-digit" })}`;
    const actions = sortedActions.filter((action) => {
      const actionStart = new Date(action.start_date);
      const actionEnd = new Date(action.due_date);
      return (
        date >= new Date(actionStart.setHours(0, 0, 0, 0)) &&
        date <= new Date(actionEnd.setHours(23, 59, 59, 999))
      );
    });
    if (This_Years_Holidays[monthDay]) {
      // add special holiday
      actions.unshift({
        action_title: This_Years_Holidays[monthDay],
        start_date: date,
        due_date: date,
        color: "#b66dff",
        state: "purple",
        action_target: "break_period",
      });
    }
    return actions.sort((a, b) => {
      if (a.action_target === "break_period") return -1;
      if (b.action_target === "break_period") return 1;
      if (a.action_target === "holiday") return -1;
      if (b.action_target === "holiday") return 1;
      return 0;
    });
  };

  // Check if an action starts on a specific day
  const actionStartsOnDay = (action, day) => {
    const date = new Date(currentYear, currentMonth, day);
    const actionStart = new Date(action.start_date);
    return (
      date.getDate() === actionStart.getDate() &&
      date.getMonth() === actionStart.getMonth() &&
      date.getFullYear() === actionStart.getFullYear()
    );
  };

  // Calculate action display position (for overlapping actions)
  const calculateActionPosition = (action, index) => {
    // Always position actions in order, regardless of start date
    // This ensures consistent display even for multi-day events
    return {
      top: index * 20, // 20px per action
      isStart: actionStartsOnDay(action, new Date(action.start_date).getDate()),
    };
  };

  // Creates and styles the actions for that particular day
  const generateActionsForDay = (actionsForDay, day) => {
    return actionsForDay.slice(0, actionsForDay.length).map((action, index) => {
      const position = calculateActionPosition(action, index);
      const start = `${new Date(action.start_date).getMonth() + 1}/${new Date(action.start_date).getDate()}`;
      const end = `${new Date(action.due_date).getMonth() + 1}/${new Date(action.due_date).getDate()}`;

      // Add z-index to ensure proper stacking of overlapping actions
      const actionStyle = {
        top: `${position.top}px`,
        backgroundColor: action.color,
        borderLeft: position.isStart ? "none" : "4px solid transparent",
        left: position.isStart ? "0" : "-4px",
        zIndex: 10 + index, // Add z-index based on index
      };

      // for strikethrough (completed actions)
      const actionContent =
        action.state === "green" ? (
          <s>{action.action_title}</s>
        ) : (
          action.action_title
        );

      const trigger = (
        <div
          key={`action-${action.action_id}-${day}`}
          className="calendar-action"
          style={actionStyle}
          title={`${action.action_title} (${start} - ${end})`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent day click
            console.log("trigger clicked", day, action);
          }}
        >
          {actionContent}
        </div>
      );
      return (
        // Add ToolTip to each action for the popup
        <ToolTip
          zIndex={10 + index}
          autoLoadSubmissions={props.autoLoadSubmissions}
          color={action.color}
          noPopup={props.noPopup}
          trigger={trigger}
          action={action}
          projectId={props.projectId}
          semesterName={props.semesterName}
          projectName={props.projectName}
          key={`tooltip-${action.action_title}-${action.action_id}-${day}`}
          reloadTimelineActions={props.reloadTimelineActions}
        />
      );
    });
  };

  // Button hover state
  const [prevHovered, setPrevHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day);
      const isDaySelected = isSelected(day);
      const actionsForDay = getActionsForDay(day);
      const maxVisibleActions = 3;

      // Determine day classes for styling
      const dayClasses = [
        "calendar-day",
        isCurrentDay ? "today" : "",
        isDaySelected ? "selected" : "",
        hoveredDay === day ? "hovered" : "",
      ]
        .filter(Boolean)
        .join(" ");

      days.push(
        <div
          key={day}
          className={dayClasses}
          onMouseEnter={() => setHoveredDay(day)}
          onMouseLeave={() => setHoveredDay(null)}
          onClick={() => {
            setSelectedDate(new Date(currentYear, currentMonth, day));
          }}
        >
          <div className={`day-number ${isCurrentDay ? "today" : ""}`}>
            {day}
          </div>
          <div className="action-container">
            {/* if there are more than actions than can be shown create a button that displays a popup with all the actions */}
            {/* TODO add option to view action from pop-up right now it doesnt work*/}
            {actionsForDay.length > maxVisibleActions ? (
              <Popup
                on="click"
                flowing={true}
                exclusive={false}
                keepInViewPort={true}
                closeOnDocumentClick={false}
                className="calendar-day"
                style={{ width: "150px", overflow: "auto", zIndex: 10 }}
                content={generateActionsForDay(actionsForDay, day)}
                basic={true}
                trigger={
                  <div
                    key={`action-${1}-${day}`}
                    className="calendar-action"
                    style={{
                      top: `0`,
                      backgroundColor: "grey",
                      borderLeft: "none",
                      left: "0",
                      zIndex: 10,
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent day click
                    }}
                  >
                    {`${actionsForDay.length} actions`}
                  </div>
                }
              />
            ) : (
              generateActionsForDay(actionsForDay, day)
            )}
          </div>
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          className={`nav-button ${prevHovered ? "hovered" : ""}`}
          onClick={prevMonth}
          onMouseEnter={() => setPrevHovered(true)}
          onMouseLeave={() => setPrevHovered(false)}
        >
          {"<"}
        </button>
        <div className="current-month">
          {" "}
          {/* DROP DOWN for month and year */}
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {monthNames[i]}
              </option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={currentYear - 5 + i}>
                {currentYear - 5 + i}
              </option>
            ))}
          </select>
        </div>
        <button
          className={`nav-button ${nextHovered ? "hovered" : ""}`}
          onClick={nextMonth}
          onMouseEnter={() => setNextHovered(true)}
          onMouseLeave={() => setNextHovered(false)}
        >
          {">"}
        </button>
      </div>

      <div className="calendar-days-header">
        <div className="day-name">Sunday</div>
        <div className="day-name">Monday</div>
        <div className="day-name">Tuesday</div>
        <div className="day-name">Wednesday</div>
        <div className="day-name">Thursday</div>
        <div className="day-name">Friday</div>
        <div className="day-name">Saturday</div>
      </div>

      <div className="calendar-grid">{generateCalendarDays()}</div>
    </div>
  );
}

export default Calendar;
