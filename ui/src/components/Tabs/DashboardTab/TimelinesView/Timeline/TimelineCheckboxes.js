import { Checkbox } from "semantic-ui-react";
import React, { useState } from 'react';

export default function TimelineCheckboxes(props) {

    const milestonesCheckboxId = props.projectId + " Milestones Checkbox";
    const ganttCheckboxId = props.projectId + " Gantt Checkbox";

    const [isMilestonesChecked, setIsMilestonesChecked] = useState(true);
    const [isGanttChecked, setIsGanttChecked] = useState(true);

    const milestonesChange = (e, {isMilestonesChecked}) => {
        const milestonesCheckbox = document.getElementById(milestonesCheckboxId);
        const milestones = document.getElementById(props.milestonesId);

        setIsMilestonesChecked(isMilestonesChecked);

        if(milestonesCheckbox.checked) {
            milestones.style.display = 'block';
        }
        else {
            milestones.style.display = 'none';
        }
    }

    const ganttChange = (e, {isGanttChecked}) => {
        const ganttCheckbox = document.getElementById(ganttCheckboxId);
        const gantt = document.getElementById(props.ganttId);

        setIsGanttChecked(isGanttChecked);

        if(ganttCheckbox.checked) {
            gantt.style.display = 'block';
        }
        else {
            gantt.style.display = 'none';
        }
    }

    return (
        <div>
            <Checkbox
                toggle
                className="timeline-checkbox"
                label="Milestones"
                id={milestonesCheckboxId}
                checked={isMilestonesChecked}
                onChange={milestonesChange}
            />
            <Checkbox
                toggle
                className="timeline-checkbox"
                label="Gantt"
                id={ganttCheckboxId}
                checked={isGanttChecked}
                onChange={ganttChange}
            />
        </div>
    )
}