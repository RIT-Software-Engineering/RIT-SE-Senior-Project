import React, { useState } from "react";
import { Popup, Button, Modal } from "semantic-ui-react";
import { ACTION_TARGETS } from "../../../util/functions/constants";
import {
  formatDateNoOffset,
} from "../../../util/functions/utils" ;
import ActionPanel from "./ActionPanel";
import PreviewHtml from "../../../util/components/PreviewHtml";

const submissionTypeMap = {
  [ACTION_TARGETS.individual]: "Individual",
  [ACTION_TARGETS.team]: "Team",
  [ACTION_TARGETS.coach]: "Coach",
  [ACTION_TARGETS.admin]: "Admin",
};

function ActionToolTip(props) {
  const [closeOnDocClick, setCloseOnDocClick] = useState(true);
  const [offsetX, setOffsetX] = useState(0);
  //const [open, setOpen] = React.useState(false);

  // solely exists as a weird workaround so that when a modal is open the tooltip popup doesn't close when
  // clicking elements on the modal
  function isOpenCallback(isOpen) {
    setCloseOnDocClick(!isOpen);
  };

  const metadata = () => {
    return (
      <>
        <p>{props.action?.short_desc}</p>
        <p>Starts:{formatDateNoOffset(props.action?.start_date)}</p>
        <p>Due: {formatDateNoOffset(props.action?.due_date)}</p>
        <p>Submission Type: {submissionTypeMap[props.action?.action_target]}</p>
      </>
    );
  };

  const content = () => {
    return (
      <div className="content">
        {metadata()}
        <span className="spacer" />
        {/*
         * Not sure if it makes more sense to check action.state or action.start_date.
         * However, action.state is based off of server time whereas if we parse action.start_date,
         * we need to deal with parsing with time zones and all of that.
         */}
        <div className="accordion-buttons-container" style={{ position: 'initial' }}>
          <ActionPanel
            trigger={<Button fluid className="view-action-button">Edit Action</Button>}
            isOpenCallback={isOpenCallback}
            actionData={props.action}
            semesterData={props.semesterData}
            header={`Currently Editing "${props.action.action_title}"`}
            key={"editAction-" + props.index}
          />
          <PreviewHtml
            trigger={<Button fluid className="view-action-button">View Action</Button>}
            isOpenCallback={isOpenCallback}
            action={props.action}
            semesterName={props.semesterName}
            header={`Currently Viewing "${props.action.action_title}"`}
            key={"viewHtml-" + props.index}
          />
        </div>
      </div>
    );
  };

  if (props.noPopup) {
    return (
      <div className={`no-popup-tooltip ${props.color}`}>
        <h4>{props.action?.action_title}</h4>
        {content()}
      </div>
    );
  }

  return (
    <Popup
      header={props.action?.action_title}
      content={content()}
      closeOnDocumentClick={closeOnDocClick}
      style={{ zIndex: 100 }}
      trigger={props.trigger}
      on="click"
      offset={[offsetX, 0]}
      onOpen={(event, data) => {
        if (props.containerRef) {
          try {
            // purpose is to get the mouse's position relative to the start of the bar
            let barOffset = data.trigger.ref.current.offsetLeft; // dist from bar start to gantt start
            let containerScroll = props.containerRef?.current.scrollLeft; // dist from gantt start to left edge of visible container (scroll)
            let mouseXWithinContainer = event.clientX - props.containerRef?.current.getBoundingClientRect().left; // mouse dist from left (within container)
            setOffsetX(containerScroll - barOffset + mouseXWithinContainer);
          } catch (e) {
            console.log('tooltip positioning', e);
          }
        }
      }}
    />
  );
}

export default ActionToolTip;
