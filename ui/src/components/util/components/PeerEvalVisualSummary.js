import { useEffect, useState, useContext } from "react";
import { UserContext } from "../functions/UserContext";

const BarGraph = ({ data, width, height }) => {
  const userContext = useContext(UserContext);
  const [userFeedback, setUserFeedback] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (!data || !data.Students) {
      return;
    }
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

  const padding = 50;
  const maxScore = 5;

  function randColorFromName(name) {
    const hash = Array.from(name).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }

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
            <svg width="15" height="15" style={{ marginRight: "5px" }}>
              <rect
                x="0"
                y="0"
                width="15"
                height="15"
                fill={randColorFromName(person[0].split(" ")[0])}
              />
            </svg>
            <span style={{ color: textColor }}>{person[0]}</span>
          </div>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${width * 1.1} ${height * 1.1}`}
        preserveAspectRatio="xMidYMid meet"
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
              personIdx * individualBarWidth +
              2 * personIdx +
              2 * categoryIdx;
            const yPos = height - padding - barHeight;

            return (
              <g key={`${personName}-${label}`}>
                <rect
                  x={xPos}
                  y={yPos}
                  width={individualBarWidth}
                  height={barHeight}
                  fill={randColorFromName(personName.split(" ")[0])}
                />
                <circle
                  cx={xPos + individualBarWidth / 2}
                  cy={yPos + individualBarWidth * 0.5}
                  r={individualBarWidth * 0.47}
                  fill={"black"}
                />
                <circle
                  cx={xPos + individualBarWidth / 2}
                  cy={yPos + individualBarWidth * 0.5}
                  r={individualBarWidth * 0.42}
                  fill={randColorFromName(personName.split(" ")[0])}
                />
                <text
                  x={xPos + individualBarWidth / 2}
                  y={yPos + individualBarWidth * 0.5 + 5}
                  fontSize={15}
                  textAnchor="middle"
                  fill="black"
                  style={{ fontWeight: "bold" }}
                >
                  {personName
                    .split(" ")
                    .map((n) => n.charAt(0).toUpperCase())
                    .join("")}
                </text>
                <text
                  x={xPos + individualBarWidth / 2}
                  y={yPos - 5}
                  fontSize={20}
                  textAnchor="middle"
                  fill={textColor}
                >
                  {parseFloat(d).toFixed(1)}
                </text>
              </g>
            );
          });
        })}

        {userFeedback.length > 0 &&
          Object.keys(userFeedback[0][1]).map((label, categoryIdx) => {
            const x =
              padding +
              categoryIdx *
                ((width - 2 * padding) /
                  Object.keys(userFeedback[0][1]).length) +
              (width - 2 * padding) /
                Object.keys(userFeedback[0][1]).length /
                2;
            const y = height - padding + 20;
            return (
              <text
                key={label}
                x={x}
                y={y + 20}
                fontSize={16}
                textAnchor="middle"
                fill={textColor}
              >
                {label}
              </text>
            );
          })}
      </svg>
    </div>
  );
};

export default BarGraph;
