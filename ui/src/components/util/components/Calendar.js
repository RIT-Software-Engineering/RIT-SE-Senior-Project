import { useState, useEffect } from "react"
import ToolTip from "../../Tabs/DashboardTab/TimelinesView/Timeline/ToolTip.js";
import _ from "lodash";

// TODO clean this shit up

export function Calendar(props) {
  const [currentDate, setCurrentDate] = useState(props.initialDate)
  const [selectedDate, setSelectedDate] = useState(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1000)
  const [hoveredDay, setHoveredDay] = useState(null)

  const sortedActions = _.sortBy(
    props.actions.map((action) => ({
      ...action,
      color: action.state === "green" ? "#0000ff" : "#fd2723",
    })),
    ["due_date", "start_date", "action_title"]
  );

  // Handle window resize for responsive design
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set initial width
      setWindowWidth(window.innerWidth)

      // Debounced resize handler for better performance
      let timeoutId = null
      const handleResize = () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          setWindowWidth(window.innerWidth)
        }, 150) // Debounce time
      }

      window.addEventListener("resize", handleResize)

      // Add orientation change listener for mobile devices
      window.addEventListener("orientationchange", () => {
        setTimeout(() => setWindowWidth(window.innerWidth), 200)
      })

      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("orientationchange", handleResize)
        clearTimeout(timeoutId)
      }
    }
  }, [])

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
  const calculateActionPosition = (action, actionsForDay) => {
    if (!actionStartsOnDay(action, new Date(action.start_date).getDate())) {
      return { top: 0, isStart: false }
    }

    const overlappingActions = actionsForDay.filter((e) => {
      const eStart = new Date(e.start_date)
      const eEnd = new Date(e.due_date)
      const actionStart = new Date(action.start_date)
      const actionEnd = new Date(action.due_date)

      return (
        actionStart <= eEnd &&
        actionEnd >= eStart && // Overlaps
        e.action_id !== action.action_id // Not the same action
      )
    })

    // Sort by start time
    overlappingActions.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

    // Find position in overlapping actions
    const position = overlappingActions.findIndex((e) => new Date(e.start_date) > new Date(action.start_date))

    // If not found in the middle, add to the end
    const index = position === -1 ? overlappingActions.length : position

    return {
      top: index * 20, // 20px per action
      isStart: true,
    }
  }

  // Style objects
  const styles = {
    calendar: {
      width: "100%",
      maxWidth: "100%",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    },
    calendarHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: windowWidth <= 480 ? "12px" : "16px",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #e0e0e0",
      borderRadius: "8px 8px 0 0",
    },
    currentMonth: {
      fontWeight: 600,
      fontSize: windowWidth <= 480 ? "1rem" : windowWidth <= 768 ? "1.1rem" : "1.2rem",
    },
    navButton: (isHovered) => ({
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: windowWidth <= 480 ? "1rem" : "1.2rem",
      color: "#555",
      width: windowWidth <= 480 ? "28px" : "32px",
      height: windowWidth <= 480 ? "28px" : "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      backgroundColor: isHovered ? "#f0f0f0" : "transparent",
      touchAction: "manipulation",
    }),
    calendarDaysHeader: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      padding: windowWidth <= 480 ? "6px 0" : "8px 0",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #e0e0e0",
    },
    dayName: {
      textAlign: "center",
      fontSize: windowWidth <= 360 ? "0.7rem" : windowWidth <= 480 ? "0.75rem" : "0.85rem",
      fontWeight: 500,
      color: "#666",
    },
    calendarGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      padding: windowWidth <= 480 ? "6px" : "8px",
      gap: windowWidth <= 360 ? "1px" : "2px",
    },
    calendarDay: (day, isHovered) => {
      const isCurrentDay = isToday(day)
      const isDaySelected = isSelected(day)

      return {
        position: "relative",
        height: windowWidth <= 360 ? "60px" : windowWidth <= 768 ? "80px" : "100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        cursor: "pointer",
        borderRadius: "4px",
        margin: windowWidth <= 360 ? "1px" : "2px",
        padding: "2px",
        backgroundColor: isDaySelected
          ? isHovered
            ? "#e6f0fa"
            : "#f0f7ff"
          : isCurrentDay
            ? "#f5f9ff"
            : isHovered
              ? "#f9f9f9"
              : "white",
        border: isCurrentDay ? "1px solid #0066cc" : "1px solid #e0e0e0",
        overflow: "hidden",
        touchAction: "manipulation",
      }
    },
    dayNumber: {
      fontSize: windowWidth <= 360 ? "0.7rem" : windowWidth <= 480 ? "0.8rem" : "0.9rem",
      marginBottom: "2px",
      alignSelf: "flex-start",
    },
    actionContainer: {
      width: "100%",
      position: "relative",
      flex: 1,
      overflow: "hidden",
    },
    action: (action, position) => ({
      position: "absolute",
      top: `${position.top}px`,
      left: position.isStart ? "0" : "-4px",
      right: "0",
      height: "18px",
      backgroundColor: action.color,
      color: "white",
      fontSize: "0.65rem",
      padding: "1px 4px",
      borderRadius: "2px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      zIndex: 1,
      marginRight: "1px",
      boxSizing: "border-box",
      borderLeft: position.isStart ? "none" : "4px solid transparent",
    }),
    moreActions: {
      fontSize: "0.65rem",
      color: "#666",
      marginTop: "2px",
    },
    emptyDay: {
      height: windowWidth <= 360 ? "60px" : windowWidth <= 768 ? "80px" : "100px",
      margin: windowWidth <= 360 ? "1px" : "2px",
      border: "1px solid #f0f0f0",
      borderRadius: "4px",
      backgroundColor: "#fafafa",
    },
  }

  // Button hover state
  const [prevHovered, setPrevHovered] = useState(false)
  const [nextHovered, setNextHovered] = useState(false)

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} style={styles.emptyDay}></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day)
      const actionsForDay = getActionsForDay(day)
      const maxVisibleActions = windowWidth <= 360 ? 1 : windowWidth <= 768 ? 2 : 3
      const hasMoreActions = actionsForDay.length > maxVisibleActions
      days.push(
        <div
          key={day}
          style={styles.calendarDay(day, hoveredDay === day)}
          onMouseEnter={() => setHoveredDay(day)}
          onMouseLeave={() => setHoveredDay(null)}
          onClick={() => { setSelectedDate(new Date(currentYear, currentMonth, day));}}
        >
          <div
            style={{
              ...styles.dayNumber,
              fontWeight: isCurrentDay ? "bold" : "normal",
              color: isCurrentDay ? "#0066cc" : "#333",
            }}
            
          >
            {day}
          </div>
          <div style={styles.actionContainer}>
            {actionsForDay.slice(0, maxVisibleActions).map((action) => {
              const position = calculateActionPosition(action, actionsForDay)
              const start = `${new Date(action.start_date).getMonth()}/${new Date(action.start_date).getDate()}` 
              const end = `${new Date(action.due_date).getMonth()}/${new Date(action.due_date).getDate()}`

              const trigger = (
                <div
                key={action.action_id}
                style={styles.action(action, position)}
                title={`${action.action_title} ( ${start} - ${end} )`}
                onClick={(e) => console.log("trigger clicked", day, action)}>
                  {action.color === "#0000ff" ? <s>{action.action_title}</s> : action.action_title}
                </div>
              );

              return (
                <>
                  {trigger}
                  {action.color === "#0000ff" ? <s>{action.action_title}</s> : action.action_title}
                  <ToolTip
                          autoLoadSubmissions={props.autoLoadSubmissions}
                          color={action.color}
                          noPopup={props.noPopup}
                          trigger={trigger}
                          action={action}
                          projectId={props.projectId}
                          semesterName={props.semesterName}
                          projectName={props.projectName}
                          key={`tooltip-${action.action_title}-${action.id}`}
                          reloadTimelineActions={props.reloadTimelineActions}
                        />
                </>
              )
            })}
            {hasMoreActions && <div style={styles.moreActions}>+{actionsForDay.length - maxVisibleActions} more</div>}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <div style={styles.calendar}>
      <div style={styles.calendarHeader}>
        <button
          style={styles.navButton(prevHovered)}
          onClick={prevMonth}
          onMouseEnter={() => setPrevHovered(true)}
          onMouseLeave={() => setPrevHovered(false)}
        >
          {"<"}
        </button>
        <div style={styles.currentMonth}>
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button
          style={styles.navButton(nextHovered)}
          onClick={nextMonth}
          onMouseEnter={() => setNextHovered(true)}
          onMouseLeave={() => setNextHovered(false)}
        >
          {">"}
        </button>
      </div>

      <div style={styles.calendarDaysHeader}>
        {dayNames.map((day) => (
          <div key={day} style={styles.dayName} >
            {day}
          </div>
        ))}
      </div>

      <div style={styles.calendarGrid}>{generateCalendarDays()}</div>
    </div>
  )
}

