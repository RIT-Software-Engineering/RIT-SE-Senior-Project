import React, { useEffect, useState, useContext } from "react";
import ActionElements from "./ActionElements";
import UpcomingActions from "./UpcomingActions";
import { SecureFetch } from "../util/secureFetch";
import { config, USERTYPES } from "../util/constants";
import { UserContext } from "../util/UserContext";

export default function Timeline(props) {

    const [actions, setActions] = useState([]);
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
                <UpcomingActions projectId={props.elementData.project_id} actions={actions} />
            </>}
            <h3>Timeline</h3>
            <ActionElements projectId={props.elementData.project_id} actions={actions} />
        </div>
    );
}
