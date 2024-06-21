import React, { useState, useEffect } from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import { Dropdown, Grid, Segment } from "semantic-ui-react";

export default function FormBuilder(props) {
    const field = props.field;
    const [formHtml, setFormHtml] = useState("");

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

    function handleChange(event) {
        setFormHtml(event.target.value);
        props.onChange(event, { name: event.target.name, value: event.target.value });
    }

    function onSelect(event, { value }) {
        setFormHtml(value);
    }

    return (
        <Form.Field>
            <Form.TextArea
                placeholder={field.placeholder}
                label={field.label}
                name={props.title}
                value={formHtml}
                style={{ minHeight: 200 }}
                onChange={handleChange}
            />
            <Dropdown
                options={options}
                placeholder='Import a Template'
                selection
                search
                onChange={onSelect}
                style={{ width: '50%' }}
            />
        </Form.Field>
    );
}
