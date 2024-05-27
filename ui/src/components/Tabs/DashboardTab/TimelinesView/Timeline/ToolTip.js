import React, { useState, useEffect } from "react";
import { Icon, Popup } from "semantic-ui-react";
import { ACTION_TARGETS, config } from "../../../../util/functions/constants";
import { SecureFetch } from "../../../../util/functions/secureFetch";
import {
  formatDateNoOffset,
  formatDateTime,
} from "../../../../util/functions/utils";
import ActionModal from "./ActionModal";
import SubmissionViewerModal from "./SubmissionViewerModal";

const submissionTypeMap = {
  [ACTION_TARGETS.individual]: "Individual",
  [ACTION_TARGETS.team]: "Team",
  [ACTION_TARGETS.coach]: "Coach",
  [ACTION_TARGETS.admin]: "Admin",
};

export default function ToolTip(props) {
  const [closeOnDocClick, setCloseOnDocClick] = useState(true);
  const [offsetX, setOffsetX] = useState(0);

  const [submissions, setSubmissions] = useState(null);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // solely exists as a weird workaround so that when a modal is open the tooltip popup doesn't close when
  // clicking elements on the modal
  let isOpenCallback = function (isOpen) {
    setCloseOnDocClick(!isOpen);
  };

  const loadSubmission = (projectId, actionId) => {
    setLoadingSubmissions(true);
    SecureFetch(
      `${config.url.API_GET_ACTION_LOGS}?project_id=${projectId}&action_id=${actionId}`
    )
      .then((response) => response.json())
      .then((actionLogs) => {
        setSubmissions(actionLogs);
        setLoadingSubmissions(false);
      })
      .catch((err) => {
        console.error("FAILED TO GET SUBMISSIONS: ", err);
      });
  };

  useEffect(() => {
    if (props.autoLoadSubmissions) {
      loadSubmission(props.projectId, props.action?.action_id);
    }
  }, [props.autoLoadSubmissions, props.projectId, props.action?.action_id]);

  const metadata = (longSubmissionTitle) => {
    return (
      <>
        <p>{props.action?.short_desc}</p>
        <p>Starts: {formatDateNoOffset(props.action?.start_date)}</p>
        <p>Due: {formatDateNoOffset(props.action?.due_date)}</p>
        <p>Project: {props.projectName}</p>
        <p>Submission Type: {submissionTypeMap[props.action?.action_target]}</p>
        {submissions === null && !loadingSubmissions && (
          <p
            className="fake-a"
            onClick={() =>
              loadSubmission(props.projectId, props.action?.action_id)
            }
          >
            Load submissions
          </p>
        )}
        {loadingSubmissions && <Icon name="spinner" size="large" />}
        {submissions?.length === 0 && (
          <p>
            <b>No submissions</b>
          </p>
        )}
        {submissions?.map((submission) => {
          return (
            <SubmissionViewerModal
              key={submission.action_log_id}
              action={submission}
              title={props.action?.action_title}
              target={props.action?.action_target}
              semesterName={props.semesterName}
              projectName={props.projectName}
              isOpenCallback={isOpenCallback}
              trigger={
                <div className="fake-a">
                  {longSubmissionTitle ? (
                    <>
                      {submission.mock_id &&
                        `${submission.mock_name} (${submission.mock_id}) as `}
                      {`${submission.name} (${submission.system_id})`}{" "}
                      {formatDateTime(submission.submission_datetime)}{" "}
                    </>
                  ) : (
                    <>
                      <i>{formatDateTime(submission.submission_datetime)}</i>{" "}
                      Submission
                    </>
                  )}
                </div>
              }
            />
          );
        })}
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

        <ActionModal
          key={props.action?.action_id}
          {...props.action}
          isOpenCallback={isOpenCallback}
          projectId={props.projectId}
          preActionContent={metadata(true)}
          reloadTimelineActions={props.reloadTimelineActions}
        />
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
      offset={[offsetX, 0]}
      trigger={props.trigger}
      on="click"
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
        loadSubmission(props.projectId, props.action?.action_id);
      }}
    />
  );
}