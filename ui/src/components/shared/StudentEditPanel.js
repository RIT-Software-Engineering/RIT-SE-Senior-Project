import React from 'react';

export default function StudentEditPanel(props){
    let student = props.student;
    return(<p>This will be a student component who's name is {student.fname + ' ' + student.lname}</p>);
}