import { useState, useEffect } from "react";
import ToolTip from "../../Tabs/DashboardTab/TimelinesView/Timeline/ToolTip.js";
import _ from "lodash";
import { Button, Dropdown, Icon, Popup } from "semantic-ui-react";
import "./../../../css/components/calendar.css";
import "./../../../css/utils/responsive.css";
import { MiniActionTooltip } from "./MiniActionTooltip.js";

export function Calendar(props) {
  const [currentDate, setCurrentDate] = useState(props.initialDate);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const isDarkMode = document.body.classList.contains("dark-mode");

  // Update month/year when currentDate changes
  useEffect(() => {
    setCurrentMonth(currentDate.getMonth());
    setCurrentYear(currentDate.getFullYear());
  }, [currentDate]);

  // Memoize sorted actions to avoid unnecessary re-computations
  const sortedActions = _.sortBy(
    props.actions.map((action) => ({
      ...action,
      color: `var(--action-bar-proposal-${action.state})`,
    })),
    ["due_date", "start_date", "action_title"],
  );

  // Get days in month and first day of month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
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

  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setCurrentMonth(currentMonth - 1);
  };

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

  // Get actions and break periods for a specific day
  const getActionsForDay = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return sortedActions.filter((action) => {
      const actionStart = new Date(action.start_date);
      const actionEnd = new Date(action.due_date);
      return (
        date >= new Date(actionStart.setHours(0, 0, 0, 0)) &&
        date <= new Date(actionEnd.setHours(23, 59, 59, 999))
      );
    });
  };

  // Get break periods for a specific day
  const getBreaksForDay = (actionsForDay) => {
    const breaks = actionsForDay
      .filter((action) => action.action_target === "break_period")
      .sort((a, b) => {
        const aLength = new Date(a.due_date) - new Date(a.start_date);
        const bLength = new Date(b.due_date) - new Date(b.start_date);
        return aLength - bLength;
      });
    return breaks;
  };

  // Check action start/end
  const actionStartsOnDay = (action, day) => {
    const date = new Date(currentYear, currentMonth, day);
    const actionStart = new Date(action.start_date);
    return (
      date.getDate() === actionStart.getDate() &&
      date.getMonth() === actionStart.getMonth() &&
      date.getFullYear() === actionStart.getFullYear()
    );
  };

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
    return day === 1;
  };

  const isLastDayOfMonth = (day) => {
    return day === daysInMonth;
  };

  // Calculate action display position
  const calculateActionPosition = (action, index) => {
    return {
      top: index * 27,
      isStart: actionStartsOnDay(action, new Date(action.start_date).getDate()),
    };
  };

  // Generate actions for a day
  const generateActionsForDay = (actionsForDay, day, inPopup) => {
    // Filter out break_period actions for regular action display
    const filteredActions = actionsForDay.filter(
      (action) => action.action_target !== "break_period",
    );

    return filteredActions.map((action, index) => {
      const position = calculateActionPosition(action, index);
      const isFirst = isFirstDayOfMonth(day);
      const isLast = isLastDayOfMonth(day);
      const starts = actionStartsOnDay(action, day);
      const ends = actionEndsOnDay(action, day);

      let actionStyle = {
        top: `${position.top}px`,
        backgroundColor: "inherit",
        borderTop: `3px solid ${action.color}`,
        borderBottom: `3px solid ${action.color}`,
        borderLeft: starts || inPopup ? `3px solid ${action.color}` : "none",
        borderRight: ends || inPopup ? `3px solid ${action.color}` : "none",
        borderTopLeftRadius: starts || inPopup ? "13px" : "0",
        borderBottomLeftRadius: starts || inPopup ? "13px" : "0",
        borderTopRightRadius: ends || inPopup ? "13px" : "0",
        borderBottomRightRadius: ends || inPopup ? "13px" : "0",
        left: "0",
        backgroundImage: starts
          ? `linear-gradient(to right, ${action.color}, transparent)`
          : ends
            ? `linear-gradient(to left, ${action.color}, transparent)`
            : "none",
      };

      if (!starts && !ends) {
        if (isFirst) {
          actionStyle.borderImage = `linear-gradient(to bottom, ${action.color} 90%, transparent 100%) 1`;
          actionStyle.borderImageSource = `linear-gradient(to left, ${action.color} 90%, transparent 100%)`;
          actionStyle.borderImageSlice = 1;
        } else if (isLast) {
          actionStyle.borderImage = `linear-gradient(to bottom, ${action.color} 90%, transparent 100%) 1`;
          actionStyle.borderImageSource = `linear-gradient(to right, ${action.color} 90%, transparent 100%)`;
          actionStyle.borderImageSlice = 1;
        }
      }

      const showLeftArrow = ends && !starts;
      const showRightArrow = starts && !ends;
      const showBothArrows = !starts && !ends;

      const actionContent = (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: "100%",
          }}
        >
          <Icon
            name="triangle left"
            size="large"
            style={{
              visibility:
                showLeftArrow || showBothArrows ? "visible" : "hidden",
            }}
          />
          <p
            style={{
              maxWidth: "90%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginTop: "12px",
            }}
          >
            {action.state === "green" ? (
              <s>{action.action_title}</s>
            ) : (
              action.action_title
            )}
          </p>
          <Icon
            name="triangle right"
            size="large"
            style={{
              visibility:
                showRightArrow || showBothArrows ? "visible" : "hidden",
            }}
          />
        </span>
      );

      const trigger = (
        <div
          key={`action-${action.action_id}-${day}`}
          className="calendar-action"
          style={actionStyle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MiniActionTooltip trigger={actionContent} action={action} />
        </div>
      );

      return (
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
      const breakPeriod = getBreaksForDay(actionsForDay);
      const maxVisibleActions = 3;

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
                breakPeriod.length > 0
                  ? {
                      color: "var(--action-bar-proposal-purple)",
                      fontWeight: "bold",
                    }
                  : {}
              }
            >
              {day}
            </span>
            {breakPeriod.length > 0 && (
              <Popup
                content={
                  <div>
                    {breakPeriod.map((bp, index) => (
                      <div key={index}>
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {bp.action_title}
                        </span>
                        <br />
                        <span style={{ color: "grey" }}>
                          {bp.start_date}
                          {bp.start_date !== bp.due_date && (
                            <p>{bp.due_date}</p>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                }
                inverted={isDarkMode}
                position="top right"
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
                    {breakPeriod[0].action_title}
                  </span>
                }
              />
            )}
          </div>
          <div className="action-container">
            {actionsForDay.filter(
              (action) => action.action_target !== "break_period",
            ).length > maxVisibleActions ? (
              <Popup
                on="click"
                exclusive={false}
                basic
                keepInViewPort={true}
                inverted={isDarkMode}
                className="calendar-day"
                style={{
                  width: "250px",
                  overflow: "auto",
                  zIndex: 10,
                  boxShadow: "0 0 10px rgba(0,0,0,1)",
                  backgroundColor: "var(--bg-secondary)",
                  padding: "20px",
                }}
                content={generateActionsForDay(actionsForDay, day, true)}
                position="bottom center"
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "white",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {`${actionsForDay.length} actions`}
                  </div>
                }
              />
            ) : (
              generateActionsForDay(actionsForDay, day, false)
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
                  zIndex: 100,
                  position: "relative",
                  border: "none",
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
                  zIndex: 100,
                  position: "relative",
                  border: "none",
                }}
              />
            </h3>
          </div>
          <div style={{ display: "flex" }}>
            <Button
              icon="chevron left"
              className={prevHovered ? "hovered" : ""}
              onClick={prevMonth}
              onMouseEnter={() => setPrevHovered(true)}
              onMouseLeave={() => setPrevHovered(false)}
            />
            <Button
              icon="chevron right"
              className={nextHovered ? "hovered" : ""}
              onClick={nextMonth}
              onMouseEnter={() => setNextHovered(true)}
              onMouseLeave={() => setNextHovered(false)}
            />
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
