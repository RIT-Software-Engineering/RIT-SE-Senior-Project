import React from "react";
import { TableCell, TableRow } from "semantic-ui-react";
import StudentEditPanel from "./StudentEditPanel";
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

export default function StudentRow(props) {
    let student_cells = []
    //Display all relevant information if user information is being displayed outside of the Students tab.
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
    }

    else{
        student_cells.push(
            <TableCell key={'student-name-'+props.student.fname}>{props.student.fname} {props.student.lname}</TableCell>
        )
        if(props.projectsData != null && props.projectsData[props.student.project] !== undefined){
            student_cells.push(
                <TableCell key={'student-project-'+props.student.project}>{props.projectsData[props.student.project || "noProject"].name}</TableCell>
            )
        }
        else{
            student_cells.push(
                <TableCell key={'student-project-noProject'}>{"No Project"}</TableCell>
            )
        }

        student_cells.push(
            <TableCell key={'student-email-'+props.student.email}><a href={`mailto:${props.student.email}`}>{props.student.email}</a></TableCell>
        )

        //This is for if you're a student, and it is not the first table displayed in the students tab.
        if(props.showLogin) {
            student_cells.push(
                <TableCell key={'student-login-' + props.student.last_login}>{props.student.last_login ? dayjs(props.student.last_login).utc(true).local().format('DD/MM/YYYY HH:mm:ss') : "Never Logged in"}</TableCell>
            )
        }
    }

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
