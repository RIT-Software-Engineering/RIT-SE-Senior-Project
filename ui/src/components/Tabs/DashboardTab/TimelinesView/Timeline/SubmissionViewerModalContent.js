import React, { useState, useEffect } from "react";
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
  const [due, setDue] = useState();
  const [late, setLate] = useState(false);
  const [day, setDay] = useState(0);

  // Load submission + due date
  useEffect(() => {
    if (!action?.action_log_id) return;

    SecureFetch(
      `${config.url.API_GET_SUBMISSION}?log_id=${action.action_log_id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const formData = JSON.parse(data[0].form_data.toString());
          const fileData = data[0].files?.split(",");
          setSubmission(formData);
          setFiles(fileData);
          setNoSub(formData.length === 0 && fileData?.length === 0);
        }
      })
      .catch((err) => alert("Failed to get submission: " + err));

    SecureFetch(
      `${config.url.API_GET_LATE_SUBMISSION}?log_id=${action.action_log_id}`,
    )
      .then((res) => res.json())
      .then((dueDate) => {
        const dueDateTime = new Date(dueDate[0].due_date);
        setDue(dueDateTime);
        const submitDate = new Date(
          action.submission_datetime.split(" ")[0].toString(),
        );
        setLate(dueDateTime < submitDate);
        if (dueDateTime < submitDate) {
          const diff = Math.floor(
            (submitDate - dueDateTime) / (1000 * 60 * 60 * 24),
          );
          setDay(diff);
        }
      })
      .catch((err) => alert("Failed to get due date: " + err));
  }, [action]);

  const noSubmissionText = (target) => {
    switch (target) {
      case ACTION_TARGETS.individual:
        return "Individual Submissions are Not Viewable by Team Members";
      case ACTION_TARGETS.peer_evaluation:
        return "Peer Evaluation Submissions are Not Viewable by Team Members";
      case ACTION_TARGETS.coach:
        return "Coach Submissions are Not Viewable by Team Members";
      case ACTION_TARGETS.admin:
        return "Admin Submissions are Not Viewable by Team Members";
      default:
        return "You cannot view this submission";
    }
  };

  const IS_PEER_EVAL = target === ACTION_TARGETS.peer_evaluation;

  return (
    <div>
      <p>
        <b>Semester/Project:</b> {semesterName} – {projectName}
      </p>

      {/* Who submitted */}
      <p style={{ display: "flex", alignItems: "center" }}>
        <b>Submitted:</b>
        {action.mock_id && (
          <span
            style={{ display: "flex", alignItems: "center", marginLeft: "5px" }}
          >
            <ProfileCircle
              name={action.mock_name}
              isStudent={false}
              size="tiny"
            />
            <span style={{ marginLeft: "5px" }}>
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
          style={{ marginLeft: "5px" }}
        />
        <span style={{ marginLeft: "5px" }}>
          {action.name} ({action.system_id})
        </span>
        <span style={{ marginLeft: "5px" }}>
          on {formatDate(action.submission_datetime)}
        </span>
        <span style={{ marginLeft: "5px" }}>(Due {formatDate(due)})</span>
        {late && (
          <span style={{ color: "red", marginLeft: "5px", fontWeight: "bold" }}>
            {day} days late
          </span>
        )}
      </p>

      <Divider />
      <h3>Submission</h3>

      {(noSubmission || noSub) && <p>{noSubmissionText(target)}</p>}

      {/* Normal submission */}
      {!noSub && !IS_PEER_EVAL && (
        <>
          {Object.keys(submission)?.map((key) => {
            if (submission[key].includes("fakepath")) return null;
            return (
              <div key={key}>
                <p>
                  <b>{key}:</b> {submission[key]}
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

      {/* Peer evaluations (student view) */}
      {!noSub && IS_PEER_EVAL && submission.Submitter !== "COACH" && (
        <>
          <h2>Coach Feedback</h2>
          <Segment>
            {Object.keys(submission.CoachFeedback ?? {}).map((key) => (
              <div key={key} style={{ marginBottom: "20px" }}>
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
                {Object.keys(submission.Students[studentKey].Feedback)?.map(
                  (fbKey) => (
                    <div key={fbKey} style={{ marginBottom: "15px" }}>
                      <Header as="h3" dividing content={fbKey} />
                      {submission.Students[studentKey].Ratings.hasOwnProperty(
                        fbKey,
                      ) && (
                        <Rating
                          rating={
                            submission.Students[studentKey].Ratings[fbKey]
                          }
                          maxRating={5}
                          disabled
                        />
                      )}
                      {submission.Students[studentKey].Feedback[fbKey] ===
                      "" ? (
                        <p>
                          <i>No Feedback Provided</i>
                        </p>
                      ) : (
                        <Message>
                          <MessageHeader>Feedback:</MessageHeader>
                          <p>
                            {submission.Students[studentKey].Feedback[fbKey]}
                          </p>
                        </Message>
                      )}
                    </div>
                  ),
                )}
              </Segment>
            </div>
          ))}
        </>
      )}

      {/* Peer evaluations (coach view) */}
      {!noSub && IS_PEER_EVAL && submission.Submitter === "COACH" && (
        <EvalReview forms={submission} isSub id={projectName + semesterName} />
      )}
    </div>
  );
}
