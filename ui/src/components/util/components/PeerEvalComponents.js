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

const sentenceToCamelCase = (string = "") =>
    string.replaceAll(
        /(\w+).?/g,
        word => word.charAt(0).toUpperCase() + word.slice(1).trim()
    )

// TODO: Add propagation of onChange handler
// TODO: Make fields required unless specified otherwise in props
export function QuestionFeedback({
                                     title = "Feedback",
                                     questions = [""],
                                     ordered = false,
                                     students = [""],
                                     required = false,
                                 }) {
    const [feedback, setFeedback] = useState({});
    const hasStudents = students.length > 1 || students[0] !== "";
    const hasQuestions = questions.length > 1 || questions[0] !== "";
    const hasTitle = title !== "";

    const handleFeedbackChange = (question, student, newFeedback) => {
        setFeedback(prevFeedback => ({
            ...prevFeedback,
            [question]: {
                ...prevFeedback[question],
                [student]: newFeedback
            }
        }));
    }

    return (
        <div>
            {hasTitle && <Header textAlign='left' as='h2' content={title} dividing style={{marginBottom: '30px'}}/>}
            {
                questions.map((question, index) => (
                    <div key={index} style={{marginBottom: '30px'}}>
                        {
                            required &&
                            <Header content="*" color={'red'} floated='left'/>
                        }
                        {
                            hasQuestions &&
                            <Header
                                textAlign='left'
                                as='h3'
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
                                        name={`Feedback-${sentenceToCamelCase(question)}-${hasStudents ? student : "Anon"}`}
                                        placeholder={`${student}${hasStudents?" - ":""}${question}`}
                                        value={!!feedback[question] ? feedback[question][student] : ''}
                                        onChange={(e) => handleFeedbackChange(question, student, e.target.value)}
                                        required={required}
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
export function QuestionPeerFeedback({title = "Individual Feedback", questions, students, required}) {
    return (
        <QuestionFeedback title={title} questions={questions} students={students} required={required}/>
    )
}

// TODO: Add propagation of onChange handler
// TODO: Make fields required unless specified otherwise in props
// TODO: Let user switch between 5 and 3 point scale
export function QuestionTable({questions, students, scale = 5, required = false, icon = true}) {
    // TODO: Limit max questions to 5
    const MAX_QUESTIONS = 5;
    assert(questions.length <= MAX_QUESTIONS, `Number of questions exceeds maximum of ${MAX_QUESTIONS}`);

    // TODO: Limit scale to 5 or 3
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
            {
                required &&
                <Header content="*" color={'red'} floated='left'/>
            }
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
                                                defaultRating={selections[question][student] || ""}
                                                clearable
                                                icon={icon}
                                                onRate={(_, data) => handleRate(student, question, data.rating)}
                                            />
                                            <input
                                                type="hidden"
                                                name={`Table-${sentenceToCamelCase(question)}-${student}`}
                                                value={selections[question][student] || 0}
                                                required={required}
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
export function QuestionMoodRating({
                                       question,
                                       students,
                                       levels = ['Extremely Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Extremely Satisfied'],
                                       required = false
                                   }) {
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
            {
                required &&
                <Header content="*" color={'red'} floated='left'/>
            }
            <Header as='h2' content={question} textAlign='left' dividing/>
            <br/>
            <Grid divided='vertically'>
                {students.map(student => (
                    <GridRow key={student} columns={numColumns}>
                        <GridColumn key={`col-${student}`} style={{textAlign: 'left'}}>
                            <Header as='h3' content={student}/>
                        </GridColumn>
                        {
                            levels.map((level, index) => (
                                <GridColumn key={`col-${student}-${index}`}
                                            style={{textAlign: 'center', display: 'flex', flexDirection: 'column'}}>
                                    <Radio style={{margin: '8px auto'}}
                                           name={`Mood-${sentenceToCamelCase(question)}-${student}`}
                                           value={index}
                                           checked={selections[student] === index}
                                           onChange={() => handleSelection(student, index)}
                                           required={required}
                                    />
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

export const QuestionComponentsMap = {
    QuestionFeedback: QuestionFeedback,
    QuestionTable: QuestionTable,
    QuestionMoodRating: QuestionMoodRating,
    QuestionPeerFeedback: QuestionPeerFeedback
}
