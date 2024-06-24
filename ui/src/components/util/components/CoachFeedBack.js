import React, {useEffect} from 'react';
import {Header, Form, FormField, Button, Grid, Divider, Label, List, ListItem,} from "semantic-ui-react";
import {SecureFetch} from "../functions/secureFetch";
import {config} from "../functions/constants";
export default function CoachFeedBack(props) {
    const [studentList, setStudentList] = React.useState([]);

    const fetchStudentList = async () => {
        let url=  config.url.API_GET_PROJECT_STUDENT_NAMES
        SecureFetch(`${url}?project_id=${props.team}`)
            .then(response => response.json())
            .then((data) => {
                const combinedNames = data.map(student => `${student.fname} ${student.lname}`);
                setStudentList(combinedNames);
            })
            .catch(err => {
                setStudentList(["Student 1", "Student 2", "Student 3", "Student 4"]);
                console.error("Failed to get students", err);
            });
        };

useEffect(() => {
    fetchStudentList();
}, [props.team]);

    const generateFeedbackForm = (student, index) => (
        <div key={index}>
            <Form>
                <Divider section />
                    <Header size={"large"}  Block Header >{student}</Header>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Label>Public Feedback</Label>
                            <textarea rows={4} disabled />
                        </Grid.Column>
                        <Grid.Column>
                            <Label>Private Feedback</Label>
                            <textarea rows={4} disabled />
                        </Grid.Column>
                    </Grid.Row>
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

return (
    <>
        <Header as="h1">Peer Evaluation Summary</Header>
        {studentList.map((student, index) => generateFeedbackForm(student, index))}
    </>
);
}