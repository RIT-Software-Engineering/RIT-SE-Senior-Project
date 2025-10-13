import React, { useState, useEffect, useRef } from "react";
import {
  Divider,
  Header,
  Message,
  MessageHeader,
  Rating,
  Segment,
} from "semantic-ui-react";
import { ACTION_TARGETS, config } from "../../../../util/functions/constants";
import { SecureFetch } from "../../../../util/functions/secureFetch";
import { formatDate } from "../../../../util/functions/utils";
import EvalReview from "../../../../util/components/EvalReview";
import ProfileCircle from "../../../../util/components/ProfileCircle";

export default function SubmissionViewerModalContent({
  action,
  target,
  semesterName,
  projectName,
  noSubmission,
}) {
  const [submission, setSubmission] = useState({});
  const [files, setFiles] = useState([]);
  const [noSub, setNoSub] = useState(true);
  const [due, setDue] = useState(null);
  const [late, setLate] = useState(false);
  const [day, setDay] = useState(0);
  const contentRef = useRef(null);

  // Always scroll to top every time the modal opens
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [action]);

  // Load submission and due info
  useEffect(() => {
    if (!action?.action_log_id) return;

    // Fetch submission data
    SecureFetch(
      `${config.url.API_GET_SUBMISSION}?log_id=${action.action_log_id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.length > 0) {
          const formData = JSON.parse(data[0].form_data.toString());
          const fileData = data[0].files ? data[0].files.split(",") : [];
          setSubmission(formData);
          setFiles(fileData);
          setNoSub(
            Object.keys(formData || {}).length === 0 &&
              (!fileData || fileData.length === 0),
          );
        } else {
          setNoSub(true);
        }
      })
      .catch((err) => console.error("Failed to get submission:", err));

    // Fetch due date
    SecureFetch(
      `${config.url.API_GET_LATE_SUBMISSION}?log_id=${action.action_log_id}`,
    )
      .then((res) => res.json())
      .then((dueData) => {
        if (!dueData?.length) return;
        const dueDateTime = new Date(dueData[0].due_date);
        setDue(dueDateTime);

        const submitDate = new Date(action.submission_datetime?.split(" ")[0]);
        const isLate = submitDate > dueDateTime;
        setLate(isLate);

        if (isLate) {
          const diff = Math.floor(
            (submitDate - dueDateTime) / (1000 * 60 * 60 * 24),
          );
          setDay(diff);
        }
      })
      .catch((err) => console.error("Failed to get due date:", err));
  }, [action]);

  const noSubmissionText = (target) => {
    switch (target) {
      case ACTION_TARGETS.individual:
        return "Individual submissions are not viewable by team members.";
      case ACTION_TARGETS.peer_evaluation:
        return "Peer evaluation submissions are not viewable by team members.";
      case ACTION_TARGETS.coach:
        return "Coach submissions are not viewable by team members.";
      case ACTION_TARGETS.admin:
        return "Admin submissions are not viewable by team members.";
      default:
        return "You cannot view this submission.";
    }
  };

  const IS_PEER_EVAL = target === ACTION_TARGETS.peer_evaluation;

  return (
    <div>
      {/* Action Card Header Info*/}
      <div style={{ marginBottom: "1.5em" }}>
        <p>
          <b>Starts:</b> {formatDate(action.start_date)}
        </p>
        <p>
          <b>Due:</b> {formatDate(action.due_date)}
        </p>
        <p>
          <b>Project:</b> {projectName}
        </p>
        <p>
          <b>Submission Type:</b> {target}
        </p>
      </div>

      {/* Submission list */}
      {action.submissions && action.submissions.length > 0 && (
        <div style={{ marginBottom: "1.5em" }}>
          {action.submissions.map((sub, idx) => (
            <p
              key={idx}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <ProfileCircle name={sub.name} size="tiny" />
              <span style={{ color: sub.late ? "red" : "inherit" }}>
                {sub.name} ({sub.id}) on {formatDate(sub.datetime)} {sub.late}
              </span>
            </p>
          ))}
        </div>
      )}

      <Divider />
      <p>
        <b>Semester/Project:</b> {semesterName} – {projectName}
      </p>

      {/* Who submitted */}
      <p style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <b>Submitted:</b>
        {action.mock_id && (
          <span
            style={{ display: "flex", alignItems: "center", marginLeft: 5 }}
          >
            <ProfileCircle
              name={action.mock_name}
              isStudent={false}
              size="tiny"
            />
            <span style={{ marginLeft: 5 }}>
              {action.mock_name} ({action.mock_id}) as
            </span>
          </span>
        )}

        <ProfileCircle
          name={action.name}
          isStudent={
            action.action_target !== ACTION_TARGETS.admin &&
            action.action_target !== ACTION_TARGETS.coach
          }
          size="tiny"
          style={{ marginLeft: 5 }}
        />

        <span style={{ marginLeft: 5 }}>
          {action.name} ({action.system_id})
        </span>

        <span style={{ marginLeft: 5 }}>
          on {formatDate(action.submission_datetime)}
        </span>

        {due && <span style={{ marginLeft: 5 }}>(Due {formatDate(due)})</span>}

        {late && (
          <span style={{ color: "red", marginLeft: 5, fontWeight: "bold" }}>
            {day} day{day !== 1 && "s"} late
          </span>
        )}
      </p>

      <Divider />
      <h3>Submission</h3>

      {(noSubmission || noSub) && <p>{noSubmissionText(target)}</p>}

      {/* Regular submissions */}
      {!noSub && !IS_PEER_EVAL && (
        <>
          {Object.keys(submission)?.map((key) => {
            const value = submission[key];
            if (!value || value.includes("fakepath")) return null;
            return (
              <div key={key} style={{ marginBottom: 8 }}>
                <p>
                  <b>{key}:</b> {value}
                </p>
              </div>
            );
          })}

          {files?.map((file) => (
            <div key={file}>
              <a
                href={`${config.url.API_GET_SUBMISSION_FILE}?file=${file}&log_id=${action.action_log_id}&project=${action.project}`}
                target="_blank"
                rel="noreferrer"
              >
                {file.replace(/^[^/]*\/(.*)$/, "$1")}
              </a>
            </div>
          ))}
        </>
      )}

      {/* Peer evaluation (student view) */}
      {!noSub && IS_PEER_EVAL && submission.Submitter !== "COACH" && (
        <>
          <h2>Coach Feedback</h2>
          <Segment>
            {Object.keys(submission.CoachFeedback ?? {}).map((key) => (
              <div key={key} style={{ marginBottom: 20 }}>
                <Header as="h3" dividing content={key} />
                <p>
                  {submission.CoachFeedback[key] || <i>No Feedback Provided</i>}
                </p>
              </div>
            ))}
          </Segment>

          <h2>Peer Feedback</h2>
          {Object.keys(submission.Students ?? {}).map((studentKey) => (
            <div key={studentKey}>
              <Header as="h2" dividing content={studentKey} />
              <Segment>
                {Object.keys(
                  submission.Students[studentKey].Feedback ?? {},
                ).map((fbKey) => (
                  <div key={fbKey} style={{ marginBottom: 15 }}>
                    <Header as="h3" dividing content={fbKey} />
                    {submission.Students[studentKey].Ratings?.hasOwnProperty(
                      fbKey,
                    ) && (
                      <Rating
                        rating={submission.Students[studentKey].Ratings[fbKey]}
                        maxRating={5}
                        disabled
                      />
                    )}
                    {submission.Students[studentKey].Feedback[fbKey] ? (
                      <Message>
                        <MessageHeader>Feedback:</MessageHeader>
                        <p>{submission.Students[studentKey].Feedback[fbKey]}</p>
                      </Message>
                    ) : (
                      <p>
                        <i>No Feedback Provided</i>
                      </p>
                    )}
                  </div>
                ))}
              </Segment>
            </div>
          ))}
        </>
      )}

      {/* Peer evaluation (coach view) */}
      {!noSub && IS_PEER_EVAL && submission.Submitter === "COACH" && (
        <EvalReview forms={submission} isSub id={projectName + semesterName} />
      )}
    </div>
  );
}
