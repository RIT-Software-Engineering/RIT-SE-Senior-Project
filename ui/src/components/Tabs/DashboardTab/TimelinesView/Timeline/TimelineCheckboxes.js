import { Checkbox, Divider } from "semantic-ui-react";
import "../../../../../css/components/tabs/timeline.css";

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
    <div className="timeline-box">
      <Checkbox
        toggle
        className="timeline-checkbox"
        label="Milestones"
        checked={props.milestoneVisible}
        onChange={milestonesChange}
      />
      <Divider orientation="vertical" />
      <Checkbox
        toggle
        className="timeline-checkbox"
        label="Gantt"
        checked={props.ganttVisible}
        onChange={ganttChange}
      />
      <Divider orientation="vertical" />
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
