import React from "react";
import { Modal, Button } from "semantic-ui-react";

export default function StudentPopup({ student, open, onClose }) {
    return (
        <Modal open={open} onClose={onClose} size="small">
            <Modal.Header>{student.fname} {student.lname}</Modal.Header>
            <Modal.Content>
                <p><strong>ID:</strong> {student.system_id}</p>
                <p><strong>Email:</strong> <a href={`mailto:${student.email}`}>{student.email}</a></p>
                <p><strong>Last Login:</strong> {student.last_login ? student.last_login : "Never Logged in"}</p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={onClose} primary>Close</Button>
            </Modal.Actions>
        </Modal>
    );
}
