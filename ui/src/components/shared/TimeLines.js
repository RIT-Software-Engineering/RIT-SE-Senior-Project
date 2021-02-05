import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../util/constants";
import TimelineElement from "./TimelineElement";

export default function TimeLines() {
    const [timelines, setTimelines] = useState([]);
    const [activeSemesters, setActiveSemesters] = useState({});

    useEffect(() => {
        fetch(config.url.API_GET_ACTIVE_TIMELINES)
            .then((response) => response.json())
            .then((timelinesData) => {
                setTimelines(timelinesData);
            })
            .catch((error) => {
                alert("Failed to get timeline data" + error);
            });
    }, []);

    let semesters = {};
    timelines?.forEach((timeline, idx) => {
        if (!semesters[timeline.semester_id]) {
            semesters[timeline.semester_id] = [timeline];
        } else {
            semesters[timeline.semester_id].push(timeline);
        }
    });

    function handleTitleClick(e, itemProps) {
        let isSemesterActive = activeSemesters[itemProps.content];
        setActiveSemesters({
            ...activeSemesters,
            [itemProps.content]: !isSemesterActive,
        });
    }

    const generateTimeLines = () => {
        return Object.keys(semesters).map((semesterKey, idx) => {
            const semesterData = semesters[semesterKey];
            if (activeSemesters[semesterData[0]?.semester_name] === undefined) {
                const parts = semesterData[0].end_date.split("/");
                const endDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                const today = new Date();
                const active = endDate > today;
                activeSemesters[semesterData[0]?.semester_name] = active;
            }

            const semester = [
                {
                    key: semesterData[0]?.semester_id,
                    title: semesterData[0]?.semester_name,
                    active: activeSemesters[semesterData[0]?.semester_name],
                    content: {
                        content: semesterData?.map((timelineElementData) => (
                            <TimelineElement key={"timeline-"} {...timelineElementData} />
                        )),
                    },
                    semester_id: semesterData[0]?.semester_id,
                },
            ];
            return <Accordion fluid styled panels={semester} key={idx} onTitleClick={handleTitleClick} />;
        });
    };

    return <>{generateTimeLines()}</>;
}
