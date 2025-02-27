import React, { useState, useEffect } from "react";
import { TableCell, TableRow, Modal, Button, Accordion, Icon } from "semantic-ui-react";
import StudentEditPanel from "./StudentEditPanel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config } from "../../util/functions/constants";

dayjs.extend(utc);

export default function StudentRow(props) {
  let student_cells = [];

  const [openModal, setOpenModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [peerReviews, setPeerReviews] = useState([]);

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

  useEffect(() => {
    if (openModal) {
      fetchPeerReviews();
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
              cursor: !props.isStudent ? "pointer" : "default",
              color: !props.isStudent ? "blue" : "black",
              textDecoration: !props.isStudent ? "underline" : "none",
            }}
            onClick={() => !props.isStudent && setOpenModal(true)}
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

        {/* Student Details Modal with Accordion for Peer Reviews */}
        <Modal open={openModal} onClose={() => setOpenModal(false)} size="small" centered scrollable style={{ top: '10%' }}>
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
                        Review by {review.name || review.Submitter}
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
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}
