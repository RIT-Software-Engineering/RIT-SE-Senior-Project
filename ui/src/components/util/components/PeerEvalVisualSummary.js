import { useEffect, useState, useContext } from "react";
import { UserContext } from "../functions/UserContext";
import "../../../App.css";

const BarGraph = ({ data }) => {
  const userContext = useContext(UserContext);
  const [userFeedback, setUserFeedback] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const sortedFeedback = Object.entries(data.Students).map(
      ([student, feedback]) => [student, feedback.AverageRatings],
    );
    setUserFeedback(sortedFeedback);

    // Check for dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    };

    // Initial check
    checkDarkMode();

    // TODO CHANGE THIS SO THAT DARK MODE WORKS, THIS IS JUST A WORK AROUND

    // Set up an observer to watch for changes to the body's class list
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Cleanup
    return () => observer.disconnect();
  }, [data, userContext]);

  const { width, height } = dimensions;
  const padding = 50;
  const maxScore = 5;
  const colors = ["#D81B60", "#1E88E5", "#FFC107", "#004D40"];

  // Define text color based on dark mode
  const textColor = isDarkMode ? "#ffffff" : "#000000";

  return (
    <div
      style={{
        width: "90vw",
        height: "50vh",
        maxWidth: "1000px",
        maxHeight: "500px",
      }}
    >
      <h2 style={{ color: textColor }}>Performance Evaluation</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        {userFeedback.map((person, index) => (
          <div
            key={person[0]}
            style={{ display: "flex", alignItems: "center", margin: "5px" }}
          >
            <div
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: colors[index % colors.length],
                marginRight: "5px",
              }}
            ></div>
            <span style={{ color: textColor }}>{person[0]}</span>
          </div>
        ))}
      </div>

      <svg
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
      >
        {[...Array(6).keys()].map((i) => {
          const yPosition =
            height - padding - (i * (height - 2 * padding)) / maxScore;
          return (
            <g key={i}>
              <line
                x1={padding}
                x2={width - padding}
                y1={yPosition}
                y2={yPosition}
                strokeWidth={1}
                stroke={textColor}
              />
              <text
                x={padding - 15}
                y={yPosition}
                fontSize={12}
                textAnchor="end"
                alignmentBaseline="middle"
                fill={textColor}
              >
                {i}
              </text>
            </g>
          );
        })}

        {userFeedback.map((personData, personIdx) => {
          const personName = personData[0];
          const scores = personData[1];
          const totalCategories = Object.keys(scores).length;
          const categoryWidth = (width - 2 * padding) / totalCategories;
          const individualBarWidth = categoryWidth / userFeedback.length - 5;

          return Object.entries(scores).map(([label, d], categoryIdx) => {
            const barHeight = (d / maxScore) * (height - 2 * padding);
            const xPos =
              padding +
              categoryIdx * categoryWidth +
              personIdx * individualBarWidth;
            const yPos = height - padding - barHeight;

            return (
              <g key={`${personName}-${label}`}>
                <rect
                  x={xPos}
                  y={yPos}
                  width={individualBarWidth}
                  height={barHeight}
                  fill={colors[personIdx % colors.length]}
                />
                <text
                  x={xPos + individualBarWidth / 2}
                  y={yPos - 5}
                  fontSize={12}
                  textAnchor="middle"
                  fill={textColor}
                >
                  {d}
                </text>
              </g>
            );
          });
        })}

        {userFeedback.length > 0 &&
          Object.keys(userFeedback[0][1]).map((label, categoryIdx) => (
            <text
              key={label}
              x={
                padding +
                categoryIdx *
                  ((width - 2 * padding) /
                    Object.keys(userFeedback[0][1]).length) +
                (width - 2 * padding) /
                  Object.keys(userFeedback[0][1]).length /
                  2
              }
              y={height - padding + 20}
              fontSize={12}
              textAnchor="middle"
              fill={textColor}
            >
              {label}
            </text>
          ))}
      </svg>
    </div>
  );
};

export default BarGraph;
