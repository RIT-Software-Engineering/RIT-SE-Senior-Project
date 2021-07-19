import React, { useEffect, useState } from 'react';
import { config } from '../util/constants';
import { SecureFetch } from '../util/secureFetch';
import Timeline from "./Timeline";
import Announcements from "./Announcements";

export default function Semester(props) {

    const [announcements, setAnnouncements] = useState([])

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_SEMESTER_ANNOUNCEMENTS}?semester=${props.projects[0]?.semester_id}`)
            .then(response => response.json())
            .then(announcements => {
                setAnnouncements(announcements);
            })
    }, [props.projects])

    return <>
        {announcements.length > 0 && <>
            <h2>Announcements</h2>
            <Announcements announcements={announcements} semesterName={props.semesterName} />
            <br />
        </>}
        {props.projects?.map((timelineElementData) => {
            return <Timeline key={timelineElementData.project_id} elementData={timelineElementData} />
        })}
    </>
}
