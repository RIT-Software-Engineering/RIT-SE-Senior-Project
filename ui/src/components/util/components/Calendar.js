import { useState, useEffect } from "react"
import ToolTip from "../../Tabs/DashboardTab/TimelinesView/Timeline/ToolTip.js";

// TODO: get date selecting color changes working, get Tooltip date select working

export function Calendar(props) {
  const [currentDate, setCurrentDate] = useState(props.initialDate)
  const [selectedDate, setSelectedDate] = useState(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1000)
  const [hoveredDay, setHoveredDay] = useState(null)

  let events = props.events.map((event) => {
    return {
      id: event.action_id,
      title: event.action_title,
      start: new Date(event.start_date),
      end: new Date(event.due_date),
      color: event.state === "green" ? "#0000ff" : "#fd2723"
    }
  })

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

  // Get events for a specific day
  const getEventsForDay = (day) => {
    const date = new Date(currentYear, currentMonth, day)
    return events.filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      return date >= new Date(eventStart.setHours(0, 0, 0, 0)) && date <= new Date(eventEnd.setHours(23, 59, 59, 999))
    })
  }

  // Check if an event starts on a specific day
  const eventStartsOnDay = (event, day) => {
    const date = new Date(currentYear, currentMonth, day)
    const eventStart = new Date(event.start)
    return (
      date.getDate() === eventStart.getDate() &&
      date.getMonth() === eventStart.getMonth() &&
      date.getFullYear() === eventStart.getFullYear()
    )
  }

  // Calculate event display position (for overlapping events)
  const calculateEventPosition = (event, eventsForDay) => {
    if (!eventStartsOnDay(event, new Date(event.start).getDate())) {
      return { top: 0, isStart: false }
    }

    const overlappingEvents = eventsForDay.filter((e) => {
      const eStart = new Date(e.start)
      const eEnd = new Date(e.end)
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)

      return (
        eventStart <= eEnd &&
        eventEnd >= eStart && // Overlaps
        e.id !== event.id // Not the same event
      )
    })

    // Sort by start time
    overlappingEvents.sort((a, b) => new Date(a.start) - new Date(b.start))

    // Find position in overlapping events
    const position = overlappingEvents.findIndex((e) => new Date(e.start) > new Date(event.start))

    // If not found in the middle, add to the end
    const index = position === -1 ? overlappingEvents.length : position

    return {
      top: index * 20, // 20px per event
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
    eventContainer: {
      width: "100%",
      position: "relative",
      flex: 1,
      overflow: "hidden",
    },
    event: (event, position) => ({
      position: "absolute",
      top: `${position.top}px`,
      left: position.isStart ? "0" : "-4px",
      right: "0",
      height: "18px",
      backgroundColor: event.color || "#4285f4",
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
    moreEvents: {
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
      const eventsForDay = getEventsForDay(day)
      const maxVisibleEvents = windowWidth <= 360 ? 1 : windowWidth <= 768 ? 2 : 3
      const hasMoreEvents = eventsForDay.length > maxVisibleEvents

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
          <div style={styles.eventContainer}>
            {eventsForDay.slice(0, maxVisibleEvents).map((event) => {
              const position = calculateEventPosition(event, eventsForDay)
              const start = `${new Date(event.start).getMonth()}/${new Date(event.start).getDate()}` 
              const end = `${new Date(event.end).getMonth()}/${new Date(event.end).getDate()}`

              const trigger = (
                <button className={`action-bar ${event.color}`} key={event.id}>
                  {
                    <div className="action-bar-text" title={event.title}>
                      {event.title}
                    </div>
                  }
                </button>
              );

              return (
                <div
                  key={event.id}
                  style={styles.event(event, position)}
                  title={`${event.title} ( ${start} - ${end} )`}
                  onClick={(e) => console.log("clicked", day)}
                >
                  {event.color === "#0000ff" ? <s>{event.title}</s> : event.title}
                  <ToolTip
                          autoLoadSubmissions={props.autoLoadSubmissions}
                          color={event.color}
                          noPopup={props.noPopup}
                          trigger={trigger}
                          action={event}
                          projectId={props.projectId}
                          semesterName={props.semesterName}
                          projectName={props.projectName}
                          key={`tooltip-${event.title}-${event.id}`}
                          reloadTimelineActions={props.reloadTimelineActions}
                        />
                </div>
              )
            })}
            {hasMoreEvents && <div style={styles.moreEvents}>+{eventsForDay.length - maxVisibleEvents} more</div>}
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
          &lt;
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
          &gt;
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

