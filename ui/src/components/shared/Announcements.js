import React from 'react'
import { ACTION_TARGETS } from '../util/constants';

export default function Announcements(props) {

    return <div className="announcement-container">
        {props.announcements.map(announcement => {
            return <div className="announcement" key={announcement.action_id}>
                <h4>{announcement.action_target === ACTION_TARGETS.coach_announcement && "Coach:"} {announcement.action_title}</h4>
                <br />
                <div dangerouslySetInnerHTML={{ __html: announcement.page_html }} />
            </div>
        })}
    </div>
}
