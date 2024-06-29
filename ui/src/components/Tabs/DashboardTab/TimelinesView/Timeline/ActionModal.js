import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Form, Icon, Input, Loader, Message, MessageHeader, MessageList, Modal} from "semantic-ui-react";
import {ACTION_TARGETS, config, DEFAULT_UPLOAD_LIMIT, USERTYPES} from "../../../../util/functions/constants";
import {SecureFetch} from "../../../../util/functions/secureFetch";
import {formatDateTime, humanFileSize} from "../../../../util/functions/utils";
import {UserContext} from "../../../../util/functions/UserContext";
import InnerHTML from 'dangerously-set-html-content';
import ParsedInnerHTML from "../../../../util/components/ParsedInnerHtml";
import CoachFeedBack from "../../../../util/components/CoachFeedBack";
import {QuestionComponentsMap} from "../../../../util/components/PeerEvalComponents";

const MODAL_STATUS = {SUCCESS: "success", FAIL: "fail", SUBMITTING: "submitting", CLOSED: false};
const camelCaseToSentence = (string = "") =>
    string.replaceAll(
        /([A-Z])/g,
        word => ` ${word}`
    ).trimStart()

/**
 *This file is only used in ToolTips, it should be removed completely
 */
export default function ActionModal(props) {
    const {user} = useContext(UserContext);
    const [open, setOpen] = React.useState(false);
    const [submissionModalOpen, setSubmissionModalOpen] = useState(MODAL_STATUS.CLOSED);
    const [submissionModalResponse, setSubmissionModalResponse] = useState("We were unable to receive your submission.");
    const [errors, setErrors] = useState([])
    const [errorFields, setErrorFields] = useState(new Set())
    const filesRef = useRef();
    const [studentOptions, setStudentOptions] = useState([]);

    const isPeerEval = props.action_target === ACTION_TARGETS.peer_evaluation;

    const fetchStudentNames = () => {
        if (user.role === USERTYPES.STUDENT) {
            let url = config.url.API_GET_PROJECT_STUDENT_NAMES;
            SecureFetch(`${url}?project_id=${props.projectId}`)
                .then(response => response.json())
                .then((data) => {
                    const combinedNames = data.map(student => `${student.fname} ${student.lname}`);
                    setStudentOptions(combinedNames);
                })
                .catch(err => {
                    console.error("Failed to get students", err);
                });
        } else {
            setStudentOptions(["Student 1", "Student 2", "Student 3", "Student 4"]);
        }
    };

    // TODO: Add way to parse Peer Evaluation Data Cleanly to be used
    function translatePeerEvalData(formData) {
        const translation = {
            CoachFeedback: {},
            Students: {},
            Submitter: user.isMock ? `${user.mockUser.fname} ${user.mockUser.lname}` : `${user.fname} ${user.lname}`
        }

        for (const key in formData) {
            let [category, header, student] = key.split("-")
            let value = formData[key]
            const IS_FEEDBACK = category === "Feedback"

            header = camelCaseToSentence(header)
            value = IS_FEEDBACK ? value.trim() : parseInt(value)

            if (IS_FEEDBACK && student === "Anon") {
                translation.CoachFeedback[header] = value
                continue
            }

            if (!translation.Students[student]) {
                translation.Students[student] = {Feedback: {}, Ratings: {}}
            }

            if (IS_FEEDBACK) {
                translation.Students[student].Feedback[header] = value
            } else {
                translation.Students[student].Ratings[header] = value
            }

        }

        return translation
    }

    const generateModalFields = () => {
        switch (submissionModalOpen) {
            case MODAL_STATUS.SUCCESS:
                return {
                    header: "Success",
                    content: submissionModalResponse,
                    actions: [{header: "Success!", content: "Close", positive: true, key: 0}],
                };
            case MODAL_STATUS.FAIL:
                return {
                    header: "There was an issue...",
                    content: submissionModalResponse,
                    actions: [{header: "There was an issue", content: "Cancel", positive: true, key: 0}],
                };
            case MODAL_STATUS.SUBMITTING:
                return {
                    header: "Submitting...",
                    content: submissionModalResponse,
                    actions: [{header: "Submitting the action", content: "Cancel", positive: true, key: 0}],
                };
            default:
                return;
        }
    };

    const closeSubmissionModal = () => {
        switch (submissionModalOpen) {
            case MODAL_STATUS.SUCCESS:
                setErrors([]);
                setSubmissionModalOpen(MODAL_STATUS.CLOSED);
                break;
            case MODAL_STATUS.FAIL:
                setSubmissionModalOpen(MODAL_STATUS.CLOSED);
                break;
            case MODAL_STATUS.SUBMITTING:
                setErrors([]);
                setSubmissionModalOpen(MODAL_STATUS.CLOSED);
                break;
            default:
                console.error(`MODAL_STATUS of '${submissionModalOpen}' not handled`);
        }
        setOpen(false);
        props.isOpenCallback(false);
    };

    function onActionSubmit(id, file_types) {
        let form = document.forms.item(0);
        if (form !== null && form !== undefined) {

            let body = new FormData();

            body.append("action_template", props.action_id);
            // Note: A user could spoof this and submit actions for other projects...although idk what they could gain from doing that.
            body.append("project", props.projectId);

            let formData = {};
            const formDataInputs = document.forms[0].elements;

            const isRequiredAndEmpty = (input) =>
                formDataInputs[input]?.required & (
                    (!formDataInputs[input]?.value) ||
                    (!formDataInputs[formDataInputs[input].name]?.value) ||
                    (formDataInputs[input]?.name.startsWith("Table") && formDataInputs[input]?.value === "0")
                )


            let errors = [];
            let errorsSet = new Set();
            let errorFields = new Set();

            for (let x = 0; x < formDataInputs.length; x++) {
                if (isPeerEval) {
                    const input = formDataInputs[x], inputName = formDataInputs[x].name,
                        inputType = formDataInputs[x].type

                    formData[inputName] = inputType === "radio" ?
                        formDataInputs[inputName]?.value
                        : String(input?.value);


                    // Error Handling
                    const [questionType, questionName, studentName] = inputName.split("-")
                    const questionSetKey = questionType + questionName
                    const isEmpty = isRequiredAndEmpty(x);
                    const hasDoneError = errorsSet.has(questionSetKey)

                    if (!isEmpty) continue;

                    // Push errors to the actual components
                    switch (questionType) {
                        case "Feedback":
                        case "Mood":
                            errorFields.add(inputName)
                            break;
                        case "Table":
                            errorFields.add(questionName)
                            break;
                    }

                    if (hasDoneError) continue;

                    // Push errors to the error list at bottom of page
                    if (questionType === "Table") {
                        errors.push(`'${camelCaseToSentence(questionName)}' column is required to be filled out.`);
                        errorsSet.add(questionSetKey)
                    } else if (questionType === "Feedback") {
                        if (studentName === "Anon") {
                            errors.push(`'${camelCaseToSentence(questionName)}' feedback is required.`);
                        } else {
                            errors.push(`'${camelCaseToSentence(questionName)}' feedback is required for all students.`);
                            errorsSet.add(questionSetKey)
                        }
                    } else if (questionType === "Mood") {
                        errors.push(`'${camelCaseToSentence(questionName)}' question is required to be answered.`);
                        errorsSet.add(questionSetKey)
                    }

                    continue;
                }
                if (formDataInputs[x].type === "radio") {
                    if (isRequiredAndEmpty(x) && !errorsSet.has(formDataInputs[x].name)) {
                        errors.push(`radio option selection "${formDataInputs[x].name}" is required`);
                        errorsSet.add(formDataInputs[x].name)
                    }
                    formData[formDataInputs[x].name] = formDataInputs[formDataInputs[x].name]?.value;
                } else {
                    if (isRequiredAndEmpty(x)) {
                        errors.push(`'${formDataInputs[x].name}' can not be empty`);
                    }
                    formData[formDataInputs[x].name] = String(formDataInputs[x]?.value);
                }
            }

            const formFiles = filesRef.current?.inputRef?.current?.files || [];

            if (file_types && formFiles.length === 0) {
                errors.push("You must upload files");
            }

            if (errors.length > 0) {
                setErrors(errors);
                setErrorFields(errorFields);
                return;
            }

            // TODO: If the action is a peer evaluation, we need to translate the form data
            if (isPeerEval) {
                formData = translatePeerEvalData(formData);
            }

            body.append("form_data", JSON.stringify(formData));

            for (let i = 0; i < formFiles?.length || 0; i++) {
                body.append("attachments", formFiles[i]);
            }

            setSubmissionModalResponse(
                <div className={"content"}>
                    <Loader className={"workaround"} indeterminate active inverted inline={'centered'}>Uploading
                        Files</Loader>
                </div>
            );
            setSubmissionModalOpen(MODAL_STATUS.SUBMITTING);

            SecureFetch(config.url.API_POST_SUBMIT_ACTION, {
                method: "post",
                body: body,
            })
                .then((response) => {
                    if (response.status === 200) {
                        setSubmissionModalResponse("Your submission has been received.")
                        setSubmissionModalOpen(MODAL_STATUS.SUCCESS);
                        props.isOpenCallback(false);
                    } else {
                        response.text().then((data) => {
                            setSubmissionModalResponse(data || "We were unable to receive your submission.")
                        })
                        setSubmissionModalOpen(MODAL_STATUS.FAIL);
                    }
                    props.reloadTimelineActions();
                })
                .catch((error) => {
                    // TODO: Redirect to failed page or handle errors
                    console.error(error);
                });
        }
    }

    function fileUpload(fileTypes, fileSize) {
        return fileTypes && <Form>
            <Form.Field required>
                <label className="file-submission-required">File Submission (Accepted: {fileTypes.split(",").join(", ")})
                    (Max size of each file: {humanFileSize((fileSize || DEFAULT_UPLOAD_LIMIT), false, 0)})
                </label>
                <Input fluid required ref={filesRef} type="file" accept={fileTypes} multiple/>
            </Form.Field>
        </Form>;
    }

    function onActionCancel() {
        setErrors([]);
    }

    const submitButton = props?.state === "grey" ? ` This action can be submitted on ${formatDateTime(props.start_date)}`
        : <Button
            content={user.isMock ? `Submitting ${user.mockUser.fname} ${user.mockUser.lname} as ${user.fname} ${user.lname}` : "Submit"}
            labelPosition="right"
            icon="checkmark"
            onClick={() => {
                onActionSubmit(props.id, props.file_types);
            }}
            positive
        />

    const renderSubmitButton = () => {
        switch (props.action_target) {
            case ACTION_TARGETS.admin:
                return user.role === USERTYPES.ADMIN ? submitButton : " Admin Actions are Available Only to Admins";
            case ACTION_TARGETS.coach:
                return user.role === USERTYPES.COACH ? submitButton : " Coach Actions are Available Only to Coaches";
            case ACTION_TARGETS.individual:
                return user.role === USERTYPES.STUDENT ? submitButton : " Individual Actions are Available Only to Students";
            case ACTION_TARGETS.peer_evaluation:
                return user.role !== USERTYPES.COACH ? submitButton : "Available when all Students Submit";
            default:
                return submitButton;
        }
    }

    if (isPeerEval && user.role === USERTYPES.COACH) {
        return (
            <Modal
                closeOnDimmerClick={false}
                className={"sticky"}
                onClose={() => {
                    setOpen(false);
                    props.isOpenCallback(false);
                }}
                onOpen={() => {
                    setOpen(true);
                    props.isOpenCallback(true);

                }}
                open={open}
                trigger={props.trigger ||
                    <Button ref={props.ref} fluid className="view-action-button">View Action</Button>}
            >
                <Modal.Header>{props.action_title}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        {props.preActionContent}
                        <br/>
                        <div className="content">
                            <CoachFeedBack
                                team={props.projectId}
                                action_id={props.action_id}
                            />
                            {errors.length > 0 && <div className="submission-errors">
                                <br/>
                                <Message error>
                                    <MessageHeader>
                                        <Icon name="warning circle"/>
                                        {" "}
                                        Errors:
                                    </MessageHeader>
                                    <MessageList>
                                        {errors.map(err => <li key={err}>{err}</li>)}
                                    </MessageList>
                                </Message>
                            </div>}
                        </div>
                    </Modal.Description>
                    <Modal open={!!submissionModalOpen} {...generateModalFields()}
                           onClose={() => closeSubmissionModal()}/>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={() => {
                            onActionCancel();
                            setOpen(false);
                            props.isOpenCallback(false);
                        }}
                    >
                        Cancel
                    </Button>
                    {renderSubmitButton()}
                </Modal.Actions>
            </Modal>
        );
    } else {
        return (
            // TODO: Add property for Modal to not close when clicking outside of it
            // Property is called closeOnDimmerClick
            <Modal
                closeOnDimmerClick={false}
                className={"sticky"}
                onClose={() => {
                    setOpen(false);
                    props.isOpenCallback(false);
                }}
                onOpen={() => {
                    setOpen(true);
                    props.isOpenCallback(true);
                    fetchStudentNames();

                }}
                open={open}
                trigger={props.trigger ||
                    <Button ref={props.ref} fluid className="view-action-button">View Action</Button>}
            >
                <Modal.Header>{props.action_title}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        {props.preActionContent}
                        <br/>
                        <div className="content">

                            {
                                isPeerEval
                                    ? <ParsedInnerHTML html={props.page_html} components={QuestionComponentsMap}
                                                       studentsList={studentOptions} errorFields={errorFields}/>
                                    : <InnerHTML html={props.page_html}/>
                            }
                        </div>
                        <br/>
                        {fileUpload(props.file_types, props.file_size)}
                        {errors.length > 0 && <div className="submission-errors">
                            <br/>
                            <Message error>
                                <MessageHeader>
                                    <Icon name="warning circle"/>
                                    {" "}
                                    Errors:
                                </MessageHeader>
                                <MessageList>
                                    {errors.map(err => <li key={err}>{err}</li>)}
                                </MessageList>
                            </Message>
                        </div>}
                    </Modal.Description>
                    <Modal open={!!submissionModalOpen} {...generateModalFields()}
                           onClose={() => closeSubmissionModal()}/>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={() => {
                            onActionCancel();
                            setOpen(false);
                            props.isOpenCallback(false);
                        }}
                    >
                        Cancel
                    </Button>
                    {renderSubmitButton()}
                </Modal.Actions>
            </Modal>
        );
    }
}