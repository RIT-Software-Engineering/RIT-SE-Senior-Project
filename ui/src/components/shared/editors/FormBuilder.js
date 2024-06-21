import React, { useState, useEffect } from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import QuestionBuilder from "../../util/components/QuestionBuilder";
export default function FormBuilder(props) {
    const field = props.field;
    const [formHtml, setFormHtml] = useState("");
    const [editorOpen, setEditorOpen] = useState(false);
    useEffect(() => {
        if (props.title) {
            setFormHtml(props.title);
        }
    }, [props.title]);

    const options = [
        {
            key: 'empty',
            text: 'Empty',
            value: "",
        },
        {
            key: 'name',
            text: 'Name',
            value: 'name',
        },
    ];
     function openEditor(){
         setEditorOpen(true);
     }
     function closeEditor(){
         setEditorOpen(false);
     }
    function handleChange(event) {
        setFormHtml(event.target.value);
        props.onChange(event, { name: event.target.name, value: event.target.value });
    }

    function onSelect(event, { value }) {
        setFormHtml(value);
    }

    return (
        <Form.Field>
            <Button circular={true} onClick={openEditor}>Open Live Editor</Button>
            <QuestionBuilder isOpen={editorOpen} OnClose={closeEditor} currentCode={formHtml} onChange={handleChange}/>

            <Button floated={"right"}>Live Question Editor</Button>
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
