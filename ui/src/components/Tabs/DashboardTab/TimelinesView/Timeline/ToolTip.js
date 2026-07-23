import React, { useState, useEffect } from "react";
import { Icon, Popup, Button } from "semantic-ui-react";
import { ACTION_TARGETS, config } from "../../../../util/functions/constants";
import { SecureFetch } from "../../../../util/functions/secureFetch";
import {
  formatDateNoOffset,
  formatDateTime,
} from "../../../../util/functions/utils";
import ActionModal from "./ActionModal";
import SubmissionViewerModal from "./SubmissionViewerModal";
import DOMpurify from "dompurify";
import ProfileCircle from "../../../../util/components/ProfileCircle";
import { formatDate } from "../../../../util/functions/utils";
import "../../../../../css/components/tabs/tool.css";

const submissionTypeMap = {
  [ACTION_TARGETS.individual]: "Individual",
  [ACTION_TARGETS.team]: "Team",
  [ACTION_TARGETS.coach]: "Coach",
  [ACTION_TARGETS.admin]: "Admin",
  [ACTION_TARGETS.student_announcement]: "Student Announcement",
  [ACTION_TARGETS.coach_announcement]: "Coach Announcement",
  [ACTION_TARGETS.peer_evaluation]: "Peer Evaluation",
};

export default function ToolTip(props) {
  const [closeOnDocClick, setCloseOnDocClick] = useState(true);
  const [offsetX, setOffsetX] = useState(0);

  const [submissions, setSubmissions] = useState(null);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  var [hasMockedSubmission, setHasMockedSubmission] = useState(false);

  let isLate = (due, submitted) => {
    if (!due || !submitted) return false;
    const dueDate = formatDate(due);
    const submitDate = formatDate(submitted);
    return new Date(submitDate) > new Date(dueDate);
  };

  let daysLate = (due, submitted) => {
    const dueDate = formatDate(due);
    const submitDate = formatDate(submitted);
    const diffInMs = new Date(submitDate) - new Date(dueDate);
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  };

  let renderIsLate = (submission) => {
    return (
      <>
        {isLate(submission.due_date, submission.submission_datetime) && (
          <span className="tool-late-submit">
            {` ${daysLate(submission.due_date, submission.submission_datetime)} days late`}
          </span>
        )}
      </>
    );
  };

  // solely exists as a weird workaround so that when a modal is open the tooltip popup doesn't close when
  // clicking elements on the modal
  let isOpenCallback = function (isOpen) {
    setCloseOnDocClick(!isOpen);
    if (isOpen) {
      setPopupOpen(false);
    }
  };

  const loadSubmission = (projectId, actionId) => {
    setLoadingSubmissions(true);
    SecureFetch(
      `${config.url.API_GET_ACTION_LOGS}?project_id=${projectId}&action_id=${actionId}`,
    )
      .then((response) => response.json())
      .then((actionLogs) => {
        setSubmissions(actionLogs);
        setLoadingSubmissions(false);
        if (actionLogs.length > 0) {
          setHasMockedSubmission(
            actionLogs.some((submission) => submission.mock_id),
          );
        }
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
        <p
          dangerouslySetInnerHTML={{
            __html: DOMpurify.sanitize(props.action?.short_desc, {
              ALLOWED_TAGS: ["b", "i", "strong", "em"],
            }),
          }}
        ></p>
        <p>Starts: {formatDateNoOffset(props.action?.start_date)}</p>
        <p>
          {props.action?.action_target === "break_period" ? "Ends:" : "Due:"}{" "}
          {formatDateNoOffset(props.action?.due_date)}
        </p>
        {props.action?.action_target === "break_period" ? (
          <></> // break_period doesn't have a project, omit the fields
        ) : (
          <div>
            <p>Project: {props.projectName}</p>
            <p>
              Submission Type: {submissionTypeMap[props.action?.action_target]}
            </p>
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
                <span className="tool-submission">
                  <SubmissionViewerModal
                    key={submission.action_log_id}
                    action={submission}
                    title={props.action?.action_title}
                    target={props.action?.action_target}
                    semesterName={props.semesterName}
                    projectName={props.projectName}
                    isOpenCallback={isOpenCallback}
                    trigger={
                      <div className="fake-a tool-trigger">
                        {longSubmissionTitle ? (
                          <>
                            {submission.mock_id && (
                              <span className="tool-submission">
                                <ProfileCircle
                                  name={submission.mock_name}
                                  isStudent={false}
                                  size="tiny"
                                />
                                <span className="tool-profile">
                                  {submission.mock_name} ({submission.mock_id})
                                  as
                                </span>
                              </span>
                            )}
                            <span className="tool-submission">
                              <ProfileCircle
                                name={submission.name}
                                size="tiny"
                                isStudent={submission.user_type === "student"}
                              />
                              <span className="tool-whitespace">
                                {submission.name} ({submission.system_id}) on{" "}
                                {formatDateTime(submission.submission_datetime)}
                                {renderIsLate(submission)}
                              </span>
                            </span>
                          </>
                        ) : (
                          <>
                            <i
                              className={`tool-summary-line${
                                submission.mock_id
                                  ? " tool-summary-line-indent"
                                  : ""
                              }`}
                            >
                              {submission.mock_id && (
                                <div className="tool-submit">
                                  <ProfileCircle
                                    name={submission.mock_name}
                                    showFullName
                                    isStudent={false}
                                    size="tiny"
                                    className="tool-as"
                                  />
                                  as
                                </div>
                              )}
                              <div className="tool-submit">
                                <ProfileCircle
                                  name={submission.name}
                                  showFullName
                                  size="tiny"
                                  isStudent={submission.user_type === "student"}
                                />
                                on
                              </div>
                              <div
                                className={`tool-date${
                                  submission.mock_id ? " tool-date-indent" : ""
                                }`}
                              >
                                {formatDateTime(submission.submission_datetime)}
                                {renderIsLate(submission)}
                              </div>
                            </i>
                          </>
                        )}
                      </div>
                    }
                  />
                </span>
              );
            })}
          </div>
        )}
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
        {props.action?.action_target !== "break_period" && (
          <Button
            fluid
            className="view-action-button"
            onClick={(e) => {
              console.log("VIEW ACTION CLICKED");
              e.stopPropagation();
              setPopupOpen(false);
              setActionModalOpen(true);
            }}
          >
            View Action
          </Button>
        )}
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
    <>
      <Popup
        onClose={() => console.log("POPUP CLOSE")}
        open={popupOpen}
        header={props.action?.action_title}
        content={content()}
        closeOnDocumentClick={closeOnDocClick}
        closeOnEscape={true}
        wide={hasMockedSubmission}
        inverted={document.body.classList.contains("dark-mode")}
        className="tool-pop"
        offset={[offsetX, 0]}
        trigger={props.trigger}
        on="click"
        onOpen={(event, data) => {
          console.log("POPUP OPEN");
          setPopupOpen(true);
          if (props.containerRef) {
            try {
              // purpose is to get the mouse's position relative to the start of the bar
              let barOffset = data.trigger.ref.current.offsetLeft; // dist from bar start to gantt start
              let containerScroll = props.containerRef?.current.scrollLeft; // dist from gantt start to left edge of visible container (scroll)
              let mouseXWithinContainer =
                event.clientX -
                props.containerRef?.current.getBoundingClientRect().left; // mouse dist from left (within container)
              setOffsetX(containerScroll - barOffset + mouseXWithinContainer);
            } catch (e) {
              console.log("tooltip positioning", e);
            }
          }
          loadSubmission(props.projectId, props.action?.action_id);
        }}
        onClose={(event, data) => {
          console.log("POPUP CLOSE", event, data);
          setPopupOpen(false);
        }}
      />
      {props.action?.action_target !== "break_period" && (
        <ActionModal
          open={actionModalOpen}
          key={props.action?.action_id}
          {...props.action}
          projectId={props.projectId}
          preActionContent={metadata(true)}
          reloadTimelineActions={props.reloadTimelineActions}
          isOpenCallback={(isOpen) => {
            setCloseOnDocClick(!isOpen);
            if (isOpen) {
              setActionModalOpen(false);
            }
            setActionModalOpen(isOpen);
          }}
        />
      )}
    </>
  );
}
