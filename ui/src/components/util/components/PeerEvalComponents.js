import { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
  Form,
  Grid, GridColumn, GridRow,
  Header, Radio,
  Rating,
  Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow,
  TextArea
} from 'semantic-ui-react';

// TODO: Change props to a single props table
// TODO: Add propogation of onChange handler
// TODO: Make fields required unles specified otherwise in props
export const QuestionFeedback = ({ title, questions, ordered }) => {
    const [feedback, setFeedback] = useState({});

    const handleFeedbackChange = (question, newFeedback) => {
        setFeedback(prevFeedback => ({
            ...prevFeedback,
            [question]: newFeedback
        }));
    };

    if (title == null) title = "Feedback"
    if (ordered == null) ordered = false

    return (
        <div>
            {title !== "" ? <><Header textAlign='left' as='h2' content={title} />  <br /></> : null}
            <Form>
                {
                    questions.map((question, index) => (
                        <div key={index} style={{ marginBottom: '30px' }}>
                            <Header textAlign='left' as='h4' content={ordered ? `${index + 1}. ${question}` : question} />
                            <TextArea
                                placeholder='Talk about your experience'
                                value={feedback[question] || ''}
                                onChange={(e) => handleFeedbackChange(question, e.target.value)}
                            />
                        </div>
                    ))
                }
            </Form>
        </div>
    );
};

// TODO: Change props to a single props table
// TODO: Add propogation of onChange handler
// TODO: Make fields required unles specified otherwise in props
export const QuestionTable = ({ questions, students }) => {
    const questionRatings = {};
    questions.forEach(question => questionRatings[question] = {})
    const [selections, setSelections] = useState(questionRatings);

    const handleRate = (student, question, rating) => {
        setSelections(prevSelections => ({
            ...prevSelections,
            [question]: {
                ...prevSelections[question],
                [student]: rating
            }
        }));
    };

    return (
        <Table basic='very' celled collapsing unstackable >
            <TableHeader>
                <TableRow>
                    <TableHeaderCell />
                    {questions.map(question => (
                        <TableHeaderCell style={{ width: '100px', wordWrap: 'break-word', textAlign: 'center', verticalAlign: 'bottom' }} key={question}>
                            <Header as='h4'> {question} </Header>
                        </TableHeaderCell>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    students.map(student => (
                        <TableRow key={student}>
                            <TableCell>
                                <Header as='h4'> {student} </Header>
                                {/* <Label size='large' basic>{student}</Label> */}
                            </TableCell>
                            {
                                questions.map(question => (
                                    <TableCell key={question}>
                                        <Rating
                                            maxRating={5}
                                            defaultRating={selections[question][student] || 0}
                                            clearable
                                            // icon='star'
                                            onRate={(_, data) => handleRate(student, question, data.rating)}
                                        />
                                    </TableCell>
                                ))
                            }
                        </TableRow>

                    ))
                }

            </TableBody>
        </Table>
    );
};

// TODO: Change props to a single props table
// TODO: Add propogation of onChange handler
// TODO: Make fields required unles specified otherwise in props
export const QuestionMoodRating = ({ question, student_names, satisfactionLevels }) => {
    if (!satisfactionLevels) {
        satisfactionLevels = ['Extremely Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Extremely Satisfied'];
    }

    const [selections, setSelections] = useState({});

    const handleSelection = (student, rating) => {
        setSelections({
            ...selections,
            [student]: rating
        });
    };

    return (
        <div>
            <Header as='h2' content={question} textAlign='left' />
            <br />
            <Grid divided='vertically'>
                {student_names.map(name => (
                    <GridRow columns={satisfactionLevels.length + 1}>
                        <GridColumn style={{ textAlign: 'left' }}><Header as='h3' content={name} /></GridColumn>
                        {
                            satisfactionLevels.map((level, index) => (
                                <GridColumn style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                                    <Radio style={{ margin: '8px auto' }} value={index} checked={selections[name] === index} onChange={() => handleSelection(name, index)} />
                                    {level}
                                </GridColumn>
                            ))
                        }
                    </GridRow>
                ))}
            </Grid>
        </div>
    );
};
