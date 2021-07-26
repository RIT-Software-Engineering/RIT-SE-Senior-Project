import React from 'react'
import { ACTION_TARGETS } from '../util/constants';
import { formatDate } from '../util/utils';

export default function Announcements(props) {

    return <div className="announcement-container">
        {props.announcements.map(announcement => {
            return <div className="announcement" key={announcement.action_id}>
                <div className="announcement-header">
                    <h4>{announcement.action_target === ACTION_TARGETS.coach_announcement && `Coach (${props.semesterName}):`} {announcement.action_title}</h4>
                    <h4 className="secondary" >Ends {formatDate(announcement.due_date)}</h4>
                </div>
                <div dangerouslySetInnerHTML={{ __html: announcement.page_html }} />
            </div>
        })}
    </div>
}
