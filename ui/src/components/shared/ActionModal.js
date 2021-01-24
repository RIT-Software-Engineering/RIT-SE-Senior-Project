import React, { useState } from "react";
import { Button, Modal } from "semantic-ui-react";

const MODAL_STATUS = { SUCCESS: "success", FAIL: "fail", CLOSED: false };

export default function ActionModal(props) {
    const [open, setOpen] = React.useState(false);
    const [submissionModalOpen, setSubmissionModalOpen] = useState(MODAL_STATUS.CLOSED);

    const generateModalFields = () => {
        switch (submissionModalOpen) {
            case MODAL_STATUS.SUCCESS:
                return {
                    header: "Success",
                    content: "Your submission has been received.",
                    actions: [{ header: "Success!", content: "Done", positive: true, key: 0 }],
                };
            case MODAL_STATUS.FAIL:
                return {
                    header: "There was an issue...",
                    content:
                        "We were unable to receive your submission. You can try again later or contact our support team that we don't have...",
                    actions: [{ header: "There was an issue", content: "Keep editing...", positive: true, key: 0 }],
                };
            default:
                return;
        }
    };

    const closeSubmissionModal = () => {
        switch (submissionModalOpen) {
            case MODAL_STATUS.SUCCESS:
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
            trigger={<Button>Show Modal</Button>}
        >
            <Modal.Header>{props.action_title}</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <div className="content" dangerouslySetInnerHTML={{ __html: props.page_html }} />
                </Modal.Description>
                <Modal open={!!submissionModalOpen} {...generateModalFields()} onClose={() => closeSubmissionModal()} />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    color="black"
                    onClick={() => {
                        onActionCancel();
                        setOpen(false);
                        props.isOpenCallback(false);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    content="Submit"
                    labelPosition="right"
                    icon="checkmark"
                    onClick={() => {
                        onActionSubmit(props.id);
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    );

    function onActionSubmit(id) {
        let form = document.forms.item(0);
        if (form === null) {
        } else {
            const formData = new FormData(document.querySelector("form"));
            fetch("http://localhost:3001/db/submitAction", {
                method: "post",
                body: formData,
            })
                .then((response) => {
                    if (response.status === 200) {
                        setSubmissionModalOpen(MODAL_STATUS.SUCCESS);
                    } else {
                        setSubmissionModalOpen(MODAL_STATUS.FAIL);
                    }
                })
                .catch((error) => {
                    // TODO: Redirect to failed page or handle errors
                    console.error(error);
                });
        }
    }

    function onActionCancel() {}
}
