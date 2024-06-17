import React from 'react';
import {Header, Form, FormField, Button, Grid, Divider, Label, List, ListItem} from "semantic-ui-react";

export default function CoachFeedBack(props) {

    return (
        <>
            <Header as="h1">Peer Evaluation Summary</Header>
            <Form>
                <div>
                    <Header as="h3">Student Name</Header>
                </div>
                <Divider section />
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>

                                <Label>Public Feedback</Label>
                                <textarea rows={4} disabled />

                        </Grid.Column>
                        <Grid.Column>

                                <Label>Private Feedback</Label>
                                <textarea rows={4} disabled/>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider section />
                    <Header as="h4">Ratings from Team Members</Header>
                    <List>
                        <ListItem>
                            <Label>Student 2 </Label>
                            <div>
                            <label>Communication</label>
                            <input type="text" value="4.5 / 5" disabled/>
                            <label>Participation</label>
                            <input type="text" value="3.5 / 5" disabled/>
                            </div>
                        </ListItem>
                        <ListItem>
                            <Label>Student 3 </Label>
                            <div>
                                <label>Communication</label>
                                <input type="text" value="4.5 / 5" disabled/>
                                <label>Participation</label>
                                <input type="text" value="3.5 / 5" disabled/>
                            </div>
                        </ListItem>
                    </List>
                <FormField>
                    <label>Coach Feedback</label>
                    <textarea rows={4}/>
                    <Button attached='bottom' content='Generate AI Summarization'/>
                </FormField>
            </Form>
        </>
    );
}
