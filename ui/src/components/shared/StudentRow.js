import React from "react";
import {
    TableCell,
    TableRow,
    Button,
    Modal,
} from "semantic-ui-react";
import StudentEditPanel from "./StudentEditPanel";

export default function StudentRow(props) {
    return (
        <TableRow>
            <TableCell>{props.student.fname}</TableCell>
            <TableCell>{props.student.lname}</TableCell>
            <TableCell>{props.student.email}</TableCell>
            <TableCell>{props.student.semester_group}</TableCell>
            <TableCell>{props.student.project}</TableCell>
            <TableCell>
                <Modal
                    trigger={<Button icon="edit" />}
                    header={`Currently Editing "${props.student.system_id}"`}
                    content={{
                        content: (
                            <StudentEditPanel
                                studentData={props.student}
                                semesterData={props.semesterData}
                                key={"editStudent-" + props.student.system_id}
                            />
                        ),
                    }}
                    actions={[
                        {
                            key: "submit",
                            content: "Submit",
                            // onClick: (event, target) => submitProject(event, target),
                            positive: true,
                        },
                    ]}
                />
            </TableCell>
        </TableRow>
    );
}
