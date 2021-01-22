import React from 'react';

const MODAL_STATUS = {SUCCESS: "success", FAIL: "fail", CLOSED: false};

export default function StudentEditPanel(props){
    let student = props.student;
    return(<p>This will be a student component who's name is {student.fname + ' ' + student.lname}</p>);
}