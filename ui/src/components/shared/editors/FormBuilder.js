import React, { useState, useEffect } from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import QuestionBuilder from "./QuestionBuilder";

export default function FormBuilder(props) {
    const field = props.field;
    const [formHtml, setFormHtml] = useState("");
    const [editorOpen, setEditorOpen] = useState(false);

    useEffect(() => {
        fetch("/MasterPeerEval.txt")
            .then(response => response.text())
            .then(data => setFormHtml(data))
            .catch(error => console.error("Error fetching MasterPeerEval.txt", error));
    }, []);

    function openEditor() {
        setEditorOpen(true);
    }

    function closeEditor() {
        setEditorOpen(false);
    }

    function handleChange(event) {
        setFormHtml(event.target.value);
        props.onChange(event, { name: event.target.name, value: event.target.value });
    }

    return (
        <Form.Field>
            <QuestionBuilder
                isOpen={editorOpen}
                onClose={closeEditor}
                currentCode={formHtml}
                onChange={handleChange}
            />
            <Button  disabled={true} onClick={openEditor} floated={"right"}>
                Open Live Editor
            </Button>
            <Form.TextArea
                placeholder={field.placeholder}
                label={field.label}
                name={props.title}
                value={formHtml}
                style={{ minHeight: 200 }}
                onChange={handleChange}
            />
        </Form.Field>
    );
}
