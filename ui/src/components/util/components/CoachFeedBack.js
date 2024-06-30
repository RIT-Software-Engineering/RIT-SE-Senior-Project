import React, {useEffect, useState} from 'react';
import {
    Button, Divider, Form, FormField, Grid, Header, Label, List, ListItem, Rating,
    Table, TableHeader, TableHeaderCell, TableRow, TextArea
} from "semantic-ui-react";
import {SecureFetch} from "../functions/secureFetch";
import {config} from "../functions/constants";
import ResultTable from "./ResultTable";

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

    // Function to fetch submissions and set submissionList state
    const fetchSubmissions = () => {
        SecureFetch(`${config.url.API_GET_ACTION_LOGS}?project_id=${props.team}&action_id=${props.action_id}`)
            .then(response => response.json())
            .then((actionLogs) => {
                const formatedLogs = actionLogs.map(submission => JSON.parse(submission.form_data));
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
    }, [props.team]);


    // Function to generate feedback form for a student
    const generateFeedbackForm = (student, index) => {
        // TODO: Implement max rating based on the form
        const maxRating = 5
        const showAverage = true;

        console.log("Students", studentList);
        console.log("Submissions", submissionList);
        console.log("Student Data", studentData);

        // NOTE: You can use the formdata.Submitter to differentiate Coach and Student as well somehow on submission
        // e.g. could just set it to "Coach" since we don't actually care about whom the coach is
        const studentSubmission = studentData.find(formData => formData.Submitter === student)
        if (!studentSubmission) return null;

        // NOTE: Get other student ratings separate from self ratings for average
        const otherStudentRatings = studentData
            .filter(formData => formData.Submitter !== student && formData.Students[student])
            .map(formData => ({
                From: formData.Submitter,
                Ratings: formData.Students[student].Ratings,
                Feedback: formData.Students[student].Feedback
            }));

        const CoachFeedback = studentSubmission.CoachFeedback ?? {};
        const SelfFeedback = studentSubmission.Students?.[student] ?? {};
        const OthersFeedback = otherStudentRatings.length > 0 ? otherStudentRatings : [];

        // NOTE: Average Ratings Calculation
        const OthersFeedbackAvg = {}

        OthersFeedback.map(({Ratings: otherRatings}) => {
            Object.entries(otherRatings).forEach(([category, newRating]) => {
                if (!OthersFeedbackAvg[category]) OthersFeedbackAvg[category] = []
                OthersFeedbackAvg[category].push(newRating)
            })
        })

        Object.entries(OthersFeedbackAvg).forEach(([category, ratings]) => {
            OthersFeedbackAvg[category] = ratings.reduce((prev, curr, _, {length}) => prev + curr / length, 0)
        })

        // console.log("OthersFeedbackAvg", OthersFeedbackAvg);
        // console.log("OthersFeedback", OthersFeedback);
        console.log("CoachFeedback", CoachFeedback);
        return (
            <div key={index}>
                <Form>
                    <Divider section/>
                    <Header size={"large"} block>{student}</Header>
                    <Header as="h3">Coach Feedback</Header>
                    <Grid>
                        {Object.keys(CoachFeedback).map((category, index) => {
                            if (index % 2 === 0) {
                                return (
                                    <Grid.Row columns={2} key={index}>
                                        <Grid.Column>
                                            <Label as='h2'>{Object.keys(CoachFeedback)[index]}</Label>
                                            <textarea rows={4} value={CoachFeedback[Object.keys(CoachFeedback)[index]]} readOnly={true} />
                                        </Grid.Column>
                                        {Object.keys(CoachFeedback)[index + 1] && (
                                            <Grid.Column>
                                                <Label as='h2'>{Object.keys(CoachFeedback)[index + 1]}</Label>
                                                <textarea rows={4} value={CoachFeedback[Object.keys(CoachFeedback)[index + 1]]} readOnly={true} />
                                            </Grid.Column>
                                        )}
                                    </Grid.Row>
                                );
                            }
                            return null;
                        })}
                    </Grid>
                    <Divider section/>

                    <Header as="h3">{showAverage && "Average "} Ratings from Team Members</Header>
                    {/*NOTE: This can probably be deleted since we have the ability to just view the full submissions on SubmissionView model*/}

                    {/*NOTE: AVERAGE RATINGS VIEW*/}
                    {showAverage && (
                        <div>
                            <ResultTable
                                OthersFeedbackAvg={OthersFeedbackAvg}
                                maxRating={maxRating}
                                OthersFeedback = {OthersFeedback}
                            />
                            <Divider section/>

                            {/*NOTE: Since Feedback isnt in the average, do we display it here?*/}
                            {/*Or just say they view in full submission viewer and have the AI generation be the "average"*/}
                            {/*<Header as="h3">Feedback from Team Members</Header>*/}
                            {/*<List>*/}
                            {/*    {OthersFeedback.map((otherStudent, otherIndex) => (*/}
                            {/*        <ListItem key={otherIndex}>*/}
                            {/*            <Label ribbon size={'large'} color={'grey'}>{otherStudent.From}</Label>*/}
                            {/*            <List relaxed>*/}
                            {/*                {Object.keys(otherStudent.Feedback).map((category, index) => (*/}
                            {/*                    <ListItem key={index}>*/}
                            {/*                        <Label size={"medium"}>{category}</Label>*/}
                            {/*                        <TextArea disabled>{otherStudent.Feedback[category]}</TextArea>*/}
                            {/*                    </ListItem>*/}
                            {/*                ))}*/}
                            {/*            </List>*/}
                            {/*            <br/>*/}
                            {/*        </ListItem>*/}
                            {/*    ))}*/}
                            {/*</List>*/}
                        </div>
                    )}

                    <Divider section/>
                    <FormField>
                        <Header as={'h3'}>Coach Feedback</Header>
                        <textarea rows={4}/>
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
