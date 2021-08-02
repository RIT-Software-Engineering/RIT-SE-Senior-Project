import React from "react";
import { TableCell, TableRow } from "semantic-ui-react";
import StudentEditPanel from "./StudentEditPanel";

export default function StudentRow(props) {
    return (
        <TableRow key={props.student.system_id}>
            <TableCell>{props.student.system_id}</TableCell>
            <TableCell>{props.student.fname} {props.student.lname}</TableCell>
            <TableCell><a href={`mailto:${props.student.email}`}>{props.student.email}</a></TableCell>
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
