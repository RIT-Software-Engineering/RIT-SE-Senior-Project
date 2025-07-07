import { Checkbox } from "semantic-ui-react";

export default function TimelineCheckboxes(props) {
  const milestonesChange = (e, data) => {
    props.setMilestoneVisible(data.checked);
    sessionStorage.setItem(props.projectId + " milestone", data.checked);
  };

  const ganttChange = (e, data) => {
    props.setGanttVisible(data.checked);
    sessionStorage.setItem(props.projectId + " gantt", data.checked);
  };

  const calendarChange = (e, data) => {
    props.setCalendarVisible(data.checked);
    sessionStorage.setItem(props.projectId + " calendar", data.checked);
  };

  return (
    <div>
      <Checkbox
        toggle
        className="timeline-checkbox"
        label="Milestones"
        checked={props.milestoneVisible}
        onChange={milestonesChange}
      />
      <Checkbox
        toggle
        className="timeline-checkbox"
        label="Gantt"
        checked={props.ganttVisible}
        onChange={ganttChange}
      />
      <Checkbox
        toggle
        className="timeline-checkbox"
        label="Calendar"
        checked={props.calendarVisible}
        onChange={calendarChange}
      />
    </div>
  );
}
