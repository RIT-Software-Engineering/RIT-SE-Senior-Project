import React, {useEffect, useState} from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import QuestionBuilder from "./QuestionBuilder";
import {Grid, Header, Label} from "semantic-ui-react";
import HTMLEditor from "../../util/components/HTMLEditor";

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
                        <Header as="h5">Page html</Header>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Button disabled={false} onClick={openEditor} floated={"right"}>
                            Open Question Builder
                        </Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{marginTop:"-35px"}}>
                    <Grid.Column>
                        <HTMLEditor field={field} formData={props.data} handleChange={handleChange}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Form.Field>
    );
}