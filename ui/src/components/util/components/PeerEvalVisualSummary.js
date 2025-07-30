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

  const generateColor = (index) => {
    const hue = (index * 137.5) % 360; // Nice angle for distinct hues
    return `hsl(${hue}, 70%, 50%)`;
  };

  const generatePattern = (index) => {
    const patterns = [
      // Diagonal lines
      `<pattern id="pattern${index}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="16" height="16" fill="none"/>
      <path d="M0,16 L16,0" stroke="rgba(255,255,255,1)" stroke-width="3"/>
      <path d="M-8,16 L8,0" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
      </pattern>`,
      // Dots grid
      `<pattern id="pattern${index}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="16" height="16" fill="none"/>
      <circle cx="4" cy="4" r="3" fill="rgba(0,0,0,1)"/>
      <circle cx="12" cy="12" r="3" fill="rgba(0,0,0,1)"/>
      </pattern>`,
      // Zigzag
      `<pattern id="pattern${index}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="16" height="16" fill="none"/>
      <polyline points="0,16 4,8 8,16 12,8 16,16" fill="none" stroke="rgba(255,255,255,1)" stroke-width="3"/>
      </pattern>`,
      // Crosshatch
      `<pattern id="pattern${index}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="16" height="16" fill="none"/>
      <line x1="0" y1="0" x2="16" y2="16" stroke="rgba(0,0,0,1)" stroke-width="3"/>
      <line x1="16" y1="0" x2="0" y2="16" stroke="rgba(0,0,0,1)" stroke-width="3"/>
      </pattern>`,
      // Squares grid
      `<pattern id="pattern${index}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="16" height="16" fill="none"/>
      <rect x="2" y="2" width="4" height="4" fill="rgba(0,0,0,1)"/>
      <rect x="10" y="10" width="4" height="4" fill="rgba(0,0,0,0.2)"/>
      </pattern>`,
      // Horizontal lines
      `<pattern id="pattern${index}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="16" height="16" fill="none"/>
      <line x1="0" y1="4" x2="16" y2="4" stroke="rgba(255,255,255,1)" stroke-width="3"/>
      <line x1="0" y1="12" x2="16" y2="12" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
      </pattern>`,
      // Vertical lines
      `<pattern id="pattern${index}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="16" height="16" fill="none"/>
      <line x1="4" y1="0" x2="4" y2="16" stroke="rgba(0,0,0,1)" stroke-width="3"/>
      <line x1="12" y1="0" x2="12" y2="16" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
      </pattern>`,
    ];
    return patterns[index % patterns.length];
  };

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
                fill={generateColor(index)}
              />
              <rect
                x="0"
                y="0"
                width="15"
                height="15"
                fill={`url(#pattern${index})`}
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
        <defs>
          {userFeedback.map((_, index) => (
            <svg
              key={index}
              dangerouslySetInnerHTML={{ __html: generatePattern(index) }}
            />
          ))}
        </defs>

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
                  fill={generateColor(personIdx)}
                />
                <rect
                  x={xPos}
                  y={yPos}
                  width={individualBarWidth}
                  height={barHeight}
                  fill={`url(#pattern${personIdx})`}
                />
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
