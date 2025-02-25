import React, { useState } from "react";
import { TableCell, TableRow, Modal, Button } from "semantic-ui-react";
import StudentEditPanel from "./StudentEditPanel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function StudentRow(props) {
    let student_cells = [];

    const [openModal, setOpenModal] = useState(false);

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

        return (
            <>
                <TableRow key={props.student.system_id}>
                    <TableCell>{props.student.system_id}</TableCell>
                    
                    {/* Make name clickable only for coaches and admins */}
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
                    
                    <TableCell>
                        <a href={`mailto:${props.student.email}`}>{props.student.email}</a>
                    </TableCell>
                    
                    <TableCell>
                        {props.student.last_login ? dayjs(props.student.last_login).utc(true).local().format('DD/MM/YYYY HH:mm:ss') : "Never Logged in"}
                    </TableCell>
                </TableRow>

                {/* Student Details Modal */}
                <Modal open={openModal} onClose={() => setOpenModal(false)} size="small">
                    <Modal.Header>Student Details</Modal.Header>
                    <Modal.Content>
                        <p><strong>Name:</strong> {props.student.fname} {props.student.lname}</p>
                        <p><strong>Email:</strong> {props.student.email}</p>
                        <p><strong>Last Login:</strong> {props.student.last_login ? dayjs(props.student.last_login).utc(true).local().format('DD/MM/YYYY HH:mm:ss') : "Never Logged in"}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => setOpenModal(false)}>Close</Button>
                    </Modal.Actions>
                </Modal>
            </>
        );
    }
}
