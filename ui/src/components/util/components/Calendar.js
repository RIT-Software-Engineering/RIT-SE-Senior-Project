import { useState } from "react"
import ToolTip from "../../Tabs/DashboardTab/TimelinesView/Timeline/ToolTip.js"
import _ from "lodash"
import "../../../css/calendar.css"

export function Calendar(props) {
  const [currentDate, setCurrentDate] = useState(props.initialDate)
  const [selectedDate, setSelectedDate] = useState(null)
  const [hoveredDay, setHoveredDay] = useState(null)

  //actions dont nativly have a color field for display, this adds it for the calendar
  const sortedActions = _.sortBy(
    props.actions.map((action) => ({
      ...action,
      color: action.state === "green" ? "#0000ff" : "#fd2723",
    })),
    ["due_date", "start_date", "action_title"],
  )

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

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
  ]

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Check if a date is today
  const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
  }

  // Check if a date is selected
  const isSelected = (day) => {
    return (
      selectedDate?.getDate() === day &&
      selectedDate?.getMonth() === currentMonth &&
      selectedDate?.getFullYear() === currentYear
    )
  }

  // Get actions for a specific day
  const getActionsForDay = (day) => {
    const date = new Date(currentYear, currentMonth, day)
    return sortedActions.filter((action) => {
      const actionStart = new Date(action.start_date)
      const actionEnd = new Date(action.due_date)
      return date >= new Date(actionStart.setHours(0, 0, 0, 0)) && date <= new Date(actionEnd.setHours(23, 59, 59, 999))
    })
  }

  // Check if an action starts on a specific day
  const actionStartsOnDay = (action, day) => {
    const date = new Date(currentYear, currentMonth, day)
    const actionStart = new Date(action.start_date)
    return (
      date.getDate() === actionStart.getDate() &&
      date.getMonth() === actionStart.getMonth() &&
      date.getFullYear() === actionStart.getFullYear()
    )
  }

  // Calculate action display position (for overlapping actions)
  const calculateActionPosition = (action, actionsForDay, index) => {
    // Always position actions in order, regardless of start date
    // This ensures consistent display even for multi-day events
    return {
      top: index * 20, // 20px per action
      isStart: actionStartsOnDay(action, new Date(action.start_date).getDate()),
    }
  }

  // Button hover state
  const [prevHovered, setPrevHovered] = useState(false)
  const [nextHovered, setNextHovered] = useState(false) 

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1000

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day)
      const isDaySelected = isSelected(day)
      const actionsForDay = getActionsForDay(day)
      const maxVisibleActions = windowWidth <= 360 ? 1 : windowWidth <= 768 ? 2 : 3
      const hasMoreActions = actionsForDay.length > maxVisibleActions

      // Determine day classes for styling
      const dayClasses = [
        "calendar-day",
        isCurrentDay ? "today" : "",
        isDaySelected ? "selected" : "",
        hoveredDay === day ? "hovered" : "",
      ]
        .filter(Boolean)
        .join(" ")

      days.push(
        <div
          key={day}
          className={dayClasses}
          onMouseEnter={() => setHoveredDay(day)}
          onMouseLeave={() => setHoveredDay(null)}
          onClick={() => {
            setSelectedDate(new Date(currentYear, currentMonth, day))
          }}
        >
          <div className={`day-number ${isCurrentDay ? "today" : ""}`}>{day}</div>
          <div className="action-container">
            {actionsForDay.slice(0, maxVisibleActions).map((action, index) => {
              const position = calculateActionPosition(action, actionsForDay, index)
              const start = `${new Date(action.start_date).getMonth() + 1}/${new Date(action.start_date).getDate()}`
              const end = `${new Date(action.due_date).getMonth() + 1}/${new Date(action.due_date).getDate()}`

              // Add z-index to ensure proper stacking of overlapping actions
              const actionStyle = {
                top: `${position.top}px`,
                backgroundColor: action.color,
                borderLeft: position.isStart ? "none" : "4px solid transparent",
                left: position.isStart ? "0" : "-4px",
                zIndex: 10 + index, // Add z-index based on index
              }

              // for strikethrough (completed actions)
              const actionContent = action.color === "#0000ff" ? <s>{action.action_title}</s> : action.action_title

              const trigger = (
                <div
                  key={`action-${action.action_id}-${day}`}
                  className="calendar-action"
                  style={actionStyle}
                  title={`${action.action_title} (${start} - ${end})`}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent day click
                    console.log("trigger clicked", day, action)
                  }}
                >
                  {actionContent}
                </div>
              )
              return (
                // Add ToolTip to each action for the popup
                <ToolTip
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
              )
            })}
            {hasMoreActions && <div className="more-actions">+{actionsForDay.length - maxVisibleActions} more</div>}
          </div>
        </div>,
      )
    }

    return days
  }

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
          {monthNames[currentMonth]} {currentYear}
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
        {dayNames.map((day) => (
          <div key={day} className="day-name">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">{generateCalendarDays()}</div>
    </div>
  )
}

export default Calendar