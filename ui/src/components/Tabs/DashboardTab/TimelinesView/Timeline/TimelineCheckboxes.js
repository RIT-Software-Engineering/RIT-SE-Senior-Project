import { Checkbox } from "semantic-ui-react";
import React, { useState, useEffect } from 'react';

export default function TimelineCheckboxes(props) {

    const milestonesCheckboxId = props.projectId + " Milestones Checkbox";
    const ganttCheckboxId = props.projectId + " Gantt Checkbox";

    const [isMilestonesChecked, setIsMilestonesChecked] = useState(props.viewPreference == 'milestone' || props.viewPreference == 'all');
    const [isGanttChecked, setIsGanttChecked] = useState(props.viewPreference == 'gantt' || props.viewPreference == 'all');

    const milestonesChange = (e, {isMilestonesChecked}) => {
        const milestonesCheckbox = document.getElementById(milestonesCheckboxId);
        const milestones = document.getElementById(props.milestonesId);

        setIsMilestonesChecked(milestonesCheckbox.checked);

        milestones.style.display = milestonesCheckbox.checked ? 'block' : 'none';
    }

    const ganttChange = (e, {isGanttChecked}) => {
        const ganttCheckbox = document.getElementById(ganttCheckboxId);
        const gantt = document.getElementById(props.ganttId);

        setIsGanttChecked(ganttCheckbox.checked);

        gantt.style.display = ganttCheckbox.checked ? 'block' : 'none';
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