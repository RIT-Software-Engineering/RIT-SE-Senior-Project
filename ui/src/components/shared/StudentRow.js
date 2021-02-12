import React from "react";
import { TableCell, TableRow } from "semantic-ui-react";
import StudentEditPanel from "./StudentEditPanel";

export default function StudentRow(props) {
    return (
        <TableRow key={props.student.system_id}>
            <TableCell>{props.student.fname}</TableCell>
            <TableCell>{props.student.lname}</TableCell>
            <TableCell>{props.student.email}</TableCell>
            <TableCell>{props.student.semester_group}</TableCell>
            <TableCell>{props.student.project}</TableCell>
            <TableCell>
                <StudentEditPanel
                    studentData={props.student}
                    semesterData={props.semesterData}
                    header={`Currently Editing "${props.student.system_id}"`}
                    key={"editStudent-" + props.student.system_id}
                />
            </TableCell>
        </TableRow>
    );
}
