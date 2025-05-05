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

        if (form.CoachFeedback) {
          delete form.CoachFeedback;
        }

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
    student_cells.push(
      <TableCell key={"student-id-" + props.student.system_id}>
        {props.student.system_id}
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
              .format("DD/MM/YYYY HH:mm:ss")
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
          <TableCell
            className="clickable-student-name"
            onClick={() => setOpenModal(true)}
          >
            {props.student.fname} {props.student.lname}
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
                    .format("DD/MM/YYYY HH:mm:ss")
                : "Never Logged in"}
            </TableCell>
          )}
        </TableRow>

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          size="small"
          centered={false} // Disable default centering
          style={{
            // position: "fixed",
            // top: "50%",
            // left: "50%",
            // transform: "translate(-50%, -50%)",
            // maxHeight: "90vh", // Prevents excessive height issues
            // overflowY: "auto",  // Allows scrolling if content overflows
            position: "sticky",
            top: "20%",
            left: "0%",
          }}
        >
          <Modal.Header>Student Details</Modal.Header>
          <Modal.Content>
            <p>
              <strong>Name:</strong> {props.student.fname} {props.student.lname}
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
                    .format("DD/MM/YYYY HH:mm:ss")
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
                        style={{ width: "100%" }}
                      />
                      <Button
                        onClick={handleSaveAdditionalInfo}
                        primary
                        size="small"
                        style={{ marginTop: "0.5em" }}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        size="small"
                        style={{ marginTop: "0.5em", marginLeft: "0.5em" }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span style={{ marginLeft: "0.5em" }}>
                        {additionalInfo || "No additional info available"}
                      </span>
                      <Button
                        onClick={() => setIsEditing(true)}
                        size="small"
                        style={{ marginLeft: "0.5em" }}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <span style={{ marginLeft: "0.5em" }}>
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
                        studentReview = form.Students
                          ? form.Students[studentName] || {}
                          : {};
                      } catch (e) {
                        console.error("Error parsing review form_data:", e);
                      }
                      return (
                        <div key={index}>
                          <Accordion.Title
                            active={activeIndex === index}
                            index={index}
                            onClick={() => handleAccordionClick(index)}
                          >
                            <Icon name="dropdown" />
                            Review by {review.system_id} on{" "}
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
                                    {Object.entries(studentReview.Feedback).map(
                                      ([question, answer]) => (
                                        <p key={question}>
                                          <strong>{question}:</strong> {answer}
                                        </p>
                                      ),
                                    )}
                                  </div>
                                )}
                                {studentReview.Ratings && (
                                  <div>
                                    <p>
                                      <strong>Ratings:</strong>
                                    </p>
                                    {Object.entries(studentReview.Ratings).map(
                                      ([question, rating]) => (
                                        <p key={question}>
                                          <strong>{question}:</strong> {rating}
                                        </p>
                                      ),
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
                <div style={{ marginTop: "1em" }}>
                  <textarea
                    readOnly
                    value={aiSummary}
                    rows={aiSummary === "No Summary Generated" ? 2 : 6}
                    style={{
                      width: "100%",
                      height:
                        aiSummary === "No Summary Generated" ? "50px" : "auto",
                      minHeight:
                        aiSummary === "No Summary Generated" ? "50px" : "200px",
                      resize: "vertical",
                    }}
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
                    <div style={{ marginTop: "10px" }}>
                      <textarea
                        value={tempPrompt}
                        onChange={(e) => setTempPrompt(e.target.value)}
                        rows={8}
                        style={{
                          width: "100%",
                          minWidth: "400px",
                          minHeight: "150px",
                          resize: "vertical",
                          marginBottom: "10px",
                          border:
                            tempPrompt !== PROMPT_GENERATE_HISTORIC_SUMMARY
                              ? "2px solid orange"
                              : "1px solid grey",
                          outline:
                            tempPrompt !== PROMPT_GENERATE_HISTORIC_SUMMARY
                              ? "2px solid orange"
                              : "none",
                        }}
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
