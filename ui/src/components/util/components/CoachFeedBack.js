import React, { useEffect, useState } from 'react';
import { Header, Form, FormField, Button, Grid, Divider, Label, List, ListItem } from "semantic-ui-react";
import { SecureFetch } from "../functions/secureFetch";
import { config } from "../functions/constants";

export default function CoachFeedback(props) {
    const [studentList, setStudentList] = useState([]);
    const [submissionList, setSubmissionList] = useState([]);
    const [studentData, setStudentData] = useState([]);
    //const [categoriesList, setCategories] = useState([]);

    const camelCaseToSentence = (string = "") =>
        string.replace(
            /([A-Z])/g,
            word => ` ${word}`
        ).trimStart();

    // Function to translate peer evaluation data from camelCase keys to readable format


    // Function to fetch submissions and set submissionList state
    const fetchSubmissions = () => {
        SecureFetch(`${config.url.API_GET_ACTION_LOGS}?project_id=${props.team}&action_id=${props.action_id}`)
            .then(response => response.json())
            .then((actionLogs) => {
                const formatedLogs = actionLogs.map(sumb => JSON.parse(sumb.form_data));
                setSubmissionList(actionLogs);
                setStudentData(formatedLogs);
            })
            .catch((err) => {
                console.error("Failed to get submissions", err);
            });
    };

    // Function to fetch student list based on project ID and set studentList state
    const fetchStudentList = () => {
        SecureFetch(`${config.url.API_GET_PROJECT_STUDENT_NAMES}?project_id=${props.team}`)
            .then(response => response.json())
            .then((data) => {
                const combinedNames = data.map(student => `${student.fname} ${student.lname}`);
                setStudentList(combinedNames);
            })
            .catch((err) => {
                setStudentList(["Student 1", "Student 2", "Student 3", "Student 4"]);
                console.error("Failed to get students", err);
            });
    };

    useEffect(() => {
        fetchStudentList();
        fetchSubmissions();


    },[props.team] );



    // Function to generate feedback form for a student
    const generateFeedbackForm = (student, index) => {
        console.log(studentList);
        console.log(submissionList);
        console.log(studentData);
        const studentFormData = studentData.find(formData => formData.Students && formData.Students[student]);
        if (!studentFormData) return null;


        const { CoachFeedback, Students } = studentFormData;
        const studentFeedback = Students[student];
        console.log(CoachFeedback);
        return(
        <div key={index}>
            <Form>
                <Divider section />
                <Header size={"large"}  Block Header >{student}</Header>
                <Grid>
                    {CoachFeedback.map((category, index) => (
                        <Grid.Row columns={2} key={index}>
                            <Grid.Column>
                                <Label as='h4'>{category}</Label>
                                <textarea rows={4} value={CoachFeedback[category]} readOnly={true} />
                            </Grid.Column>
                        </Grid.Row>

                    ))}
                </Grid>
                <Divider section />
                <Header as="h4">Ratings from Team Members</Header>
                <List>
                    {studentList.map((otherStudent, otherIndex) =>
                            index !== otherIndex && (
                                <ListItem key={otherIndex}>
                                    <Label>{otherStudent}</Label>
                                    <div>
                                        <label>Communication</label>
                                        <input type="text" value="4.5 / 5" disabled />
                                        <label>Participation</label>
                                        <input type="text" value="3.5 / 5" disabled />
                                    </div>
                                </ListItem>
                            )
                    )}
                </List>
                <FormField>
                    <label>Coach Feedback</label>
                    <textarea rows={4} />
                    <Button attached='bottom' content='Generate AI Summarization' />
                </FormField>
            </Form>
        </div>
    );
    }

    // Render the component only if both studentList and submissionList are populated
    if (studentList.length === 0 || submissionList.length === 0) {
        return <Header as="h1">None Available</Header>;

    }

    return (
        <>
            <Header as="h1">Peer Evaluation Summary</Header>
            {studentList.map((student, index) => generateFeedbackForm(student, index))}
        </>
    );
}
