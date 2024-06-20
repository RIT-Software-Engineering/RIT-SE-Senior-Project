import {useState} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
    Grid, GridColumn, GridRow,
    Header, Radio,
    Rating,
    Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow,
    TextArea
} from 'semantic-ui-react';
import assert from "assert";

// TODO: Add propagation of onChange handler
// TODO: Make fields required unless specified otherwise in props
export const QuestionFeedback = ({title = "Feedback", questions=[""], ordered = false, students=[""], anon=false}) => {
    const [feedback, setFeedback] = useState({});
    const hasStudents = students.length > 1 || students[0] !== "";
    const hasQuestions = questions.length > 1 || questions[0] !== "";
    const hasTitle = title !== "";

    const handleFeedbackChange = (question, newFeedback) => {
        setFeedback(prevFeedback => ({
            ...prevFeedback,
            [question]: newFeedback
        }));
    };

    return (
        <div>
            { hasTitle && <Header textAlign='left' as='h2' content={title} dividing style={{marginBottom: '30px'}}/> }
            {
                questions.map((question, index) => (
                    <div key={index} style={{marginBottom: '30px'}}>
                        {
                            hasQuestions &&
                            <Header
                                textAlign='left'
                                as=  'h3'
                                content={ordered ? `${index + 1}. ${question}` : question}
                                dividing={hasStudents}
                                style={{marginBottom: '30px'}}
                            />
                        }
                        {
                            students.map((student, students_index) => (
                                <div key={`${index}:${students_index}`} style={{marginBottom: '30px'}}>
                                    <Header textAlign='left' content={student} as={hasQuestions ? 'h4' : 'h3'}/>
                                    <TextArea
                                        placeholder='Talk about your experience'
                                        value={feedback[question] || ''}
                                        onChange={(e) => handleFeedbackChange(question, e.target.value)}
                                    />
                                    <br/>
                                </div>
                            ))
                        }

                    </div>
                ))
            }
        </div>
    );
};

// TODO: Add version of QuestionFeedback that uses PeerFeedback easier
export const QuestionPeerFeedback = ({title = "Individual Feedback", questions, students}) => {
    return (
        <QuestionFeedback title={title} questions = {questions} students={ students } anon="false"/>
    )
}

// TODO: Add propagation of onChange handler
// TODO: Make fields required unless specified otherwise in props
//TODO: Let user switch between 5 and 3 point scale
export const QuestionTable = ({questions, students, scale=5}) => {
    //TODO: Limit max questions to 5
    const MAX_QUESTIONS = 5;
    assert(questions.length <= MAX_QUESTIONS, `Number of questions exceeds maximum of ${MAX_QUESTIONS}`);

    //TODO: Limit scale to 5 or 3
    assert(scale === 5 || scale === 3, `Scale must be either 5 or 3, but got ${scale}`)

    const questionRatings = {};
    questions.forEach(question => questionRatings[question] = {})
    const [selections, setSelections] = useState(questionRatings);

    const pixelWidth = Math.floor(900 / questions.length);

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
        <div>
            <Table basic='very' celled collapsing unstackable>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell/>
                        {questions.map(question => (
                            <TableHeaderCell style={{
                                width: pixelWidth + "px",
                                wordWrap: 'break-word',
                                textAlign: 'center',
                                verticalAlign: 'bottom'
                            }} key={question}>
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
                                        <TableCell key={question} textAlign='center'>
                                            <Rating
                                                maxRating={scale}
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
        </div>
    );
};

// TODO: Add propagation of onChange handler
// TODO: Make fields required unless specified otherwise in props
export const QuestionMoodRating = ({
                                       question,
                                       students,
                                       levels = ['Extremely Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Extremely Satisfied'],
                                   }) => {

    const [selections, setSelections] = useState({});

    const handleSelection = (student, rating) => {
        setSelections({
            ...selections,
            [student]: rating
        });
    };
    const numColumns = levels.length + 1;

    return (
        <div>
            <Header as='h2' content={question} textAlign='left' dividing/>
            <br/>
            <Grid divided='vertically'>
                {students.map(name => (
                    <GridRow key={name} columns={numColumns}>
                        <GridColumn key={`col-${name}`} style={{textAlign: 'left'}}>
                            <Header as='h3' content={name} />
                        </GridColumn>
                        {
                            levels.map((level, index) => (
                                <GridColumn key={`col-${name}-${index}`}
                                            style={{textAlign: 'center', display: 'flex', flexDirection: 'column'}}>
                                    <Radio style={{margin: '8px auto'}} value={index}
                                           checked={selections[name] === index}
                                           onChange={() => handleSelection(name, index)}/>
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
