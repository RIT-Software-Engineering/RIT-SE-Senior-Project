import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  TableCell,
  TableRow,
  Modal,
  Button,
  Accordion,
  Icon,
} from "semantic-ui-react";
import StudentEditPanel from "./StudentEditPanel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config } from "../../util/functions/constants";
import { formatDateTime } from "../../util/functions/utils";
import { UserContext } from "../../util/functions/UserContext";
import { PROMPT_GENERATE_HISTORIC_SUMMARY } from "../../util/functions/constants";
import ProfileCircle from "../../util/components/ProfileCircle";

import "./../../../css/components/tabs/student.css";

dayjs.extend(utc);

//Query to get peer evals can be updated to not grab so many results and potentially student ids to return less , currently it returns all peer evals in the db from a semester if one is given or all of them if one isn't

export default function StudentRow(props) {
  let student_cells = [];

  const [openModal, setOpenModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [peerReviews, setPeerReviews] = useState([]);
  const [aiSummary, setAiSummary] = useState("No Summary Generated");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(
    PROMPT_GENERATE_HISTORIC_SUMMARY,
  );
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [tempPrompt, setTempPrompt] = useState(customPrompt);
  const [canUseAI, setCanUseAI] = useState(false);

  const { user } = useContext(UserContext);
  const currentUserID = user?.user;

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const fetchPeerReviews = useCallback(async () => {
    try {
      const url = `${config.url.API_GET_PEER_EVALS}?semester=${props.student.semester_group}`;
      const response = await SecureFetch(url);
      const data = await response.json();

      const allReviews = Array.isArray(data) ? data : [];
      const studentName = `${props.student.fname} ${props.student.lname}`;
      const filteredReviews = allReviews.filter((review) => {
        try {
          const form = JSON.parse(review.form_data);
          return form.Students && form.Students.hasOwnProperty(studentName);
        } catch (error) {
          console.error("Error parsing form_data:", error);
          return false;
        }
      });
      setPeerReviews(filteredReviews);
    } catch (error) {
      console.error("Error fetching peer reviews:", error);
      setPeerReviews([]);
    }
  }, [props.student.semester_group, props.student.fname, props.student.lname]);

  const sanitizeReview = (review, selectedStudentName) => {
    const {
      action_log_id,
      action_template,
      system_id,
      mock_id,
      files,
      action_title,
      mock_name,
      project,
      name,
      ...rest
    } = review;

    if (rest.form_data) {
      try {
        const form = JSON.parse(rest.form_data);

        // Handle coach feedback - keep only the selected student's feedback
        if (form.CoachFeedback && review.type === "coach") {
          if (form.CoachFeedback.hasOwnProperty(selectedStudentName)) {
            form.CoachFeedback = {
              [selectedStudentName]: form.CoachFeedback[selectedStudentName],
            };
          } else {
            delete form.CoachFeedback;
          }
        }

        // Handle peer feedback
        if (form.Students) {
          if (form.Students.hasOwnProperty(selectedStudentName)) {
            form.Students = {
              [selectedStudentName]: form.Students[selectedStudentName],
            };
          } else {
            delete form.Students;
          }
        }

        rest.form_data = JSON.stringify(form);
      } catch (e) {
        console.error("Error sanitizing form_data:", e);
        rest.form_data = "";
      }
    }

    // Preserve reviewer information for AI summary
    rest.reviewer_name = `${review.fname} ${review.lname}`;
    rest.reviewer_type = review.type;

    return rest;
  };

  const handleGenerateAISummary = async () => {
    try {
      const selectedStudentName = `${props.student.fname} ${props.student.lname}`;
      const sanitizedReviews = peerReviews.map((review) =>
        sanitizeReview(review, selectedStudentName),
      );

      const body = new FormData();
      body.append("context", JSON.stringify(sanitizedReviews));
      body.append("prompt", customPrompt);

      const response = await SecureFetch(
        `${config.url.API_GENERATE_RESPONSE}`,
        {
          method: "post",
          body: body,
        },
      );

      const textData = await response.text();
      setAiSummary(textData || "No Summary Generated");
    } catch (error) {
      console.error("Error generating AI Summary:", error);
      setAiSummary("Error generating summary");
    }
  };

  const fetchAdditionalInfo = useCallback(async () => {
    try {
      const url = `${config.url.API_GET_ADDITIONAL_INFO}?system_id=${props.student.system_id}`;
      const response = await SecureFetch(url);
      const data = await response.json();

      if (data && data.additional_info) {
        setAdditionalInfo(data.additional_info);
      } else {
        setAdditionalInfo("No additional information available.");
      }
    } catch (error) {
      console.error("Error fetching additional info:", error);
      setAdditionalInfo("Error loading additional information.");
    }
  }, [props.student.system_id]);

  useEffect(() => {
    if (openModal) {
      if (!props.isStudent) {
        SecureFetch(`${config.url.API_CHECK_GEMINI_KEY_EXISTS}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.valid === true) {
              setCanUseAI(true);
            } else {
              setCanUseAI(false);
            }
          })
          .catch((err) => {
            setCanUseAI(false);
          });
        fetchPeerReviews();
      }
      fetchAdditionalInfo();
    }
  }, [openModal, fetchAdditionalInfo, fetchPeerReviews, props.isStudent]);

  const handleSaveAdditionalInfo = async () => {
    try {
      const url = `${config.url.API_POST_EDIT_ADDITIONAL_INFO}`;

      const response = await SecureFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_id: props.student.system_id,
          additional_info: additionalInfo,
        }),
      });

      if (!response.ok) throw new Error("Failed to update additional info");

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating additional info:", error);
    }
  };

  useEffect(() => {
    if (openModal) {
      if (!props.isStudent) {
        fetchPeerReviews();
      }
      fetchAdditionalInfo();
    }
  }, [openModal, fetchAdditionalInfo, fetchPeerReviews, props.isStudent]);

  if (!props.studentsTab) {
    // Helper function to get user status text
    const getUserStatusText = () => {
      const isDeactivated = props.student.active && props.student.active !== "";
      const isViewOnly =
        props.student.view_only === "TRUE" || props.student.view_only === true;

      let statusText = "";
      if (isDeactivated && isViewOnly) {
        statusText = " (Deactivated, View Only)";
      } else if (isDeactivated) {
        statusText = " (Deactivated)";
      } else if (isViewOnly) {
        statusText = " (View Only)";
      }
      return statusText;
    };

    const statusText = getUserStatusText();

    student_cells.push(
      <TableCell key={"student-id-" + props.student.system_id}>
        {props.student.system_id}
        {statusText && <div className="student-status">{statusText}</div>}
      </TableCell>,
    );
    student_cells.push(
      <TableCell key={"student-name-" + props.student.fname}>
        {props.student.fname} {props.student.lname}
      </TableCell>,
    );
    student_cells.push(
      <TableCell key={"student-email-" + props.student.email}>
        <a href={`mailto:${props.student.email}`}>{props.student.email}</a>
      </TableCell>,
    );
    student_cells.push(
      <TableCell key={"student-login-" + props.student.last_login}>
        {props.student.last_login
          ? dayjs(props.student.last_login)
              .utc(true)
              .local()
              .format("MM/DD/YYYY HH:mm:ss")
          : "Never Logged in"}
      </TableCell>,
    );

    return (
      <TableRow key={props.student.system_id}>
        {student_cells}
        {!props.viewOnly && (
          <TableCell>
            <StudentEditPanel
              studentData={props.student}
              semesterData={props.semesterData}
              header={`Currently Editing "${props.student.system_id}"`}
              key={"editStudent-" + props.student.system_id}
              projectsData={props.projectsData}
              callback={props.callback}
            />
          </TableCell>
        )}
      </TableRow>
    );
  } else {
    let project =
      props.projectsData?.[props.student.project]?.name || "No Project";
    return (
      <>
        <TableRow key={props.student.system_id}>
          <TableCell onClick={() => setOpenModal(props.isMyTeamTable)}>
            <ProfileCircle
              user={props.student}
              size="tiny"
              showFullName
              textUnderlined
              clickable
            />
          </TableCell>

          <TableCell>{project}</TableCell>
          <TableCell>
            <a href={`mailto:${props.student.email}`}>{props.student.email}</a>
          </TableCell>
          {props.showLogin && (
            <TableCell>
              {props.student.last_login
                ? dayjs(props.student.last_login)
                    .utc(true)
                    .local()
                    .format("MM/DD/YYYY HH:mm:ss")
                : "Never Logged in"}
            </TableCell>
          )}
        </TableRow>

        <Modal
          open={openModal}
          closeOnDimmerClick={false}
          onClose={() => setOpenModal(false)}
          size="small"
          centered={false} // Disable default centering
          className="student-modal"
        >
          <Modal.Header>Student Details</Modal.Header>
          <Modal.Content>
            <p className="student-detail">
              <strong>Name:</strong>
              <ProfileCircle
                name={`${props.student.fname} ${props.student.lname}`}
                size="tiny"
                className="student-name"
              />
              <span>
                {props.student.fname} {props.student.lname}
              </span>
            </p>
            <p>
              <strong>Email:</strong> {props.student.email}
            </p>
            <p>
              <strong>Last Login:</strong>{" "}
              {props.student.last_login
                ? dayjs(props.student.last_login)
                    .utc(true)
                    .local()
                    .format("MM/DD/YYYY HH:mm:ss")
                : "Never Logged in"}
            </p>
            <p>
              <strong>Additional Info:</strong>
              {props.isStudent && props.student.system_id === currentUserID ? (
                <>
                  {isEditing ? (
                    <>
                      <textarea
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        rows={4}
                        className="student-text"
                      />
                      <Button
                        onClick={handleSaveAdditionalInfo}
                        primary
                        size="small"
                        className="student-button-save"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        size="small"
                        className="student-button-cancel"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="student-addtion">
                        {additionalInfo || "No additional info available"}
                      </span>
                      <Button
                        onClick={() => setIsEditing(true)}
                        size="small"
                        className="student-button-edit"
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <span className="student-button-edit">
                  {additionalInfo || "No additional info available"}
                </span>
              )}
            </p>

            {!props.isStudent && (
              <>
                <Accordion styled fluid>
                  {peerReviews.length > 0 ? (
                    peerReviews.map((review, index) => {
                      let studentReview = {};
                      try {
                        const form = JSON.parse(review.form_data);
                        const studentName = `${props.student.fname} ${props.student.lname}`;

                        // Check if this is coach feedback or peer feedback
                        if (review.type === "coach" && form.CoachFeedback) {
                          // Handle coach feedback structure
                          studentReview = form.CoachFeedback[studentName] || {};
                        } else {
                          // Handle regular peer feedback structure
                          studentReview = form.Students
                            ? form.Students[studentName] || {}
                            : {};
                        }
                      } catch (e) {
                        console.error("Error parsing review form_data:", e);
                      }
                      return (
                        <div key={index}>
                          <Accordion.Title
                            active={activeIndex === index}
                            index={index}
                            onClick={() => handleAccordionClick(index)}
                            className="student-title"
                          >
                            <Icon name="dropdown" />
                            <ProfileCircle
                              user={{
                                fname: review.fname,
                                lname: review.lname,
                                type: review.type,
                              }}
                              isStudent={review.type === "student"}
                              size="tiny"
                              className="student-profile"
                            />
                            Review by {review.fname} {review.lname} on{" "}
                            {formatDateTime(review.submission_datetime)}
                          </Accordion.Title>
                          <Accordion.Content active={activeIndex === index}>
                            {studentReview.Feedback || studentReview.Ratings ? (
                              <div>
                                {studentReview.Feedback && (
                                  <div>
                                    <p>
                                      <strong>Feedback:</strong>
                                    </p>
                                    {(() => {
                                      // Handle different feedback data types
                                      const feedback = studentReview.Feedback;

                                      if (typeof feedback === "string") {
                                        return (
                                          <p className="student-feedback">
                                            {feedback}
                                          </p>
                                        );
                                      } else if (Array.isArray(feedback)) {
                                        // If it's an array, join it back to a string
                                        return (
                                          <p className="student-feedback">
                                            {feedback.join("")}
                                          </p>
                                        );
                                      } else if (
                                        typeof feedback === "object" &&
                                        feedback !== null
                                      ) {
                                        // If it's an object, check if it's array-like (numeric keys)
                                        const keys = Object.keys(feedback);
                                        const isArrayLike =
                                          keys.every(
                                            (key) => !isNaN(parseInt(key)),
                                          ) && keys.length > 0;

                                        if (isArrayLike) {
                                          // Convert array-like object back to string
                                          const sortedKeys = keys.sort(
                                            (a, b) => parseInt(a) - parseInt(b),
                                          );
                                          const reconstructedString = sortedKeys
                                            .map((key) => feedback[key])
                                            .join("");
                                          return (
                                            <p className="student-feedback">
                                              {reconstructedString}
                                            </p>
                                          );
                                        } else {
                                          // Regular object with key-value pairs
                                          return Object.entries(feedback).map(
                                            ([question, answer]) => (
                                              <p key={question}>
                                                <strong>{question}:</strong>{" "}
                                                {answer}
                                              </p>
                                            ),
                                          );
                                        }
                                      } else {
                                        return <p>No feedback available.</p>;
                                      }
                                    })()}
                                  </div>
                                )}
                                {studentReview.Ratings && (
                                  <div>
                                    <p>
                                      <strong>Ratings:</strong>
                                    </p>
                                    {typeof studentReview.Ratings ===
                                      "object" &&
                                    studentReview.Ratings !== null ? (
                                      Object.entries(studentReview.Ratings).map(
                                        ([question, rating]) => (
                                          <p key={question}>
                                            <strong>{question}:</strong>{" "}
                                            {rating}
                                          </p>
                                        ),
                                      )
                                    ) : (
                                      <p>{studentReview.Ratings}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p>No review details available.</p>
                            )}
                          </Accordion.Content>
                        </div>
                      );
                    })
                  ) : (
                    <p>No peer reviews available.</p>
                  )}
                </Accordion>
                <div className="student-accordian">
                  <textarea
                    readOnly
                    value={aiSummary}
                    rows={aiSummary === "No Summary Generated" ? 2 : 6}
                    className={`student-ai-summary-textarea${
                      aiSummary === "No Summary Generated"
                        ? " student-ai-summary-textarea-empty"
                        : ""
                    }`}
                  />
                </div>
                <Button
                  attached="bottom"
                  onClick={handleGenerateAISummary}
                  color="grey"
                  content={
                    customPrompt !== PROMPT_GENERATE_HISTORIC_SUMMARY
                      ? "Generate AI Summarization with Custom Prompt"
                      : "Generate AI Summarization"
                  }
                ></Button>
                <div>
                  <Button
                    attached="bottom"
                    onClick={() => {
                      setIsEditingPrompt(!isEditingPrompt);
                      setTempPrompt(customPrompt);
                    }}
                  >
                    {isEditingPrompt ? "Close Prompt Editor" : "Edit Prompt"}
                  </Button>
                  {isEditingPrompt && (
                    <div className="student-editing">
                      <textarea
                        value={tempPrompt}
                        onChange={(e) => setTempPrompt(e.target.value)}
                        rows={8}
                        className={`student-prompt-textarea${
                          tempPrompt !== PROMPT_GENERATE_HISTORIC_SUMMARY
                            ? " student-prompt-textarea-modified"
                            : ""
                        }`}
                      />
                      <div>
                        <Button
                          color="blue"
                          onClick={() => {
                            setCustomPrompt(tempPrompt);
                            setIsEditingPrompt(false);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          color="red"
                          onClick={() => {
                            setCustomPrompt(PROMPT_GENERATE_HISTORIC_SUMMARY);
                            setIsEditingPrompt(false);
                          }}
                        >
                          Reset
                        </Button>
                        <Button
                          color="grey"
                          onClick={() => {
                            setIsEditingPrompt(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}
