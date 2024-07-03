import React, {useContext, useEffect, useRef, useState} from 'react';
import {SecureFetch} from "../functions/secureFetch";
import {config, USERTYPES} from "../functions/constants";
import {Card, Divider, Message, Rating, Table, TextArea} from "semantic-ui-react";

export default function EvalReview (props){
    const [isSubmissions, setSubmissions] = useState(false);
    const [userFeedback, setUserFeedback] = useState([]);
    const coachFeedback = props.forms;
    const userName = `${props.user.fname} ${props.user.lname}`

    useEffect(()=>{
        console.log(coachFeedback);
        sortFeedback();
    },[]);

    const sortFeedback =() => {
       let list = [];
       coachFeedback.forEach((feedback)=> {
           list.push(
               Object.fromEntries(
                   Object.entries(feedback.Students)
                       .filter(([student, _]) => props.user.role === USERTYPES.COACH || userName === student))
           );
       })
        console.log("filtered", list);
        setUserFeedback(list);
        userFeedback.map(() => {});
    }

    const generateFeedbackCards = (student,index) => {
        console.log("STUEDNT INFO", student, index)

        return (
            <div>
                {
                    Object.entries(student).map(([student_name, data]) => {
                            console.log(student_name, data)
                            return <Card fluid>
                                <Card.Content>
                                    <Card.Header > {student_name}'s Feedback Summary #{index + 1}</Card.Header>
                                </Card.Content>
                                <Card.Content>
                                    <Table striped bordered >
                                    <Table.Header>
                                        <Table.HeaderCell>Category</Table.HeaderCell>
                                        <Table.HeaderCell>Rating</Table.HeaderCell>
                                    </Table.Header>
                                        <Table.Body>
                                            {Object.entries(data.AverageRatings).map(([category, rating]) => (
                                                <Table.Row key={category}>
                                                    <Table.Cell>{category}</Table.Cell>
                                                    <Table.Cell><Rating defaultRating={rating} disabled maxRating={5}/> ({rating})
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}

                                        </Table.Body>
                                    </Table>
                                    <Message fluid color={'grey'}>
                                        <Message.Header content={"Coach Feedback"}/>
                                        <Divider />
                                        <Message.Content content={data.Feedback}/>
                                    </Message>
                                </Card.Content>
                            </Card>;
                        }
                    )
                }
            </div>
        );
    }

    return (
        <>
            {props.isSub ? (
                <>
                {userFeedback.map((feedback,index)=> generateFeedbackCards(feedback,index))}
                </>
                    ) : (
                <h2>No Feedback Available</h2>
            )}
        </>
    )
}