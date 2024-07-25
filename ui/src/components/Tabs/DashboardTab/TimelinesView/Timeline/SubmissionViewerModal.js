import React, { useContext, useState } from "react";
import { ACTION_TARGETS, config } from "../../../../util/functions/constants";
import {
  Button,
  Divider,
  Header,
  Icon,
  Message, MessageHeader,
  Modal,
  Rating,
  Segment,
} from "semantic-ui-react";
import { formatDate } from "../../../../util/functions/utils";
import { SecureFetch } from "../../../../util/functions/secureFetch";
import EvalReview from "../../../../util/components/EvalReview";

export default function SubmissionViewerModal(props) {
  const [open, setOpen] = useState(false);
  const [submission, setSubmission] = useState({});
  const [files, setFiles] = useState([]);
  const [noSubmission, setNoSubmission] = useState(true);
  const [due, setDue] = useState();
  const [late, setLate] = useState(false);
  const [day, setDay] = useState(0);

  const loadSubmission = () => {
    SecureFetch(
      `${config.url.API_GET_SUBMISSION}?log_id=${props.action?.action_log_id}`
    )
      .then((response) => response.json())
      .then((submission) => {
        if (submission.length > 0) {
          const formData = JSON.parse(submission[0].form_data.toString());
          const fileData = submission[0].files?.split(",");
          setSubmission(formData);
          setFiles(fileData);
          setNoSubmission(formData.length === 0 && files.length === 0);
        }
      })
      .catch((error) => {
        alert("Failed to get action log data " + error);
      });

    SecureFetch(
      `${config.url.API_GET_LATE_SUBMISSION}?log_id=${props.action?.action_log_id}`
    )
      .then((response) => response.json())
      .then((dueDate) => {
        let dueDateTime = new Date(dueDate[0].due_date);
        setDue(dueDateTime);
        let submitDate = new Date(
          props.action.submission_datetime.split(" ")[0].toString()
        );
        setLate(dueDateTime < submitDate);
        if (dueDateTime < submitDate) {
          daysLate(dueDateTime, submitDate);
        }
      })
      .catch((error) => {
        alert("Failed to get due and submission data " + error);
      });
  };

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
        return "You can not view this submission";
    }
  };

  const daysLate = (due, submitted) => {
    const dueDate = formatDate(due);
    const submitDate = formatDate(submitted);
    const diffInMs = new Date(submitDate) - new Date(dueDate);
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    setDay(diffInDays);
  };

  const IS_PEER_EVALUATION = props.target === ACTION_TARGETS.peer_evaluation;

  return (
    <Modal

      className={"sticky"}
      onClose={() => {
        setOpen(false);
        props?.isOpenCallback(false);
      }}
      onOpen={() => {
        setOpen(true);
        props?.isOpenCallback(true);
      }}
      open={open}
      trigger={
        <div onClick={loadSubmission}>
          {props.trigger || (
            <Button icon>
              <Icon name="eye" />
            </Button>
          )}
        </div>
      }
      header={`Submission for ${
        props.action.action_title
      } (${props.target[0]?.toUpperCase()}${props.target?.substring(
        1
      )} Action)`}
      actions={[{ content: "Close", key: 0 }]}
      content={{
        content: (
          <div>
            <p>
              <b>Semester/Project:</b> {props.semesterName} -{" "}
              {props.projectName}
            </p>
            <p>
              <b>Submitted:</b>
              {props.action.mock_id &&
                ` ${props.action.mock_name} (${props.action.mock_id}) as `}
              {` ${props.action.name} (${props.action.system_id}) `}
              {formatDate(props.action.submission_datetime)}
              {` (Due ${formatDate(due)})`}
              {late && ` ${day} days' late`}
            </p>
            <Divider />
            <h3>Submission</h3>
            {(props.noSubmission || noSubmission) && (
              <p>{noSubmissionText(props.target)}</p>
            )}

            {/* Normal Submissions */}
            {!noSubmission && !IS_PEER_EVALUATION && (
              <>
                {Object.keys(submission)?.map((key) => {
                  if (submission[key].includes("fakepath")) {
                    return false;
                  }
                  return (
                    <div key={key}>
                      <p>
                        <b>{key}:</b> {submission[key]}
                      </p>
                    </div>
                  );
                })}
                {files?.map((file) => {
                  return (
                    <div key={file}>
                      <a
                        href={`${config.url.API_GET_SUBMISSION_FILE}?file=${file}&log_id=${props.action?.action_log_id}&project=${props.action?.project}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file.replace(/^[^/]*\/(.*)$/, "$1")}
                      </a>
                      <br />
                    </div>
                  );
                })}
              </>
            )}

            {/* Peer Evaluations */}
            {!noSubmission &&
              IS_PEER_EVALUATION &&
              submission.Submitter !== "COACH" && (
                <>
                  <h2>Coach Feedback</h2>
                  <Segment secondary={false}>
                    {Object.keys(submission.CoachFeedback ?? {})?.map((key) => (
                      <div style={{ marginBottom: "35px" }}>
                        <Header as={"h3"} dividing content={key} />
                        <p>
                          {" "}
                          {submission.CoachFeedback[key] || (
                            <i>No Feedback Provided</i>
                          )}
                        </p>
                      </div>
                    ))}
                  </Segment>
                  <h2>Peer Feedback</h2>
                  {Object.keys(submission.Students ?? {})?.map((key) => (
                    <div>
                      <Header as={"h2"} dividing content={key} />
                      <Segment>
                        {/* Peer Qualative Feedback */}
                        {Object.keys(submission.Students[key].Feedback)?.map(
                          (feedback_key) => (
                            <div style={{ marginBottom: "25px" }}>
                              <Header
                                as={"h3"}
                                dividing
                                content={feedback_key}
                              />

                              {/* Showing quantative feedback with written feedback */}
                              {submission.Students[key].Ratings.hasOwnProperty(
                                feedback_key
                              ) && (
                                <Rating
                                  rating={
                                    submission.Students[key].Ratings[
                                      feedback_key
                                    ]
                                  }
                                  maxRating={5}
                                  disabled
                                />
                              )}
                              {submission.Students[key].Feedback[
                                feedback_key
                              ] === "" ? (
                                <p style={{ marginTop: "5px" }}>
                                  <i>No Feedback Provided</i>
                                </p>
                              ) : (
                                <Message>
                                  <MessageHeader>Feedback:</MessageHeader>
                                  <p>
                                    {" "}
                                    {
                                      submission.Students[key].Feedback[
                                        feedback_key
                                      ]
                                    }
                                  </p>
                                </Message>
                              )}
                            </div>
                          )
                        )}

                        {/* Peer Quantative Feedback */}
                        {Object.keys(submission.Students[key].Ratings)?.map(
                          (rating_key) => {
                            if (
                              submission.Students[key].Feedback.hasOwnProperty(
                                rating_key
                              )
                            ) {
                              return false;
                            }
                            return (
                              <div style={{ marginBottom: "25px" }}>
                                <Header
                                  as={"h3"}
                                  dividing
                                  content={rating_key}
                                />
                                <Rating
                                  rating={
                                    submission.Students[key].Ratings[rating_key]
                                  }
                                  maxRating={5}
                                  disabled
                                />
                              </div>
                            );
                          }
                        )}
                      </Segment>
                      <br />
                    </div>
                  ))}
                </>
              )}

            {/* Peer Evaluations Coach View */}
            {!noSubmission &&
              IS_PEER_EVALUATION &&
              submission.Submitter === "COACH" && (
                <>
                  <EvalReview
                    forms={submission}
                    isSub={submission?.Submitter === "COACH"}
                    id={props.projectName + props.semesterName}
                  />
                </>
              )}
          </div>
        ),
      }}
    />
  );
}
