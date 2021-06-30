import React, { useEffect, useState, useContext } from "react";
import { Accordion } from "semantic-ui-react";
import { config, USERTYPES } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";
import { UserContext } from "../util/UserContext";
import Timeline from "./Timeline";

export default function TimeLines() {
    const [timelines, setTimelines] = useState([]);
    const [activeSemesters, setActiveSemesters] = useState({});
    const userContext = useContext(UserContext);

    useEffect(() => {
        SecureFetch(config.url.API_GET_ACTIVE_TIMELINES)
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
                // Note: I'm not sure if the server uses EDT or EST or switches between them but at the time of writing this,
                // (in the middle of summer) the server is using EDT. This can result in a 1 hours offset if the server switches to EST.
                // Although, this will only have any impact for 1-2 hours a year if a semester ends on or around daylight savings changes.
                const endDate = new Date(`${semesterData[0].end_date} EDT`);
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
                        content: semesterData?.map((timelineElementData) => {
                            return <Timeline key={"timeline-"} elementData={timelineElementData} />
                        }),
                    },
                    semester_id: semesterData[0]?.semester_id,
                },
            ];
            if (userContext.user?.role === USERTYPES.STUDENT) {
                return semester[0].content?.content;
            }
            return <Accordion fluid styled panels={semester} key={idx} onTitleClick={handleTitleClick} />;
        });
    };

    return generateTimeLines();
}
