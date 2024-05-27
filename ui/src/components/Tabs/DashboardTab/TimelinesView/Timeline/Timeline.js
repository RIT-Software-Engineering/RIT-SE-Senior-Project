import React, { useEffect, useState, useContext } from "react";
import ActionElements from "./ActionElements";
import UpcomingActions from "./UpcomingActions";
import GanttChart from "./GanttChart";
import { SecureFetch } from "../../../../util/functions/secureFetch";
import { config, USERTYPES } from "../../../../util/functions/constants";
import { UserContext } from "../../../../util/functions/UserContext";
import TimelineCheckboxes from "./TimelineCheckboxes";

export default function Timeline(props) {

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

    useEffect(() => {
        loadTimelineActions(props.elementData?.project_id);
    }, [props.elementData?.project_id])

    const milestonesId = props.elementData.project_id + " milestones";
    const ganttId = props.elementData.project_id + " gantt";

    let viewPref = 'gantt';
    let viewGanttElement = viewPref == 'gantt' || viewPref == 'all' ? 'block' : 'none';
    let viewMilestoneElement = viewPref == 'milestone' || viewPref == 'all' ? 'block' : 'none';

    return (
        <div>
            <div className="project-header">
                <h2>{props.elementData?.display_name || props.elementData?.title}</h2>
            </div>

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
            <div className="checkbox-container">
                <h3>All Actions</h3>
                <TimelineCheckboxes 
                        projectId={props.elementData.project_id}
                        milestonesId={milestonesId} 
                        ganttId={ganttId}
                    />
            </div>
            <div class='timeline-action-block' id={milestonesId} style={{display : viewMilestoneElement}}>
                <h3>Milestones</h3>
                <ActionElements
                    projectName={props.elementData.display_name || props.elementData.title}
                    projectId={props.elementData.project_id}
                    semesterName={props.elementData.semester_name}
                    actions={actions}
                    reloadTimelineActions={() => { loadTimelineActions(props.elementData?.project_id) }}
                />
            </div>
            <div class='timeline-action-block' id={ganttId} style={{display : viewGanttElement}}>
                <h3>Gantt</h3>
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
