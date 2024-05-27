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

    const storedMilestoneView = sessionStorage.getItem(props.elementData?.project_id + ' milestone');
    const storedGanttView = sessionStorage.getItem(props.elementData?.project_id + ' gantt');
    const [milestoneVisible, setMilestoneVisible] = useState(storedMilestoneView ? storedMilestoneView === 'true' : true);
    const [ganttVisible, setGanttVisible] = useState(storedGanttView ? storedGanttView === 'true' : (userContext.user?.role == USERTYPES.ADMIN ? false : true));

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
                        role={userContext.user?.role}
                        setMilestoneVisible={setMilestoneVisible}
                        setGanttVisible={setGanttVisible}
                        milestoneVisible={milestoneVisible}
                        ganttVisible={ganttVisible}
                    />
            </div>
            <div className='timeline-action-block' style={{display : milestoneVisible ? 'block' : 'none'}}>
                <h3>Milestones</h3>
                <ActionElements
                    projectName={props.elementData.display_name || props.elementData.title}
                    projectId={props.elementData.project_id}
                    semesterName={props.elementData.semester_name}
                    actions={actions}
                    reloadTimelineActions={() => { loadTimelineActions(props.elementData?.project_id) }}
                />
            </div>
            <div className='timeline-action-block' style={{display : ganttVisible ? 'block' : 'none'}}>
                <h3>Gantt</h3>
                <GanttChart
                    projectName={props.elementData.display_name || props.elementData.title}
                    projectId={props.elementData.project_id}
                    semesterName={props.elementData.semester_name}
                    projectStart={props.elementData.start_date} 
                    projectEnd={props.elementData.end_date} 
                    actions={actions}
                    reloadTimelineActions={() => { loadTimelineActions(props.elementData?.project_id) }}
                />
            </div>
        </div>
    );
}
