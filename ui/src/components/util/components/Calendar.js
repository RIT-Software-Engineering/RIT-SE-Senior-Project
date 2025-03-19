import { useState, useEffect } from "react"

// TODO: add actions support, multiple actions per day (pop up if multiple? with option for completed/uncompleted/all?)


export function Calendar({ initialDate = new Date(), onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [selectedDate, setSelectedDate] = useState(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1000)
  const [hoveredDay, setHoveredDay] = useState(null)

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

  // Handle date selection
  const handleDateClick = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day)
    setSelectedDate(selectedDate)
    if (onDateSelect) {
      onDateSelect(selectedDate)
    }
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

  // Style objects
  const styles = {
    calendar: {
      width: "100%",
      maxWidth: windowWidth <= 480 ? "100%" : "400px",
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
      touchAction: "manipulation", // Improves touch experience
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
        aspectRatio: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        borderRadius: "50%",
        margin: windowWidth <= 360 ? "1px" : "2px",
        fontSize: windowWidth <= 360 ? "0.7rem" : windowWidth <= 480 ? "0.8rem" : "0.9rem",
        padding: windowWidth <= 360 ? "0" : "2px",
        backgroundColor: isDaySelected
          ? isHovered
            ? "#0052a3"
            : "#0066cc"
          : isCurrentDay
            ? "#e6f7ff"
            : isHovered
              ? "#f0f0f0"
              : "transparent",
        color: isDaySelected ? "white" : isCurrentDay ? "#0066cc" : "inherit",
        fontWeight: isCurrentDay || isDaySelected ? "bold" : "normal",
        touchAction: "manipulation", // Improves touch experience
      }
    },
    emptyDay: {
      aspectRatio: "1",
      margin: windowWidth <= 360 ? "1px" : "2px",
      cursor: "default",
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
      days.push(
        <div
          key={day}
          style={styles.calendarDay(day, hoveredDay === day)}
          onClick={() => handleDateClick(day)}
          onMouseEnter={() => setHoveredDay(day)}
          onMouseLeave={() => setHoveredDay(null)}
        >
          {day}
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
          &lt; {/* < */}
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
          &gt; {/* > */}
        </button>
      </div>

      <div style={styles.calendarDaysHeader}>
        {dayNames.map((day) => (
          <div key={day} style={styles.dayName}>
            {day}
          </div>
        ))}
      </div>

      <div style={styles.calendarGrid}>{generateCalendarDays()}</div>
    </div>
  )
}

