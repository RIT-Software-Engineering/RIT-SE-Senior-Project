import React from 'react'
import { ACTION_TARGETS } from '../../../util/functions/constants';
import {formatDateNoOffset} from '../../../util/functions/utils';

export default function Announcements(props) {

    return <div className="announcement-container">
        {props.announcements.map(announcement => {
            return <div className="announcement" key={announcement.action_id}>
                <div className="announcement-header">
                    <h4>{announcement.action_target === ACTION_TARGETS.coach_announcement && `Coach (${props.semesterName}):`} {announcement.action_title}</h4>
                    <h4 className="secondary" >Ends {formatDateNoOffset(announcement.due_date)}</h4>
                </div>
                <div className={"announcement-container-wrapper"}>
                    <div dangerouslySetInnerHTML={{ __html: announcement.page_html }} />
                </div>
            </div>
        })}
    </div>
}
