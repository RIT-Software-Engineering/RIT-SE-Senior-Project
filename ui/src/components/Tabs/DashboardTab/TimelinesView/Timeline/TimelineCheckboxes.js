import { Checkbox } from "semantic-ui-react";

export default function TimelineCheckboxes(props) {

    const milestonesChange = (e, data) => {
        props.setMilestoneVisible(data.checked);

        // will only set storage if deviates from the default - wanted to do this to reduce
        // session storage used, especially for admin. will this make much of a difference?
        // to remove change but keep functionality, take away conditionals but keep setitem();
        if (data.checked != true) {
            sessionStorage.setItem(props.projectId + ' milestone', data.checked);
        }
    }

    const ganttChange = (e, data) => {
        props.setGanttVisible(data.checked);

        if (data.checked != (props.role == 'admin' ? false : true)) {
            sessionStorage.setItem(props.projectId + ' gantt', data.checked);
        }
    }
    
    return (
        <div>
            <Checkbox
                toggle
                className="timeline-checkbox"
                label="Milestones"
                defaultChecked={props.milestoneVisible}
                onChange={milestonesChange}
            />
            <Checkbox
                toggle
                className="timeline-checkbox"
                label="Gantt"
                defaultChecked={props.ganttVisible}
                onChange={ganttChange}
            />
        </div>
    )
}