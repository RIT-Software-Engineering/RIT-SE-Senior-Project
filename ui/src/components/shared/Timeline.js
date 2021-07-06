import React, { useEffect, useState, useContext } from "react";
import ActionElements from "./ActionElements";
import Announcements from "./Announcements";
import UpcomingActions from "./UpcomingActions";
import { SecureFetch } from "../util/secureFetch";
import { ACTION_TARGETS, config, USERTYPES } from "../util/constants";
import { UserContext } from "../util/UserContext";
import _ from "lodash";


export default function Timeline(props) {

    const [actions, setActions] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const userContext = useContext(UserContext);

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_TIMELINE_ACTIONS}?project_id=${props.elementData?.project_id}`)
            .then(response => response.json())
            .then(actions => {
                const [announcements, filteredActions] = _.partition(actions, (action) => {
                    return [ACTION_TARGETS.student_announcement, ACTION_TARGETS.coach_announcement].includes(action.action_target);
                })
                setAnnouncements(announcements);
                setActions(filteredActions);
            })
            .catch(error => console.error(error))
    }, [props.elementData?.project_id])

    return (
        <div>
            <h2>{props.elementData?.display_name || props.elementData?.title}</h2>
            {announcements.length > 0 && <>
                <h3>Announcements</h3>
                <Announcements announcements={announcements} />
            </>}
            {userContext.user?.role !== USERTYPES.ADMIN && <>
                <h3>Relevant Actions</h3>
                <UpcomingActions actions={actions} />
            </>}
            <h3>Timeline</h3>
            <ActionElements actions={actions} />
        </div>
    );
}
