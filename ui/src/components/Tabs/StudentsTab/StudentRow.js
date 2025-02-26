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
            let response = await SecureFetch(
                `${config.url.API_GET_ACTION_LOGS}?project_id=${props.student.project}&action_id=${props.action_id}`
            );
            
            // Ensure response.data is valid before updating state
            if (response && response.data) {
                setPeerReviews(response.data);
            } else {
                setPeerReviews([]); // Default to an empty array if data is undefined
            }
        } catch (error) {
            console.error("Error fetching peer reviews:", error);
            setPeerReviews([]); // Ensure the state is always an array
        }
    };
    

    useEffect(() => {
        if (openModal) {
            fetchPeerReviews();
        }
    }, [openModal]);
    if (!props.studentsTab){
        student_cells.push(
            <TableCell key={'student-id-'+props.student.system_id}>{props.student.system_id}</TableCell>
        )
        student_cells.push(
            <TableCell key={'student-name-'+props.student.fname}>{props.student.fname} {props.student.lname}</TableCell>
        )
        student_cells.push(
            <TableCell key={'student-email-'+props.student.email}><a href={`mailto:${props.student.email}`}>{props.student.email}</a></TableCell>
        )
        student_cells.push(
            <TableCell key={'student-login-'+props.student.last_login}>{props.student.last_login? dayjs(props.student.last_login).utc(true).local().format('DD/MM/YYYY HH:mm:ss') : "Never Logged in"}</TableCell>
        )

        return (
            <TableRow key={props.student.system_id}>
    
                {
                    student_cells
                }
    
                {!props.viewOnly && <TableCell>
                    <StudentEditPanel
                        studentData={props.student}
                        semesterData={props.semesterData}
                        header={`Currently Editing "${props.student.system_id}"`}
                        key={"editStudent-" + props.student.system_id}
                        projectsData={props.projectsData}
                    />
                </TableCell>}
            </TableRow>
        );
    }

    else{
        let project = props.projectsData?.[props.student.project]?.name || "No Project";
        console.log(props)
        return (
            <>
                <TableRow key={props.student.system_id}>
                    <TableCell 
                        style={{ 
                            cursor: !props.isStudent ? "pointer" : "default", 
                            color: !props.isStudent ? "blue" : "black",
                            textDecoration: !props.isStudent ? "underline" : "none"
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
                        {props.student.last_login ? dayjs(props.student.last_login).utc(true).local().format('DD/MM/YYYY HH:mm:ss') : "Never Logged in"}
                    </TableCell>
                </TableRow>

                {/* Student Details Modal with Accordion */}
                <Modal open={openModal} onClose={() => setOpenModal(false)} size="small">
                    <Modal.Header>Student Details</Modal.Header>
                    <Modal.Content>
                        <p><strong>Name:</strong> {props.student.fname} {props.student.lname}</p>
                        <p><strong>Email:</strong> {props.student.email}</p>
                        <p><strong>Last Login:</strong> {props.student.last_login ? dayjs(props.student.last_login).utc(true).local().format('DD/MM/YYYY HH:mm:ss') : "Never Logged in"}</p>

                        {/* Accordion for Peer Reviews */}
                        <Accordion styled fluid>
                            {peerReviews.length > 0 ? (
                                peerReviews.map((review, index) => (
                                    <div key={index}>
                                        <Accordion.Title
                                            active={activeIndex === index}
                                            index={index}
                                            onClick={() => handleAccordionClick(index)}
                                        >
                                            <Icon name='dropdown' />
                                            Review by {review.reviewer}
                                        </Accordion.Title>
                                        <Accordion.Content active={activeIndex === index}>
                                            <p><strong>Feedback:</strong> {review.feedback}</p>
                                            <p><strong>Rating:</strong> {review.rating}/5</p>
                                        </Accordion.Content>
                                    </div>
                                ))
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
