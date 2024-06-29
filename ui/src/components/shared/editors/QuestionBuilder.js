import React, {useEffect, useRef, useState} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
    Button, Checkbox, Divider, Dropdown, Form, Grid, Header,
    Icon, List,
    Modal, Popup,
    Rating, Segment,
} from 'semantic-ui-react';
import {
    QuestionFeedback,
    QuestionMoodRating,
    QuestionPeerFeedback,
    QuestionTable
} from "../../util/components/PeerEvalComponents"
import HTMLEditor from "../../util/components/HTMLEditor";

const mockStudents = ["Student 1", "Student 2", "Student 3"];

const QuestionSettings = {
    QuestionFeedback: "Feedback",
    QuestionPeerFeedback: "Peer Feedback",
    QuestionTable: "Table Ratings",
    QuestionMoodRating: "Mood Rating",
}

const QuestionBuilder = (props) => {
    const field = props.field;
    const [formHtml, setFormHtml] = useState(props.value);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [globalSettings, setGlobalSettings] = useState({
        ratingScale: 5,
        defaultRequired: true,
        attachFeedback: false, // Either attaches feedback inline or in a separate section
        selfRating: false,
    });
    const [isEditingTitle, setIsEditingTitle] = useState({});
    const addButtonRef = useRef(null);

    useEffect(() => {
        if (props.value) {
            setFormHtml(props.value);
        } else {
            fetch("/MasterPeerEval.txt")
                .then(response => response.text())
                .then(data => {
                    setFormHtml(data)
                    props.onChange({target: {name: field.name, value: data}}, {name: field.name, value: data});
                })
                .catch(error => console.error("Error fetching MasterPeerEval.txt", error));
        }
    }, []);


    function handleChange(event) {
        setFormHtml(event)
        props.onChange({target: {name: field.name, value: event}}, {name: field.name, value: event});
    }

    const addQuestion = () => {
        setTimeout(() => {
            addButtonRef.current?.scrollIntoView({behavior: 'smooth'});
        }, 0);

        const newQuestion = {
            text: '',
            title: 'Question Title',
            type: "QuestionFeedback",
            isRequired: globalSettings.defaultRequired,
            isForStudents: false,
            isSelfRating: false,
            ratingScale: globalSettings.ratingScale,
            hasFeedback: false,
            feedbackPrompt: '',
            questions: ["Question 1"],
            levels: ['Extremely Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Extremely Satisfied'],
        };
        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const updateQuestion = (index, field, value) => {
        const updatedQuestions = questions.map((question, i) => {
            if (i === index) {
                return {...question, [field]: value};
            }
            return question;
        });
        setQuestions(updatedQuestions);
    };

    const updateGlobalSetting = (field, value) => {
        setGlobalSettings({...globalSettings, [field]: value});
    };

    const setQuestionEditing = (index, value) => {
        setIsEditingTitle({...isEditingTitle, [index]: value});
    }
    const copyHtmlToClipboard = () => {
        let html = "";
        questions.map((question, index) => {
            html += '<div>\n'
            if (question.addHeader) {
                html += `<h2>${question.title}</h2>\n`;
            }
            if (question.type === 'QuestionFeedback') {
                html += `<QuestionFeedback title="${question.title}" questions='${JSON.stringify(question.questions)}' ordered='${question.ordered}' required='${question.isRequired}' includeStudents='${question.isForStudents}' selfFeedback='${globalSettings.selfRating}' />`
            } else if (question.type === 'QuestionPeerFeedback') {
                html += `<QuestionPeerFeedback title="${question.title}" questions='${JSON.stringify(question.questions)}' required='${question.isRequired}' selfFeedback='${globalSettings.selfRating}' />`
            } else if (question.type === 'QuestionTable') {
                html += `<QuestionTable questions='${JSON.stringify(question.questions)}' scale='${globalSettings.ratingScale}' required='${question.isRequired}' icon='${question.icon}' selfFeedback='${globalSettings.selfRating}' />`
            } else if (question.type === 'QuestionMoodRating') {
                const levels = globalSettings.ratingScale === 3
                    ? question.levels.slice(1, 4)
                    : [...question.levels]
                question.questions.map((question_title, _) => {
                    html += `<QuestionMoodRating question="${question_title}" levels='${JSON.stringify(levels)}' required='${question.isRequired}' selfFeedback='${globalSettings.selfRating}' />`
                })
            }
            html += '\n</div>\n<br/>\n'
        })

        navigator.clipboard.writeText(html).then(() => {
            alert('HTML copied to clipboard');
        }, (err) => {
            alert('Failed to copy HTML to clipboard');
        })

        return html
    };


    const renderQuestionForm = (question, index) => {
        const settingsFields = [];
        const needsOrdered = ['QuestionFeedback', 'QuestionPeerFeedback'];
        const needsHeader = ['QuestionTable', 'QuestionMoodRating'];

        if (needsOrdered.includes(question.type)) {
            if (!question.ordered) question.ordered = false;
            settingsFields.push(
                <Form.Field key={'ordered' + index}>

                    <Popup content={'This will order the questions with numbers.'} trigger={
                        <Checkbox
                            label="Ordered"
                            checked={question.ordered}
                            onChange={(e, data) => updateQuestion(index, 'ordered', data.checked)}
                        />
                    }/>
                </Form.Field>
            );
        }

        if (needsHeader.includes(question.type)) {
            if (!question.addHeader) question.addHeader = false;
            settingsFields.push(
                <Form.Field key={'add-header' + index}>
                    <Popup
                        content={'This will add a Header element on top of the question with the Question Title as its value'}
                        trigger={
                            <Checkbox
                                label="Add Header"
                                checked={question.addHeader}
                                onChange={(e, data) => updateQuestion(index, 'addHeader', data.checked)}
                            />
                        }/>
                </Form.Field>
            );
        }

        if (question.type === 'QuestionTable') {
            if (!question.icon) question.icon = 'default';
            settingsFields.push(
                <Form.Field key={'icon' + index}>
                    {'Icon '}
                    <Rating clearable icon={question.icon === 'default' ? false : question.icon} defaultRating={2}
                            maxRating={globalSettings.ratingScale}/>
                    <Dropdown
                        selection
                        options={[
                            {key: 'default' + index, text: 'Default', value: 'default'},
                            {key: 'heart' + index, text: 'Heart', value: 'heart'},
                            {key: 'star' + index, text: 'Star', value: 'star'},
                        ]}
                        value={question.icon}
                        onChange={(e, data) => updateQuestion(index, 'icon', data.value)}
                    />
                </Form.Field>
            );
        }

        if (question.type === 'QuestionFeedback') {
            settingsFields.push(
                <Form.Field key={'include-students' + index}>
                    <Popup content={'This will make the student have to answer each question for each peer'} trigger={
                        <Checkbox
                            label="Include Students"
                            checked={question.isForStudents}
                            onChange={(e, data) => updateQuestion(index, 'isForStudents', data.checked)}/>
                    }/>
                </Form.Field>
            );
        }

        return (<Segment key={index}>
            <Form>

                {/*Question Title Editor*/}
                {
                    !isEditingTitle[index] ? <Header as="h3" onClick={() => setQuestionEditing(index, true)}>
                            {question.title || `Question ${index + 1} Title`}
                        </Header> :
                        <>
                            <Form.Group inline>
                                <Form.Input
                                    value={question.title}
                                    placeholder={`Question ${index + 1} Title`}
                                    onChange={(e) => updateQuestion(index, 'title', e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            setQuestionEditing(index, false);
                                        }
                                    }}
                                    icon={<Icon link
                                                color={'blue'}
                                                name={'save'}
                                                onClick={() => setQuestionEditing(index, false)}/>}
                                />
                            </Form.Group>
                        </>
                }

                {/*Question Type*/}
                <Form.Field>
                    <label>Question Type</label>
                    <Dropdown
                        selection
                        options={Object.keys(QuestionSettings).map((key) => {
                            return {
                                key: key + index,
                                text: QuestionSettings[key],
                                value: key
                            }
                        })}
                        value={question.type}
                        onChange={(e, data) => updateQuestion(index, 'type', data.value)}
                    />
                </Form.Field>

                {/*Settings*/}
                <Form.Field label={'Settings'}/>
                <Form.Group widths="equal">
                    <Form.Field>
                        <Checkbox
                            label="Required"
                            checked={question.isRequired}
                            onChange={(e, data) => updateQuestion(index, 'isRequired', data.checked)}
                        />
                    </Form.Field>
                    {
                        settingsFields.map((field) => field)
                    }
                </Form.Group>

                {/*Change Mood Rating Level*/}
                <Divider/>
                {question.type === 'QuestionMoodRating' && (
                    <Form.Field key={'levels' + index}>
                        <Popup content={"The amount is based from the global settings rating scale."}
                               trigger={<label>Rating Levels ({globalSettings.ratingScale})</label>}/>
                        <List horizontal>
                            {question.levels.map((level, i) => {
                                if (globalSettings.ratingScale === 3 && (i < 1 || i > 3)) return null;
                                return (
                                    <List.Item key={`${index}-levels-list-${i}`}>
                                        <Form.Input
                                            key={i + " " + index}
                                            value={level}
                                            onChange={(e) => {
                                                const updatedLevels = question.levels.map((l, j) => {
                                                    if (i === j) return e.target.value;
                                                    return l;
                                                });
                                                updateQuestion(index, 'levels', updatedLevels);
                                            }}
                                            style={{width: 'auto'}}
                                        />
                                    </List.Item>
                                );
                            })}
                        </List>
                    </Form.Field>
                )}

                {/*Add Questions*/}
                <Divider/>
                <Form.Field>
                    <label>Questions
                        <Button size='small' floated={'right'} circular
                                icon={<Icon color='black' name={'plus'} fitted/>}
                                compact
                                onClick={() => {
                                    const updatedQuestions = [...question.questions, 'Question'];
                                    updateQuestion(index, 'questions', updatedQuestions);
                                }}
                        />
                        <Button size='small' floated={'right'} circular
                                icon={<Icon color='black' name={'minus'} fitted/>}
                                compact
                                onClick={() => {
                                    const updatedQuestions = question.questions.slice(0, -1);
                                    updateQuestion(index, 'questions', updatedQuestions);
                                }}
                        />
                    </label>
                    {question.questions.map((question_title, i) => (
                        <Form.Input
                            key={i + " " + index}
                            value={question_title}
                            onChange={(e) => {
                                const updatedQuestions = question.questions.map((q, j) => {
                                    if (i === j) return e.target.value;
                                    return q;
                                });
                                updateQuestion(index, 'questions', updatedQuestions);
                            }}
                        />
                    ))}
                </Form.Field>

                {/*Remove Question*/}
                <Divider/>
                <Button
                    negative
                    icon={'trash alternate'}
                    content={'Remove Question'}
                    onClick={() => removeQuestion(index)}
                />
            </Form>
        </Segment>)
    };

    const renderPreviewForm = () => (
        <Form>
            {questions.map((question, index) => {
                const students = [...mockStudents];
                if (globalSettings.selfRating) students.push("Student (SELF)");
                return (<div key={question.title + index}>
                        {question.addHeader && <Header as="h2" dividing>{question.title}</Header>}
                        {question.type === 'QuestionFeedback' &&
                            <QuestionFeedback
                                title={question.title}
                                questions={question.questions}
                                ordered={question.ordered}
                                required={question.isRequired}
                                includeStudents={question.isForStudents}
                                selfFeedback={globalSettings.selfRating}
                                students={question.isForStudents ? students : [""]}
                            />}
                        {question.type === 'QuestionPeerFeedback' &&
                            <QuestionPeerFeedback
                                title={question.title}
                                questions={question.questions}
                                required={question.isRequired}
                                selfFeedback={globalSettings.selfRating}
                                students={students}
                            />}
                        {question.type === 'QuestionTable' &&
                            <QuestionTable
                                questions={question.questions}
                                scale={globalSettings.ratingScale}
                                required={question.isRequired}
                                icon={question.icon}
                                selfFeedback={globalSettings.selfRating}
                                students={students}
                            />}
                        {question.type === 'QuestionMoodRating' &&
                            question.questions.map((question_title, i) => (
                                <QuestionMoodRating
                                    key={question_title + i}
                                    question={question_title}
                                    levels={globalSettings.ratingScale === 3
                                        ? question.levels.slice(1, 4)
                                        : [...question.levels]}
                                    required={question.isRequired}
                                    selfFeedback={globalSettings.selfRating}
                                    students={students}
                                />
                            ))
                        }
                    </div>
                )
            })
            }
        </Form>
    );

    return (
        <div>
            {/*Form Builder Modal*/}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <Modal.Header>Question Form Builder</Modal.Header>
                <Modal.Content>
                    <Grid columns={2} divided>
                        <Grid.Row>
                            {/*Global Settings*/}
                            <Grid.Column width={4}>
                                <Header as="h3" icon={'setting'}>
                                    <Icon color='black' name={'setting'}/>
                                    <Header.Content>Global Settings</Header.Content>
                                </Header>
                                <Form>
                                    <Form.Field>
                                        <label>
                                            <Popup
                                                content="The scales of different question types must be consistent."
                                                trigger={<Icon name='question circle outline'/>}/>
                                            Rating Scale
                                        </label>
                                        <Form.Group inline>
                                            <Form.Radio value={3} label={'3'}
                                                        checked={globalSettings.ratingScale === 3}
                                                        onChange={(e, data) => updateGlobalSetting('ratingScale', data.value)}/>
                                            <Form.Radio value={5} label={'5'}
                                                        checked={globalSettings.ratingScale === 5}
                                                        onChange={(e, data) => updateGlobalSetting('ratingScale', data.value)}/>
                                        </Form.Group>
                                    </Form.Field>
                                    <Divider/>
                                    <Form.Field>
                                        <label>
                                            <Popup
                                                content="If enabled, feedback will be attached to the question."
                                                trigger={<Icon name='question circle outline'/>}/>
                                            Attach Feedback Inline
                                        </label>
                                        <Form.Checkbox
                                            checked={globalSettings.attachFeedback}
                                            onChange={(e, data) => updateGlobalSetting('attachFeedback', data.checked)}
                                        />
                                    </Form.Field>
                                    <Divider/>
                                    <Form.Field>
                                        <label>
                                            <Popup
                                                content="If enabled, questions will be required by default on creation."
                                                trigger={<Icon name='question circle outline'/>}/>
                                            Required by Default
                                        </label>
                                        <Form.Checkbox
                                            checked={globalSettings.defaultRequired}
                                            onChange={(e, data) => updateGlobalSetting('defaultRequired', data.checked)}
                                        />
                                    </Form.Field>
                                    <Divider/>
                                    <Form.Field>
                                        <label>
                                            <Popup
                                                content="If enabled, students will be asked to rate themselves along with their peers."
                                                trigger={<Icon name='question circle outline'/>}/>
                                            Self-Rating
                                        </label>
                                        <Form.Checkbox
                                            checked={globalSettings.selfRating}
                                            onChange={(e, data) => updateGlobalSetting('selfRating', data.checked)}
                                        />
                                    </Form.Field>
                                </Form>
                            </Grid.Column>

                            {/*Question Form*/}
                            <Grid.Column width={12} style={{overflowY: 'auto', maxHeight: '500px'}}>
                                {questions.map(renderQuestionForm)}

                                <div ref={addButtonRef}>
                                    <Button icon={'add'} content={'Add Question'} floated={'right'} positive
                                            onClick={addQuestion}/>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button icon={'eye'} color='black' content={'Preview Form'}
                            onClick={() => setIsPreviewModalOpen(true)}/>
                    <Button color={'blue'} onClick={copyHtmlToClipboard}>Copy HTML to Clipboard</Button>
                </Modal.Actions>
            </Modal>

            {/* Preview Modal */}
            <Modal
                open={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <Modal.Header>Form Preview</Modal.Header>
                <Modal.Content scrolling>
                    {renderPreviewForm()}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setIsPreviewModalOpen(false)}>Close Preview</Button>
                </Modal.Actions>
            </Modal>

            <Form.Field>
                <Grid>
                    <Grid.Row>
                        {/*<Button onClick={() => setIsModalOpen(true)}>Open Form Builder</Button>*/}
                        <Grid.Column width={8}>
                            <Header as="h5">Page html</Header>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Button disabled={false} onClick={() => setIsModalOpen(true)} floated={"right"}>
                                Open Question Builder
                            </Button>
                        </Grid.Column>

                    </Grid.Row>

                    <Grid.Row style={{marginTop: "-35px"}}>
                        <Grid.Column>
                            <HTMLEditor field={field} formData={props.data} handleChange={handleChange}/>
                        </Grid.Column>
                    </Grid.Row>

                </Grid>
            </Form.Field>
        </div>
    );
};

export default QuestionBuilder;