import React, {useContext, useEffect, useRef, useState} from 'react';
import {SecureFetch} from "../functions/secureFetch";
import {config, USERTYPES} from "../functions/constants";
import {Card, Divider, Header, Icon, Message, Rating, Table, Label, Popup} from "semantic-ui-react";
import {UserContext} from "../functions/UserContext";
import ToolTip from "../../Tabs/DashboardTab/TimelinesView/Timeline/ToolTip";


export default function EvalReview(props) {
    const [userFeedback, setUserFeedback] = useState([]);
    const [studentExpanded, setStudentExpanded] = useState({});
    const coachFeedback = props.forms;
    const userContext = useContext(UserContext);
    const userName = `${userContext.user.fname} ${userContext.user.lname}`
    const userIsStudent = userContext.user.role === USERTYPES.STUDENT;

    useEffect(() => {
        // console.info("COACH FEEDBACK", coachFeedback);
        sortFeedback();
    }, []);

    const updateExpanded = (student_name, value) => {
        const new_value = !!value ? value : !studentExpanded[student_name];
        setStudentExpanded({...studentExpanded, [student_name]: new_value});
    }

    const sortFeedback = () => {
        let list = [];

        list.push(
            Object.fromEntries(
                Object.entries(coachFeedback.Students)
                    .filter(([student, _]) => !userIsStudent || userName === student))
        );

        // console.log("filtered", list);
        setUserFeedback(list);
    }

    const generateFeedbackCards = (student, index) => {
        // console.log("STUEDNT INFO", student, index)
        console.log(student);
        return (
            <div key={"EvalReview" + props.id}>
                {
                    Object.entries(student).map(([student_name, data]) => {
                            // console.log(student_name, data)
                            // const hasSelfRating = data.SelfRating && Object.keys(data.SelfRating).length > 0;
                            // console.log(student_name, data)
                            return <Card key={props.id + student_name + "Card" + index} fluid>
                                <Card.Content>
                                    <Header size='tiny' onClick={() => {
                                        updateExpanded(student_name)
                                    }}>
                                        {
                                            !userIsStudent &&
                                            <Icon size='tiny'
                                                  name={studentExpanded[student_name] ? 'caret up' : 'caret down'}/>
                                        }
                                        {userIsStudent ? "Your" : `${student_name}'s`} Feedback Summary
                                    </Header>
                                </Card.Content>
                                {
                                    (studentExpanded[student_name] || userIsStudent) && <Card.Content>
                                        <Table striped>
                                            <Table.Header>
                                                <Table.HeaderCell>Category</Table.HeaderCell>
                                                <Table.HeaderCell>Rating</Table.HeaderCell>
                                                {
                                                    hasSelfRating &&
                                                    <Table.HeaderCell>Self Rating</Table.HeaderCell>
                                                }
                                            </Table.Header>
                                            <Table.Body>
                                                {Object.entries(data.AverageRatings).map(([category, rating]) => (
                                                    <Table.Row key={props.id + student_name + category + "Rating"}>
                                                        <Table.Cell>{category}</Table.Cell>
                                                        <Table.Cell>
                                                            <Rating defaultRating={rating} disabled
                                                                    maxRating={5}/> ({Math.round(rating * 100) / 100})
                                                        </Table.Cell>
                                                            <Table.Cell>
                                                            {
                                                                hasSelfRating && data.SelfRating[category] &&
                                                                <>
                                                                    <Rating defaultRating={data.SelfRating[category]} disabled
                                                                            maxRating={5}/>
                                                                    <span>
                                                                        ({Math.round(data.SelfRating[category] * 100) / 100})
                                                                    </span>
                                                                </>
                                                            }
                                                            </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table>
                                        <Message color={'grey'}>
                                            <Message.Header content={"Coach Feedback"}/>
                                            {
                                                data.UsedAI &&
                                                <Popup
                                                    content={
                                                        <Label basic color={'blue'} as={'a'} image >
                                                            <img  src='Gemini_language_model_logo.png' alt='Google Gemini  logo' color='white' style={{marginLeft: "5px"}} />
                                                            <p style={ {margin: "-12px 0 0 79px", fontSize: "medium", color:'#086EFF'}}>  was used for Summarization of your Feedback</p>
                                                        </Label>
                                                    }
                                                    flowing
                                                    trigger={
                                                        <Label corner={'right'} icon={"google"} color={'blue'}/>
                                                    }
                                                />
                                            }
                                            <Divider/>
                                            <Message.Content content={data.Feedback}/>
                                        </Message>



                                    </Card.Content>

                                }
                            </Card>;
                        }
                    )
                }
            </div>
        );
    }

    return (
        <div>
            {
                props.isSub ?
                    userFeedback.map((feedback, index) => generateFeedbackCards(feedback, index)) :
                    <h5>No Submission</h5>
            }
        </div>
    )
}
