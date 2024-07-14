import React, {useContext, useEffect, useState, useRef} from 'react';
import {
    Button, Dimmer, Loader, Divider, Form, FormField, Grid, Header, Label, List, ListItem, Rating, FormInput,
    Confirm, Checkbox, Radio, Popup, Icon
} from "semantic-ui-react";
import {SecureFetch} from "../functions/secureFetch";
import {config, USERTYPES} from "../functions/constants";
import ResultTable from "./ResultTable";
import {UserContext} from "../functions/UserContext";



export default function CoachFeedback(props) {
    const {user} = useContext(UserContext);
    const [studentList, setStudentList] = useState([]);
    const [submissionList, setSubmissionList] = useState([]);
    const [studentData, setStudentData] = useState([]);
    const [allSubmissionsMade, setAllSubmissionsMade] = useState(false);
    const [missingStudents, setMissingStudents] = useState([]);
    const [studentListFetched, setStudentListFetched] = useState(false);
    const [submissionsFetched, setSubmissionsFetched] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [confirmedStates, setConfirmedStates] = useState(false);
    const [loadingStates, setLoadingStates] = useState(false);
    const [coachSummaryText, setCoachSummaryText] = useState({});
    const [usedAI,setUsedAI] = useState([]);
    const getFullName = (student) => `${student.fname} ${student.lname}`

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
                // console.warn('formatedLogs', formatedLogs)
                setSubmissionList(actionLogs);
                setStudentData(formatedLogs);
                setSubmissionsFetched(true);
            })
            .catch((err) => {
                console.error("Failed to get submissions", err);
                setSubmissionsFetched(true);
            });
    };

    // Function to fetch student list based on project ID and set studentList state
    const fetchStudentList = () => {
        SecureFetch(`${config.url.API_GET_PROJECT_STUDENT_NAMES}?project_id=${props.team}`)
            .then(response => response.json())
            .then((data) => {
                const combinedNames = data.map(student => `${student.fname} ${student.lname}`);
                setStudentList(combinedNames);
                setStudentListFetched(true);
            })
            .catch((err) => {
                setStudentList(["Student 1", "Student 2", "Student 3", "Student 4"]);
                setStudentListFetched(true);
                console.error("Failed to get students", err);
            });
    };

    const checkAllSubmissionsMade = () => {
        const submittedStudents = studentData.map(log => log.Submitter);
        const missing = studentList.filter(student => !submittedStudents.includes(student));
        setMissingStudents(missing);
        setAllSubmissionsMade(missing.length === 0);
    };

    const handleFeedbackChange=(studentName,currFeedback)=>{
        setFeedback(prevFeedback => ({
            ...prevFeedback,
            [studentName]: currFeedback
        }));
    }
    const OpenPopup=(s)=>{
        setConfirmedStates(prev =>({
            ...prev,
            [s]:true
        }))
    }

    const ClosePopup=(s)=>{
        setConfirmedStates(prev =>({
            ...prev,
            [s]:false
        }))
    }

    const getSummarization = (id, context) => {
        const body = new FormData()
        body.append('context', JSON.stringify(context))

        updateLoadingState(id, true)

        SecureFetch(`${config.url.API_GENERATE_SUMMARY}`,{
            method: "post",
            body: body
        })
            .then(response => response.text())
            .then((data)=>{
                console.log("COMPLETED", data)
                updateCoachSummaryText(id, data);
            })
            .catch(error => {console.log(error);
                console.error("OOPSIES", error)
            })
            .finally(()=> {
                updateLoadingState(id, false)
            })
    }

    const updateLoadingState = (id, value) => {
        setLoadingStates(prevState => ({
            ...prevState,
            [id]:value
        }));
    }

    const updateCoachSummaryText = (id, newText) => {
        if (newText === "") {
            setUsedAI(prevState => ({
                ...prevState,
                [id]:false
            }))
        }
        setCoachSummaryText(prevState => ({
            ...prevState,
            [id]:newText
        }))
    }

     const handleGenerateSummarization = (s, context) => {
        ClosePopup(s);
        getSummarization(s, context);
        setUsedAI((prev)=>({
            ...prev,
                [s]:true
        }));
    };

    useEffect(() => {
        fetchStudentList();
        fetchSubmissions();
    }, [props.team]);

    useEffect(() => {
        if (studentListFetched && submissionsFetched) {
            checkAllSubmissionsMade();
        }
    }, [studentListFetched, submissionsFetched]);

    // Function to generate feedback form for a student
    const generateFeedbackForm = (student, index) => {
        // TODO: Implement max rating based on the form
        // console.warn("CURRENT STUDENT", student, studentData)
        const maxRating = 5
        const showAverage = true;

         console.log(student)
        // console.log("Students", studentList);
        // console.log("Submissions", submissionList);
        // console.log("Student Data", studentData);

        // NOTE: You can use the formdata.Submitter to differentiate Coach and Student as well somehow on submission
        // e.g. could just set it to "Coach" since we don't actually care about whom the coach is
        const studentSubmission = studentData.find(formData => formData.Submitter === student)
        if (!studentSubmission) return null;

        // NOTE: Get other student ratings separate from self ratings for average
        const otherStudentRatings = studentData
            .filter(formData => formData.Submitter !== student && formData.Submitter !== "COACH" && formData.Students[student])
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

        const AIContext = {
            Student: student,
            Ratings: OthersFeedback.map((feedback) => {
                return {
                    From: feedback.From,
                    Feedback: feedback.Feedback,
                }
            }),
        };

        // console.log("OthersFeedbackAvg", OthersFeedbackAvg);
        // console.log("OthersFeedback", OthersFeedback);
        // console.log("CoachFeedback", CoachFeedback);
        console.log("SelfFeedback", SelfFeedback);
        return (
            <div key={index}>
                        <Divider section/>
                    <Header size={"huge"} block inverted>{student}</Header>

                <div><Header as="h3">Coach Feedback <Popup icon={"eye"} content="Visible to  Evaluated Student " trigger={<Icon name={"eye"}></Icon>}/></Header>
                    <Grid>
                        {Object.keys(CoachFeedback).map((category, index) => {
                            if (index % 2 === 0) {
                                return (
                                    <Grid.Row columns={2} key={index}>
                                        <Grid.Column>
                                            <Label as='h2'>{Object.keys(CoachFeedback)[index]}</Label>
                                            <textarea rows={4}
                                                      value={CoachFeedback[Object.keys(CoachFeedback)[index]] || "No Feedback Given"}
                                                      readOnly={true}/>
                                        </Grid.Column>
                                        {Object.keys(CoachFeedback)[index + 1] && (
                                            <Grid.Column>
                                                <Label as='h2'>{Object.keys(CoachFeedback)[index + 1]}</Label>
                                                <textarea rows={4}
                                                          value={CoachFeedback[Object.keys(CoachFeedback)[index + 1]] || "No Feedback Given"}
                                                          readOnly={true}/>
                                            </Grid.Column>
                                        )}
                                    </Grid.Row>
                                );
                            }
                            return null;
                        })}
                    </Grid>
                    <Divider section/>
                    </div>
                        <Header as="h3">{showAverage && "Average "} Ratings from Team Members <Popup icon={"eye"} content="Visible to  Evaluated Student " trigger={<Icon name={"eye"}></Icon>}/></Header>

                        {/*NOTE: AVERAGE RATINGS VIEW*/}
                        {showAverage && (
                            <div>
                                <ResultTable
                                    OthersFeedbackAvg={OthersFeedbackAvg}
                                    maxRating={maxRating}
                                    SelfFeedback={SelfFeedback}
                                    OthersFeedback={OthersFeedback}
                                    student={student}
                                />
                                <Divider section/>


                            </div>
                        )}
                        <Divider section/>
                        <FormField>
                            <Header as={'h3'}>Coach Summarization + Feedback <Popup icon={"eye"} content={"Visible to  Evaluated Student"}/> </Header>
                    <Dimmer.Dimmable dimmed={loadingStates[student]}>
                        <Dimmer active={loadingStates[student]} inverted>
                            <Loader active={loadingStates[student]}  content="Generating Summerization from AI"/>
                        </Dimmer>
                            <textarea  placeholder={`Enter your feedback to ${student} here based from the other students' feedback or click Generate AI Summary`} name={"CoachFeedback-Final-" + student} key={"coach-feedback" + index} rows={4} value={coachSummaryText[student]} onChange={(e) => updateCoachSummaryText(student, e.target.value)}/>

                        <Button attached='bottom' onClick={(event) => {OpenPopup(student)}} content='Generate AI Summarization'/>
                            <Confirm
                                style={{
                                    position: "fixed",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                                content={"Are you sure? \n(This will override the current textbox, and will let the student know Ai was used for Summarization) "}
                                open={confirmedStates[student]}
                                onCancel={() => ClosePopup(student)}
                                onConfirm={() => handleGenerateSummarization(student, AIContext)}/>

                        <Radio name={`UsedAI--${student}`} style={{visibility: "hidden"}} checked={usedAI[student]} value={usedAI[student]?1:0}/>
                    </Dimmer.Dimmable>
                        </FormField>

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
            {allSubmissionsMade ? (
                <></>
            ) : (
                <>
                    <Header as="h3" color="red">Not all students have submitted their feedback.</Header>
                    <Header as="h4">The following students are yet to submit their feedback:</Header>
                    <List>
                        {missingStudents.map((student, index) => (
                            <ListItem key={index}>
                                {student}
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            <Form>
            {studentList
                // .filter(student => user.role === USERTYPES.COACH || getFullName(user) === student )
                .map((student, index) => generateFeedbackForm(student, index))}
            </Form>
        </>
    );
}
