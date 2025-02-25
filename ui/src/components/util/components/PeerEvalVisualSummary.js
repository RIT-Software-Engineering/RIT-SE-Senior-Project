import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../functions/UserContext";

const BarGraph = ({ data }) => {
    const userContext = useContext(UserContext);
    const [userFeedback, setUserFeedback] = useState([]); // contains names and their associated ratings
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 }); // initial width and height

    useEffect(() => { // sorts the data (user and their scores)
        let sortedFeedback = Object.entries(data.Students).map(([student, feedback]) => [
            student, feedback.AverageRatings
        ]);
        setUserFeedback(sortedFeedback);
    }, [data, userContext]);

    const { width, height } = dimensions;
    const padding = 50;
    const maxScore = 5;
    const colors = ["#D81B60", "#1E88E5", "#FFC107", "#004D40"]; //these are colorblind safe for the bars

    return (
        <div style={{ width: "90vw", height: "50vh", maxWidth: "1000px", maxHeight: "500px" }}>
            <h2>Performance Evaluation</h2>

            {/* Key */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "10px" }}> 
                {userFeedback.map((person, index) => ( // shows the names of the users and their colors
                    <div key={person[0]} style={{ display: "flex", alignItems: "center", margin: "5px" }}>
                        <div style={{
                            width: "15px", height: "15px",
                            backgroundColor: colors[index % colors.length],
                            marginRight: "5px"
                        }}></div>
                        <span>{person[0]}</span>
                    </div>
                ))}
            </div>

            <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
                {/* Y-axis labels and grid lines */}
                {[...Array(6).keys()].map(i => {
                    const yPosition = height - padding - (i * (height - 2 * padding)) / maxScore;
                    return (
                        <g key={i}>
                            <line x1={padding} x2={width - padding} y1={yPosition} y2={yPosition} stroke="#ccc" strokeWidth={1} />
                            <text x={padding - 15} y={yPosition} fontSize={12} textAnchor="end" alignmentBaseline="middle">{i}</text>
                        </g>
                    );
                })}

                {/* Bars */}
                {userFeedback.map((personData, personIdx) => {
                    const personName = personData[0];
                    const scores = personData[1];
                    const totalCategories = Object.keys(scores).length;
                    const categoryWidth = (width - 2 * padding) / totalCategories;
                    const individualBarWidth = categoryWidth / userFeedback.length - 5;

                    return Object.entries(scores).map(([label, d], categoryIdx) => {
                        const barHeight = (d / maxScore) * (height - 2 * padding);
                        const xPos = padding + categoryIdx * categoryWidth + personIdx * individualBarWidth;
                        const yPos = height - padding - barHeight;

                        return (
                            <g key={`${personName}-${label}`}>
                                {/* Bar */}
                                <rect x={xPos} y={yPos} width={individualBarWidth} height={barHeight}
                                    fill={colors[personIdx % colors.length]} />
                                {/* Score Text */}
                                <text x={xPos + individualBarWidth / 2} y={yPos - 5}
                                    fontSize={12} textAnchor="middle" fill="black">{d}</text>
                            </g>
                        );
                    });
                })}

                {/* X-axis labels */}
                {userFeedback.length > 0 && Object.keys(userFeedback[0][1]).map((label, categoryIdx) => (
                    <text key={label}
                        x={padding + categoryIdx * ((width - 2 * padding) / Object.keys(userFeedback[0][1]).length) +
                            ((width - 2 * padding) / Object.keys(userFeedback[0][1]).length) / 2}
                        y={height - padding + 20}
                        fontSize={12} textAnchor="middle">
                        {label}
                    </text>
                ))}
            </svg>
        </div>
    );
};

export default BarGraph;
