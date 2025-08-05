import React, { useEffect, useState, useContext, useRef } from "react";
import ActionElements from "./ActionElements";
import UpcomingActions from "./UpcomingActions";
import GanttChart from "./GanttChart";
import { SecureFetch } from "../../../../util/functions/secureFetch";
import { config, USERTYPES } from "../../../../util/functions/constants";
import { UserContext } from "../../../../util/functions/UserContext";
import TimelineCheckboxes from "./TimelineCheckboxes";
import { Dropdown } from "semantic-ui-react";
import { Calendar } from "../../../../util/components/Calendar";
import { element } from "prop-types";

export default function Timeline(props) {
  const [actions, setActions] = useState([]);
  const userContext = useContext(UserContext);
  const storedMilestoneView = sessionStorage.getItem(
    props.elementData?.project_id + " milestone",
  );
  const storedGanttView = sessionStorage.getItem(
    props.elementData?.project_id + " gantt",
  );
  const storedCalendarView = sessionStorage.getItem(
    props.elementData?.project_id + " calendar",
  );

  // Get default preferences from profile settings
  const defaultMilestoneView = sessionStorage.getItem("defaultMilestoneView");
  const defaultGanttView = sessionStorage.getItem("defaultGanttView");
  const defaultCalendarView = sessionStorage.getItem("defaultCalendarView");

  // Initialize with project-specific preferences if available, otherwise use default fallbacks temporarily
  const [milestoneVisible, setMilestoneVisible] = useState(
    storedMilestoneView
      ? storedMilestoneView === "true"
      : defaultMilestoneView !== null
        ? defaultMilestoneView === "true"
        : true, // temporary fallback until user prefs load
  );
  const [ganttVisible, setGanttVisible] = useState(
    storedGanttView
      ? storedGanttView === "true"
      : defaultGanttView !== null
        ? defaultGanttView === "true"
        : userContext.user?.role === USERTYPES.ADMIN
          ? false
          : true, // temporary fallback until user prefs load
  );
  const [calendarVisible, setCalendarVisible] = useState(
    storedCalendarView
      ? storedCalendarView === "true"
      : defaultCalendarView !== null
        ? defaultCalendarView === "true"
        : false, // temporary fallback until user prefs load
  );
  // Load user-specific preferences when user changes
  useEffect(() => {
    if (userContext.user?.user) {
      // Clear any existing project-specific preferences when user changes
      if (props.elementData?.project_id) {
        sessionStorage.removeItem(props.elementData.project_id + " milestone");
        sessionStorage.removeItem(props.elementData.project_id + " gantt");
        sessionStorage.removeItem(props.elementData.project_id + " calendar");
      }

      // Load user preferences from backend and update defaults in sessionStorage
      SecureFetch(
        config.url.API_GET_GANTT_VIEW + `?system_id=${userContext.user.user}`,
      )
        .then((res) => res.json())
        .then((data) => {
          const ganttPref = data.gantt_view === true;
          sessionStorage.setItem("defaultGanttView", ganttPref.toString());

          // Always apply user's default preference when switching users
          setGanttVisible(ganttPref);
        })
        .catch((err) => console.error("Failed to fetch gantt view:", err));

      SecureFetch(
        config.url.API_GET_CALENDAR_VIEW +
          `?system_id=${userContext.user.user}`,
      )
        .then((res) => res.json())
        .then((data) => {
          const calendarPref = data.calendar_view === true;
          sessionStorage.setItem(
            "defaultCalendarView",
            calendarPref.toString(),
          );

          // Always apply user's default preference when switching users
          setCalendarVisible(calendarPref);
        })
        .catch((err) => console.error("Failed to fetch calendar view:", err));

      SecureFetch(
        config.url.API_GET_MILESTONE_VIEW +
          `?system_id=${userContext.user.user}`,
      )
        .then((res) => res.json())
        .then((data) => {
          const milestonePref = data.milestone_view === true;
          sessionStorage.setItem(
            "defaultMilestoneView",
            milestonePref.toString(),
          );

          // Always apply user's default preference when switching users
          setMilestoneVisible(milestonePref);
        })
        .catch((err) => console.error("Failed to fetch milestone view:", err));
    }
  }, [userContext.user?.user, props.elementData?.project_id]);

  const loadTimelineActions = (project_id) => {
    SecureFetch(
      `${config.url.API_GET_TIMELINE_ACTIONS}?project_id=${project_id}`,
    )
      .then((response) => response.json())
      .then((actions) => {
        setActions(actions);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    loadTimelineActions(props.elementData?.project_id);
  }, [props.elementData?.project_id]);

  return (
    <div>
      <div className="project-header">
        <h2>{props.elementData?.display_name || props.elementData?.title}</h2>
      </div>
      {userContext.user?.role !== USERTYPES.ADMIN && (
        <>
          <h3>Relevant Actions</h3>
          <UpcomingActions
            projectName={
              props.elementData.display_name || props.elementData.title
            }
            projectId={props.elementData.project_id}
            semesterName={props.elementData.semester_name}
            actions={actions.filter(
              (action) => action.action_target !== "break_period",
            )}
            reloadTimelineActions={() => {
              loadTimelineActions(props.elementData?.project_id);
            }}
          />
        </>
      )}
      <div className="checkbox-container">
        <h3>All Actions</h3>{" "}
        <TimelineCheckboxes
          projectId={props.elementData.project_id}
          role={userContext.user?.role}
          setMilestoneVisible={setMilestoneVisible}
          setGanttVisible={setGanttVisible}
          setCalendarVisible={setCalendarVisible}
          milestoneVisible={milestoneVisible}
          ganttVisible={ganttVisible}
          calendarVisible={calendarVisible}
        />
      </div>
      <div
        className="timeline-action-block"
        style={{ display: milestoneVisible ? "block" : "none" }}
      >
        <h3>Milestones</h3>
        <ActionElements
          projectName={
            props.elementData.display_name || props.elementData.title
          }
          projectId={props.elementData.project_id}
          semesterName={props.elementData.semester_name}
          actions={actions.filter(
            (action) => action.action_target !== "break_period",
          )}
          reloadTimelineActions={() => {
            loadTimelineActions(props.elementData?.project_id);
          }}
        />
      </div>{" "}
      <div
        className="timeline-action-block"
        style={{ display: ganttVisible ? "block" : "none" }}
      >
        <div className="timeline-action-block">
          <GanttChart
            projectName={
              props.elementData.display_name || props.elementData.title
            }
            projectId={props.elementData.project_id}
            semesterName={props.elementData.semester_name}
            projectStart={props.elementData.start_date}
            projectEnd={props.elementData.end_date}
            actions={actions.map((action) => {
              if (action.action_target === "break_period") {
                return { ...action, state: "purple" };
              }
              return action;
            })}
            isOpen={ganttVisible}
            reloadTimelineActions={() => {
              loadTimelineActions(props.elementData?.project_id);
            }}
          />
        </div>
      </div>
      <div
        className="timeline-action-block"
        style={{ display: calendarVisible ? "block" : "none" }}
      >
        <h3>Calendar</h3>
        <div className="timeline-action-block">
          <Calendar
            projectName={
              props.elementData.display_name || props.elementData.title
            }
            projectId={props.elementData.project_id}
            semesterName={props.elementData.semester_name}
            reloadTimelineActions={() => {
              loadTimelineActions(props.elementData?.project_id);
            }}
            actions={actions.map((action) => {
              if (action.action_target === "break_period") {
                return { ...action, state: "purple" };
              }
              return action;
            })}
            initialDate={new Date()}
          />
        </div>
      </div>
    </div>
  );
}
