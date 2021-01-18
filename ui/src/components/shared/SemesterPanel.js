import React, {useState} from 'react';
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import {Modal} from "semantic-ui-react";

const MODAL_STATUS = {SUCCESS: "success", FAIL: "fail", CLOSED: false};

export default function SemesterPanel(props){

    const [formData, setFormData] = useState({semester_id: props.semester_id || '', name: props.name || '', dept: props.dept || '', start_date: props.start_date || '', end_date: props.end_date || ''});
    const [submissionModalOpen, setSubmissionModalOpen] = useState(MODAL_STATUS.CLOSED);


    const generateModalFields = () => {
        switch (submissionModalOpen) {
            case MODAL_STATUS.SUCCESS:
                return {
                    header: "Success",
                    content: "The semester has been updated.",
                    actions: [{header: "Success!", content:"Done", positive: true, key:0}]
                };
            case MODAL_STATUS.FAIL:
                return {
                    header: "There was an issue...",
                    content: "We were unable to receive your update to the semester.",
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

        fetch('http://localhost:3001/db/editSemester',{
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

    return (
        <Form onSubmit={(e) => {handleSubmit(e)}}>
            <Form.Field>
                <label>Semester Name</label>
                <Form.Input
                    placeholder='Semester Name'
                    name = 'name'
                    value = {formData['name']}
                    onChange = {handleChange}
                />
            </Form.Field>
            <Form.Field>
                <label>Department</label>
                <Form.Input
                    placeholder='Department'
                    name = 'dept'
                    value = {formData['dept']}
                    onChange = {handleChange}
                />
            </Form.Field>
            <Form.Field>
                <label>Start Date</label>
                <Form.Input
                    placeholder='Start Date'
                    name = 'start_date'
                    value = {formData['start_date']}
                    onChange = {handleChange}
                />
            </Form.Field>
            <Form.Field>
                <label>End Date</label>
                <Form.Input
                    placeholder='End Date'
                    name = 'end_date'
                    value = {formData['end_date']}
                    onChange = {handleChange}
                />
            </Form.Field>
            <Button type='submit'>Submit</Button>
            <Modal
                open={!!submissionModalOpen}
                {...generateModalFields()}
                onClose={() => closeSubmissionModal()}
            />
        </Form>);
}