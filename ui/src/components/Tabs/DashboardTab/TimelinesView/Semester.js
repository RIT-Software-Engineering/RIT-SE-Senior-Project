import React, { useEffect, useState } from 'react';
import { config } from '../../../util/functions/constants';
import { SecureFetch } from '../../../util/functions/secureFetch';
import Timeline from "./Timeline/Timeline";
import Announcements from "./Announcements";
import { Divider } from "semantic-ui-react";

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
        {!props.noProjects && props.projects?.map((timelineElementData, idx) => {
            if (idx !== 0) {
                return <React.Fragment key={timelineElementData.project_id}>
                    <Divider />
                    <Timeline elementData={timelineElementData} />
                </React.Fragment>
            }
            return <Timeline key={timelineElementData.project_id} elementData={timelineElementData} />
        })}
    </>
}
