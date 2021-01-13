import React from 'react'
import { Accordion } from 'semantic-ui-react';
import TimelineElement from './TimelineElement';

export default function TimeLines({ timelines }) {

    let semesters = {};
    timelines?.forEach( (timeline, idx) => {
        if (!semesters[timeline.semester_id]) {
            semesters[timeline.semester_id] = [timeline];
        } else {
            semesters[timeline.semester_id].push(timeline);
        }
    });

    const generateTimeLines = () => {
        return Object.keys(semesters).map((semesterKey, idx) => {
            const semesterData = semesters[semesterKey];
            const semester = [{
                key: semesterData[0]?.semester_id,
                title: semesterData[0]?.semester_name,
                content: {
                    content: semesterData?.map((timelineElementData) => <TimelineElement key={"timeline-" } {...timelineElementData} />)
                }
            }]
            return (<Accordion fluid styled panels={semester} key={idx} />)
        })
    }

    return (
        <>
            {generateTimeLines()}
        </>
    )
}
