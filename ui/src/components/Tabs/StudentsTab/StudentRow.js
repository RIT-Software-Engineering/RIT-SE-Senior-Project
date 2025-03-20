import React, { useState, useEffect } from "react";
import { TableCell, TableRow, Modal, Button, Accordion, Icon } from "semantic-ui-react";
import StudentEditPanel from "./StudentEditPanel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config } from "../../util/functions/constants";
import { formatDateTime } from "../../util/functions/utils";

dayjs.extend(utc);

export default function StudentRow(props) {
  let student_cells = [];

  const [openModal, setOpenModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [peerReviews, setPeerReviews] = useState([]);
  const [aiSummary, setAiSummary] = useState("No Summary Generated");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isEditing, setIsEditing] = useState(false);



  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const fetchPeerReviews = async () => {
    try {
      const url = `${config.url.API_GET_ACTION_LOGS}?project_id=${props.student.project}&action_id=2`;
      console.log("Fetching peer reviews from:", url);
      const response = await SecureFetch(url);
      const data = await response.json();
      console.log("Parsed JSON data:", data);

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
      console.log("Filtered peer reviews:", filteredReviews);
      setPeerReviews(filteredReviews);
    } catch (error) {
      console.error("Error fetching peer reviews:", error);
      setPeerReviews([]);
    }
  };

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
          form.Students = { [selectedStudentName]: form.Students[selectedStudentName] };
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
    const sanitizedReviews = peerReviews.map(review => sanitizeReview(review, selectedStudentName));
    const body = new FormData();
    body.append("context", JSON.stringify(sanitizedReviews));
    console.log("Generating AI Summary from sanitized reviews:", sanitizedReviews);

    const response = await SecureFetch(`${config.url.API_GENERATE_HISTORIC_SUMMARY}`, {
      method: "post",
      body: body,
    });

    const textData = await response.text();
    console.log("AI Summary response:", textData);
    setAiSummary(textData || "No Summary Generated");
  } catch (error) {
    console.error("Error generating AI Summary:", error);
    setAiSummary("Error generating summary");
  }
};

const fetchAdditionalInfo = async () => {
  try {
    const url = `${config.url.API_GET_ADDITIONAL_INFO}?system_id=${props.student.system_id}`;
    console.log("Fetching additional info from:", url);
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
};

const handleSaveAdditionalInfo = async () => {
  try {
    const url = `${config.url.API_UPDATE_ADDITIONAL_INFO}`;
    console.log("Updating additional info at:", url);

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

    console.log("Additional info updated successfully");
    setIsEditing(false); // Exit edit mode
  } catch (error) {
    console.error("Error updating additional info:", error);
  }
};



  useEffect(() => {
    if (openModal) {
      fetchPeerReviews();
      fetchAdditionalInfo();
    }
  }, [openModal]);

  

  if (!props.studentsTab) {
    student_cells.push(
      <TableCell key={"student-id-" + props.student.system_id}>{props.student.system_id}</TableCell>
    );
    student_cells.push(
      <TableCell key={"student-name-" + props.student.fname}>
        {props.student.fname} {props.student.lname}
      </TableCell>
    );
    student_cells.push(
      <TableCell key={"student-email-" + props.student.email}>
        <a href={`mailto:${props.student.email}`}>{props.student.email}</a>
      </TableCell>
    );
    student_cells.push(
      <TableCell key={"student-login-" + props.student.last_login}>
        {props.student.last_login
          ? dayjs(props.student.last_login).utc(true).local().format("DD/MM/YYYY HH:mm:ss")
          : "Never Logged in"}
      </TableCell>
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
    let project = props.projectsData?.[props.student.project]?.name || "No Project";
    return (
      <>
        <TableRow key={props.student.system_id}>
          <TableCell
            style={{
              cursor: "pointer",
              color:"blue",
              textDecoration:"underline",
            }}
            onClick={() => setOpenModal(true)}
          >
            {props.student.fname} {props.student.lname}
          </TableCell>
          <TableCell>{project}</TableCell>
          <TableCell>
            <a href={`mailto:${props.student.email}`}>{props.student.email}</a>
          </TableCell>
          <TableCell>
            {props.student.last_login
              ? dayjs(props.student.last_login).utc(true).local().format("DD/MM/YYYY HH:mm:ss")
              : "Never Logged in"}
          </TableCell>
        </TableRow>

        <Modal open={openModal} onClose={() => setOpenModal(false)} size="small" centered scrollable  style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"}}
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
                ? dayjs(props.student.last_login).utc(true).local().format("DD/MM/YYYY HH:mm:ss")
                : "Never Logged in"}
            </p>
            <p>
                <strong>Additional Info:</strong>
                {props.isStudent ? (
                  <>
                    {isEditing ? (
                      <>
                        <textarea
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                          rows={4}
                          style={{ width: "100%" }}
                        />
                        <Button onClick={handleSaveAdditionalInfo} primary size="small" style={{ marginTop: "0.5em" }}>
                          Save
                        </Button>
                        <Button onClick={() => setIsEditing(false)} size="small" style={{ marginTop: "0.5em", marginLeft: "0.5em" }}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <span style={{ marginLeft: "0.5em" }}>{additionalInfo || "No additional info available"}</span>
                        <Button onClick={() => setIsEditing(true)} size="small" style={{ marginLeft: "0.5em" }}>
                          Edit
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <span style={{ marginLeft: "0.5em" }}>{additionalInfo || "No additional info available"}</span>
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
                    studentReview = form.Students ? form.Students[studentName] || {} : {};
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
                        Review by {review.name} on {formatDateTime(review.submission_datetime)}
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex === index}>
                        {studentReview.Feedback || studentReview.Ratings ? (
                          <div>
                            {studentReview.Feedback && (
                              <div>
                                <p>
                                  <strong>Feedback:</strong>
                                </p>
                                {Object.entries(studentReview.Feedback).map(([question, answer]) => (
                                  <p key={question}>
                                    <strong>{question}:</strong> {answer}
                                  </p>
                                ))}
                              </div>
                            )}
                            {studentReview.Ratings && (
                              <div>
                                <p>
                                  <strong>Ratings:</strong>
                                </p>
                                {Object.entries(studentReview.Ratings).map(([question, rating]) => (
                                  <p key={question}>
                                    <strong>{question}:</strong> {rating}
                                  </p>
                                ))}
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
                rows={4}
                style={{ width: "100%" }}
              />
            </div>           
            <Button onClick={handleGenerateAISummary}>Generate AI Summary</Button>
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