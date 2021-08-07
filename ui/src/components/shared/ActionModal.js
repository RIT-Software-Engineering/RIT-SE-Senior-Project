import React, { useState, useRef, useContext } from "react";
import { Button, Modal } from "semantic-ui-react";
import { Form, Input } from 'semantic-ui-react';
import { ACTION_TARGETS, config, USERTYPES } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";
import { formatDateTime } from "../util/utils";
import { UserContext } from "../util/UserContext";

const MODAL_STATUS = { SUCCESS: "success", FAIL: "fail", CLOSED: false };
/** 
*This file is only used in ToolTips, it should be removed completely
*/
export default function ActionModal(props) {
    const { user } = useContext(UserContext);
    const [open, setOpen] = React.useState(false);
    const [submissionModalOpen, setSubmissionModalOpen] = useState(MODAL_STATUS.CLOSED);
    const [errors, setErrors] = useState([])
    const filesRef = useRef();

    const generateModalFields = () => {
        switch (submissionModalOpen) {
            case MODAL_STATUS.SUCCESS:
                return {
                    header: "Success",
                    content: "Your submission has been received.",
                    actions: [{ header: "Success!", content: "Close", positive: true, key: 0 }],
                };
            case MODAL_STATUS.FAIL:
                return {
                    header: "There was an issue...",
                    content:
                        "We were unable to receive your submission.",
                    actions: [{ header: "There was an issue", content: "Cancel", positive: true, key: 0 }],
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
            const formDataKeys = Object.keys(document.forms[0].elements);
            let errors = [];
            for (let x = formDataKeys.length / 2; x < formDataKeys.length; x++) {
                if (document.forms[0].elements[formDataKeys[x]]?.required && !document.forms[0].elements[formDataKeys[x]]?.value) {
                    errors.push(`'${document.forms[0].elements[formDataKeys[x]].name}' can not be empty`);
                }
                formData[formDataKeys[x]] = document.forms[0].elements[formDataKeys[x]]?.value;
            }

            const formFiles = filesRef.current?.inputRef?.current?.files || [];

            if (file_types && formFiles.length === 0) {
                errors.push("You must upload files");
            }

            if (errors.length > 0) {
                setErrors(errors);
                return;
            }

            body.append("form_data", JSON.stringify(formData));

            for (let i = 0; i < formFiles?.length || 0; i++) {
                body.append("attachments", formFiles[i]);
            }

            SecureFetch(config.url.API_POST_SUBMIT_ACTION, {
                method: "post",
                body: body,
            })
                .then((response) => {
                    if (response.status === 200) {
                        setSubmissionModalOpen(MODAL_STATUS.SUCCESS);
                    } else {
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

    function fileUpload(fileTypes) {
        return fileTypes && <Form>
            <Form.Field required>
                <label className="file-submission-required">File Submission (Accepted: {fileTypes.split(",").join(", ")})</label>
                <Input fluid required ref={filesRef} type="file" accept={fileTypes} multiple />
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
            default:
                return submitButton;
        }
    }

    return (
        <Modal
            onClose={() => {
                setOpen(false);
                props.isOpenCallback(false);
            }}
            onOpen={() => {
                setOpen(true);
                props.isOpenCallback(true);
            }}
            open={open}
            trigger={props.trigger || <Button fluid >View Action</Button>}
        >
            <Modal.Header>{props.action_title}</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    {props.preActionContent}
                    <br />
                    <div className="content" dangerouslySetInnerHTML={{ __html: props.page_html }} />
                    <br />
                    {fileUpload(props.file_types)}
                    {errors.length > 0 && <div className="submission-errors">
                        <br />
                        <h4>Errors:</h4>
                        <ul>
                            {errors.map(err => <li key={err}>{err}</li>)}
                        </ul>
                    </div>}
                </Modal.Description>
                <Modal open={!!submissionModalOpen} {...generateModalFields()} onClose={() => closeSubmissionModal()} />
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
