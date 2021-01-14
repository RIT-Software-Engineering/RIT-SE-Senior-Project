import React, {useEffect, useState} from 'react';
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";

export default function SemesterPanel(props){

    const [formData, setFormData] = useState({semester_id: props.semester_id || '', name: props.name || '', dept: props.dept || '', start_date: props.start_date || '', end_date: props.end_date || ''});

    useEffect(() => {
    }, [formData]);

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
                // setModalOpen(MODAL_STATUS.SUCCESS)
                // console.log('success: ', response);
            } else {
                // setModalOpen(MODAL_STATUS.FAIL)
                // console.log('fail: ', response);
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
        </Form>);
}