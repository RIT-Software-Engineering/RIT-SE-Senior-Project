import { Checkbox } from "semantic-ui-react";

export default function TimelineCheckboxes(props) {

    const milestonesChange = (e, data) => {
        props.setMilestoneVisible(data.checked);
    }

    const ganttChange = (e, data) => {
        props.setGanttVisible(data.checked);
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