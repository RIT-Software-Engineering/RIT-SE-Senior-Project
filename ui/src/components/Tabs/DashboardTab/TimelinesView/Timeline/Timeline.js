import React, { useEffect, useState, useContext } from "react";
import ActionElements from "./ActionElements";
import UpcomingActions from "./UpcomingActions";
import GanttChart from "./GanttChart";
import { SecureFetch } from "../../../../util/functions/secureFetch";
import { config, USERTYPES } from "../../../../util/functions/constants";
import { UserContext } from "../../../../util/functions/UserContext";
import TimelineCheckboxes from "./TimelineCheckboxes";

export default function Timeline(props) {

    const [actionViewPreference, setActionViewPreference] = useState('');
    const [loading, setLoading] = useState(true);
    const [actions, setActions] = useState([]);
    const userContext = useContext(UserContext);

    const loadTimelineActions = (project_id) => {
        SecureFetch(`${config.url.API_GET_TIMELINE_ACTIONS}?project_id=${project_id}`)
            .then(response => response.json())
            .then(actions => {
                setActions(actions);
            })
            .catch(error => console.error(error));
    }

    const loadUserViewPreference = () => {
        SecureFetch(config.url.API_GET_MY_ACTION_VIEW_PREFERENCE)
        .then((response) => response.json())
        .then((userViewPref) => {
            setLoading(false);
            setActionViewPreference(userViewPref);
        })
        .catch(error => {
            setLoading(false);
            console.error(error)
        });
    }

    useEffect(() => {
        loadTimelineActions(props.elementData?.project_id);
        loadUserViewPreference();
    }, [props.elementData?.project_id])

    const milestonesId = props.elementData.project_id + " milestones";
    const ganttId = props.elementData.project_id + " gantt";

    if (loading) {
        return 'loading';
    }

    let viewPref = actionViewPreference[0]?.action_view;
    let viewGanttElement = !loading && (viewPref == 'gantt' || viewPref == 'all') ? 'block' : 'none';
    let viewMilestoneElement = !loading && (viewPref == 'milestone' || viewPref == 'all') ? 'block' : 'none';

    return (
        <div>
            {userContext.user?.role !== USERTYPES.ADMIN && <>
                <h3>Relevant Actions</h3>
                <UpcomingActions
                    projectName={props.elementData.display_name || props.elementData.title}
                    projectId={props.elementData.project_id}
                    semesterName={props.elementData.semester_name}
                    actions={actions}
                    reloadTimelineActions={() => { loadTimelineActions(props.elementData?.project_id) }}
                />
            </>}
            <div className="project-header">
                <h2>{props.elementData?.display_name || props.elementData?.title}</h2>
                <TimelineCheckboxes 
                    projectId={props.elementData.project_id}
                    viewPreference={actionViewPreference[0]?.action_view}
                    milestonesId={milestonesId} 
                    ganttId={ganttId}
                />
            </div>
            <div id={milestonesId} style={{display : viewMilestoneElement}}>
                <h3>Action Milestones</h3>
                <ActionElements
                    projectName={props.elementData.display_name || props.elementData.title}
                    projectId={props.elementData.project_id}
                    semesterName={props.elementData.semester_name}
                    actions={actions}
                    reloadTimelineActions={() => { loadTimelineActions(props.elementData?.project_id) }}
                />
            </div>
            <div id={ganttId} style={{display : viewGanttElement}}>
                <h3>Action Gantt</h3>
                <GanttChart
                    projectName={props.elementData.display_name || props.elementData.title}
                    projectId={props.elementData.project_id}
                    semesterName={props.elementData.semester_name}
                    semesterStart={props.elementData.start_date} 
                    semesterEnd={props.elementData.end_date} 
                    actions={actions}
                    reloadTimelineActions={() => { loadTimelineActions(props.elementData?.project_id) }}
                />
            </div>
        </div>
    );
}
