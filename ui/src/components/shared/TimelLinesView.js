import React, { useEffect, useState, useContext } from "react";
import { Accordion } from "semantic-ui-react";
import { config, USERTYPES } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";
import { UserContext } from "../util/UserContext";
import Timeline from "./Timeline";
import { isSemesterActive } from "../util/utils";

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
                activeSemesters[semesterData[0]?.semester_name] = isSemesterActive(semesterData[0].start_date, semesterData[0].end_date);
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
