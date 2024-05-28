import React, { useEffect, useState, useContext } from "react";
import { Accordion } from "semantic-ui-react";
import { config, USERTYPES } from "../../../util/functions/constants";
import { SecureFetch } from "../../../util/functions/secureFetch";
import { UserContext } from "../../../util/functions/UserContext";
import Semester from "./Semester";
import { isSemesterActive } from "../../../util/functions/utils";

const noSemesterStr = "No Semester";

export default function TimeLinesView(props) {
    const [timelines, setTimelines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSemesters, setActiveSemesters] = useState({});
    const { user } = useContext(UserContext);

    useEffect(() => {
        SecureFetch(config.url.API_GET_ACTIVE_TIMELINES)
            .then((response) => response.json())
            .then((timelinesData) => {
                setTimelines(timelinesData);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                alert("Failed to get timeline data" + error);
            });
    }, []);

    // If student has a semester but no projects, they can still see the semester's announcements
    // FIXME: This is kind of hacky, and I recommend implementing a better solution in the future.
    if (!loading && timelines.length === 0 && user?.role === USERTYPES.STUDENT && user?.semester_group) {
        return <Semester noProjects key="announcements" projects={[{ semester_id: user.semester_group }]} />
    }

    let semesters = {};
    timelines?.forEach((timeline, idx) => {
        if (timeline.semester_id === null || timeline.semester_id === undefined || timeline.semester_id === noSemesterStr) {
            timeline.semester_id = noSemesterStr;
            timeline.semester_name = noSemesterStr;
        } else if (!semesters[timeline.semester_id]) {
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
        let semesterArray = Object.keys(semesters).map((semesterKey, idx) => {
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
                        content: <Semester key="semester"
                                projects={semesterData}
                                semesterName={semesterData[0]?.semester_name}
                                semesterStart={props.semesterData[idx]?.start_date}
                                semesterEnd={props.semesterData[idx]?.end_date} />,
                    },
                    semester_id: semesterData[0]?.semester_id,
                },
            ];
            if (user?.role === USERTYPES.STUDENT) {
                return semester[0].content?.content;
            }
            return <Accordion fluid styled panels={semester} key={idx} onTitleClick={handleTitleClick} />;
        });
        semesterArray = semesterArray.reverse();
        return semesterArray;
    };

    if (loading) {
        return "Loading...";
    }

    return generateTimeLines();
}
