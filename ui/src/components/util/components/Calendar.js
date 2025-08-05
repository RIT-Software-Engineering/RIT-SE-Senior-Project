import { useState, useEffect } from "react";
import ToolTip from "../../Tabs/DashboardTab/TimelinesView/Timeline/ToolTip.js";
import _ from "lodash";
import { Button, Dropdown, Icon, Popup } from "semantic-ui-react";
import "./../../../css/components/calendar.css";
import "./../../../css/utils/responsive.css";
import { SecureFetch } from "../functions/secureFetch.js";
import { config } from "../functions/constants";
import { MiniActionTooltip } from "./MiniActionTooltip.js";

// this holds the holidays for the year, gets reset when the year changes
var This_Years_Holidays = {};

export function Calendar(props) {
  const [currentDate, setCurrentDate] = useState(props.initialDate);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedPopUp, setSelectedPopUp] = useState(false);
  let isDarkMode = document.body.classList.contains("dark-mode");

  // want reload on date change
  useEffect(() => {
    setCurrentMonth(currentDate.getMonth());
    setCurrentYear(currentDate.getFullYear());
  }, [currentDate]);

  // only want re-calculation on year change
  useEffect(() => {
    getVariableHolidays(currentYear);
    getConstSpecialDates();
  }, [currentYear]);

  function getConstSpecialDates() {
    // load special dates from the database
    SecureFetch(config.url.API_GET_SPECIAL_DATES)
      .then((res) => res.json())
      .then((specialDates) => {
        specialDates.forEach((date) => {
          const dateObj = new Date(`2025-${date.date_on}`);
          for (let i = 1; i <= date.duration; i++) {
            const key = dateObj.toISOString().slice(0, 10).slice(5, 10);
            This_Years_Holidays[key] = date.name;
            dateObj.setDate(dateObj.getDate() + 1);
            // console.log(`Adding special date: ${date.name} on ${key}`);
          }
        });
      });
    return null;
  }

  function getVariableHolidays(year) {
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
            return "#00b300";
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

  // Check if an action ends on a specific day
  const actionEndsOnDay = (action, day) => {
    const date = new Date(currentYear, currentMonth, day);
    const actionEnd = new Date(action.due_date);
    return (
      date.getDate() === actionEnd.getDate() &&
      date.getMonth() === actionEnd.getMonth() &&
      date.getFullYear() === actionEnd.getFullYear()
    );
  };

  const isFirstDayOfMonth = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.getDate() === 1 && date.getMonth() === currentMonth;
  };

  const isLastDayOfMonth = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return (
      date.getDate() === new Date(currentYear, currentMonth + 1, 0).getDate() &&
      date.getMonth() === currentMonth
    );
  };

  // Calculate action display position (for overlapping actions)
  const calculateActionPosition = (action, index) => {
    // Always position actions in order, regardless of start date
    // This ensures consistent display even for multi-day events
    return {
      top: index * 27, // 20px per action
      isStart: actionStartsOnDay(action, new Date(action.start_date).getDate()),
    };
  };

  // Creates and styles the actions for that particular day
  const generateActionsForDay = (actionsForDay, day) => {
    return actionsForDay.slice(0, actionsForDay.length).map((action, index) => {
      const position = calculateActionPosition(action, index);
      const start = `${new Date(action.start_date).getMonth() + 1}/${new Date(action.start_date).getDate()}`;
      const end = `${new Date(action.due_date).getMonth() + 1}/${new Date(action.due_date).getDate()}`;

      const actionStyle = {
        top: `${position.top}px`,
        backgroundColor: "inherit",

        borderTop: `3px solid ${action.color}`,
        borderBottom: `3px solid ${action.color}`,
        borderLeft:
          actionStartsOnDay(action, day) || isFirstDayOfMonth(day)
            ? `3px solid ${action.color}`
            : "none",
        borderRight:
          actionEndsOnDay(action, day) || isLastDayOfMonth(day)
            ? `3px solid ${action.color}`
            : "none",

        borderTopLeftRadius:
          actionStartsOnDay(action, day) || isFirstDayOfMonth(day)
            ? "13px"
            : "0",
        borderBottomLeftRadius:
          actionStartsOnDay(action, day) || isFirstDayOfMonth(day)
            ? "13px"
            : "0",
        borderTopRightRadius:
          actionEndsOnDay(action, day) || isLastDayOfMonth(day) ? "13px" : "0",
        borderBottomRightRadius:
          actionEndsOnDay(action, day) || isLastDayOfMonth(day) ? "13px" : "0",
        left: "0",
      };

      const showLeftArrow =
        actionEndsOnDay(action, day) && !actionStartsOnDay(action, day);
      const showRightArrow =
        actionStartsOnDay(action, day) && !actionEndsOnDay(action, day);
      const showBothArrows =
        !actionStartsOnDay(action, day) && !actionEndsOnDay(action, day);

      const maxTitleLength = 14;
      let truncatedTitle = action.action_title;
      if (truncatedTitle.length > maxTitleLength) {
        truncatedTitle = truncatedTitle.slice(0, maxTitleLength - 1) + "…";
      }

      const actionContent = (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: "100%",
          }}
        >
          {(showLeftArrow || showBothArrows) && (
            <Icon name="triangle left" size="large" />
          )}
          {action.state === "green" ? <s>{truncatedTitle}</s> : truncatedTitle}
          {(showRightArrow || showBothArrows) && (
            <Icon name="triangle right" size="large" />
          )}
        </span>
      );

      const trigger = (
        <div
          key={`action-${action.action_id}-${day}`}
          className="calendar-action"
          style={actionStyle}
          onClick={(e) => {
            e.stopPropagation(); // Prevent day click
          }}
        >
          <MiniActionTooltip
            trigger={actionContent}
            action={action}
            start={start}
            end={end}
          />
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
            <span
              style={
                This_Years_Holidays[
                  `${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                ]
                  ? {
                      color: "var(--action-bar-proposal-purple)",
                      fontWeight: "bold",
                    }
                  : {}
              }
            >
              {day}
            </span>
            {This_Years_Holidays[
              `${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            ] && (
              <Popup
                content={
                  This_Years_Holidays[
                    `${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  ]
                }
                inverted={isDarkMode}
                position="top center"
                hoverable
                trigger={
                  <span
                    style={{
                      color: "var(--action-bar-proposal-purple)",
                      display: "inline-block",
                      maxWidth: "120px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      verticalAlign: "bottom",
                      cursor: "pointer",
                    }}
                  >
                    {
                      This_Years_Holidays[
                        `${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                      ]
                    }
                  </span>
                }
              />
            )}
          </div>
          <div className="action-container">
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
    <>
      <h3>Calendar</h3>
      <div className="action-calendar">
        <div className="calendar-header">
          <div>
            <h3 style={{ display: "flex", gap: "10px" }}>
              <Dropdown
                options={monthNames.map((name, i) => ({
                  key: i,
                  text: name,
                  value: i,
                }))}
                value={currentMonth}
                onChange={(e, { value }) => setCurrentMonth(value)}
                style={{
                  backgroundColor: "transparent",
                  zIndex: 1050,
                  position: "relative",
                }}
              />
              <Dropdown
                options={Array.from({ length: 10 }, (_, i) => ({
                  key: currentYear - i + 5,
                  text: currentYear - i + 5,
                  value: currentYear - i + 5,
                }))}
                placeholder="Year"
                value={currentYear}
                onChange={(e, { value }) => setCurrentYear(value)}
                style={{
                  backgroundColor: "transparent",
                  zIndex: 1050,
                  position: "relative",
                }}
              />
            </h3>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <Button
              icon
              className={prevHovered ? "hovered" : ""}
              onClick={prevMonth}
              onMouseEnter={() => setPrevHovered(true)}
              onMouseLeave={() => setPrevHovered(false)}
            >
              <Icon name="chevron left" />
            </Button>
            <Button
              icon
              className={nextHovered ? "hovered" : ""}
              onClick={nextMonth}
              onMouseEnter={() => setNextHovered(true)}
              onMouseLeave={() => setNextHovered(false)}
            >
              <Icon name="chevron right" />
            </Button>
          </div>
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
    </>
  );
}

export default Calendar;
