import React, {useEffect, useState} from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import QuestionBuilder from "./QuestionBuilder";
import {Grid, Header, Label} from "semantic-ui-react";
import ReactCodeMirror from "@uiw/react-codemirror";
import {eclipse} from "@uiw/codemirror-theme-eclipse";
import {html} from "@codemirror/lang-html";

export default function FormBuilder(props) {
    const field = props.field;
    const [formHtml, setFormHtml] = useState(props.value);
    const [editorOpen, setEditorOpen] = useState(false);

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


    function openEditor() {
        setEditorOpen(true);
    }

    function closeEditor() {
        setEditorOpen(false);
    }

    function handleChange(event) {
        setFormHtml(event)
        props.onChange({target: {name: field.name, value: event}}, {name: field.name, value: event});
    }

    return (
        <Form.Field>
            <Grid>
                <Grid.Row>
                    <QuestionBuilder
                        isOpen={editorOpen}
                        onClose={closeEditor}
                        currentCode={formHtml}
                        onChange={handleChange}
                    />
                    <Grid.Column width={8}>
                        <Header as="h4">Page html</Header>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Button disabled={false} onClick={openEditor} floated={"right"}>
                            Open Live Editor
                        </Button>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <ReactCodeMirror
                            theme={eclipse}
                            onChange={handleChange}
                            value={formHtml}
                            maxWidth={"200"}
                            extensions={[html({autoCloseTags: true})]}
                        />
                    </Grid.Column>
                </Grid.Row>

            </Grid>
        </Form.Field>
    );
}
