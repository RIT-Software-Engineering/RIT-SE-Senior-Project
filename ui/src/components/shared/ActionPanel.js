import React, {useEffect, useState} from 'react';
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import {Modal} from "semantic-ui-react";

const MODAL_STATUS = {SUCCESS: "success", FAIL: "fail", CLOSED: false};

export default function ActionPanel(props) {

    const [submissionModalOpen, setSubmissionModalOpen] = useState(MODAL_STATUS.CLOSED);

    const [formData, setFormData] = useState({
            action_id: props.action_id || '',
            action_title: props.action_title || '',
            semester: props.semester || '',
            action_target: props.action_target || '',
            is_null: props.is_null || '',
            short_desc: props.short_desc || '',
            start_date: props.start_date || '',
            due_date: props.due_date || '',
            page_html: props.page_html || '',

    });


    const generateModalFields = () => {
        switch (submissionModalOpen) {
            case MODAL_STATUS.SUCCESS:
                return {
                    header: "Success",
                    content: "The action has been updated.",
                    actions: [{header: "Success!", content:"Done", positive: true, key:0}]
                };
            case MODAL_STATUS.FAIL:
                return {
                    header: "There was an issue...",
                    content: "We were unable to receive your update to the action.",
                    actions: [{header: "There was an issue", content:"Keep editing...", positive: true, key:0}]
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
    };

    const handleSubmit = async function(e){
        let body = new FormData();

        Object.keys(formData).forEach((key) => {
            body.append(key, formData[key]);
        });

        console.log('formData: ', formData);

        fetch('http://localhost:3001/db/editAction',{
            method: "post",
            body: body,
        }).then((response) => {
            if(response.status === 200) {
                setSubmissionModalOpen(MODAL_STATUS.SUCCESS);
            } else {
                setSubmissionModalOpen(MODAL_STATUS.FAIL);
            }
        }).catch((error) => {
            // TODO: handle errors
            console.error(error);
        })
    };

    const handleChange = (e, { name, value }) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    let formFieldArray = [
        {
            type: 'input',
            label: 'Action Title',
            placeHolder: 'Action Title',
            name: 'action_title',
            value: formData['action_title'],
        },
        {
            type: 'input',
            label: 'Semester',
            placeHolder: 'Semester',
            name: 'semester',
            value: formData['semester'],
        },
        {
            type: 'input',
            label: 'Action Target',
            placeHolder: 'Action Target',
            name: 'action_target',
            value: formData['action_target'],
        },
        {
            type: 'input',
            label: 'Is Null',
            placeHolder: 'Is Null',
            name: 'is_null',
            value: formData['is_null'],
        },
        {
            type: 'input',
            label: 'Short Desc',
            placeHolder: 'Short Desc',
            name: 'short_desc',
            value: formData['short_desc'],
        },
        {
            type: 'input',
            label: 'Start Date',
            placeHolder: 'Start Date',
            name: 'start_date',
            value: formData['start_date'],
        },
        {
            type: 'input',
            label: 'Due Date',
            placeHolder: 'Due Date',
            name: 'due_date',
            value: formData['due_date'],
        },
        {
            type: 'textArea',
            label: 'Page Html',
            placeHolder: 'Page Html',
            name: 'page_html',
            value: formData['page_html'],
        },
    ];

    let fieldComponents = [];

    for (let i = 0; i < formFieldArray.length; i++){
        let field = formFieldArray[i];
        if(field['type'] === 'input'){
            fieldComponents.push(
                <Form.Field key={field['name']}>
                    <label>{field['label']}</label>
                    <Form.Input
                        placeholder={field['placeholder']}
                        name = {field['name']}
                        value = {field['value']}
                        onChange = {handleChange}
                    />
                </Form.Field>
            )
        }
        else if (field['type'] === 'textArea'){
            fieldComponents.push(
                <Form.Field key={field['name']}>
                    <label>{field['label']}</label>
                    <Form.TextArea
                        placeholder={field['placeholder']}
                        name = {field['name']}
                        value = {field['value']}
                        style={{ minHeight: 200 }}
                        onChange = {handleChange}
                    />
                </Form.Field>
            )
        }
    }

    return (
        <Form onSubmit={(e) => {handleSubmit(e)}}>
            {fieldComponents}
            <Button type='submit'>Submit</Button>
            <Modal
                open={!!submissionModalOpen}
                {...generateModalFields()}
                onClose={() => closeSubmissionModal()}
            />
        </Form>);
}