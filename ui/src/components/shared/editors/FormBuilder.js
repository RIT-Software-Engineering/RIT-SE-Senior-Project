import React, { useState, useEffect } from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import {  Dropdown, Grid, Segment } from "semantic-ui-react";

export default function FormBuilder(props) {
    const [form_html, setFormHtml] = useState("");
    setFormHtml(props.title);
    const options=[
        {
            key:'empty',
            text: 'Empty',
            value: "",
        },
        {
            key: 'name',
            text: 'Name',
            value: 'name',
        },
        
    ]

    function handleChange(event) {
        setFormHtml(event.target.value);
        props.onChange(event.target.name, event.target.value);
    }

    
    function onSelect(event, {value}) {
        setFormHtml(value);
    }
        
    return (
        <Form.Field key={props.key}> 
            <Form.TextArea
                placeholder={props.field.placeholder}
                label={props.field.label}
                name={props.title}
                value={form_html}
                style={{ minHeight: 200 }}
                onChange={handleChange}
                disabled={props.field.disabled}
            />
       <Dropdown
            
            options={options}
            placeholder='Import a Template'
            selection
            search
            onChange={onSelect}
            style={{width: '50%'}}
          />
        </Form.Field>
    );
    
}