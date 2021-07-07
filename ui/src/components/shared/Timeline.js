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
                setActions(actions);
            })
            .catch(error => console.error(error))
    }, [props.elementData?.project_id])

    return (
        <div>
            <h2>{props.elementData?.display_name || props.elementData?.title}</h2>
            {userContext.user?.role !== USERTYPES.ADMIN && <>
                <h3>Relevant Actions</h3>
                <UpcomingActions actions={actions} />
            </>}
            <h3>Timeline</h3>
            <ActionElements actions={actions} />
        </div>
    );
}
