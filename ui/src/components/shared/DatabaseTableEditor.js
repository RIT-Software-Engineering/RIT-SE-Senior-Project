import React, { useState } from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import { Dropdown, Modal } from "semantic-ui-react";

const MODAL_STATUS = { SUCCESS: "success", FAIL: "fail", CLOSED: false };

export default function DatabaseTableEditor(props) {
    let initialState = props.initialState;
    let submissionModalMessages = props.submissionModalMessages;
    let submitRoute = props.submitRoute;
    let formFieldArray = props.formFieldArray;

    const [submissionModalOpen, setSubmissionModalOpen] = useState(MODAL_STATUS.CLOSED);
    const [formData, setFormData] = useState(initialState);

    let semesterMap = {};

    for (let i = 0; i < props.semesterData.length; i++) {
        const semester = props.semesterData[i];
        semesterMap[semester.semester_id] = semester.name;
    }

    const generateModalFields = () => {
        switch (submissionModalOpen) {
            case MODAL_STATUS.SUCCESS:
                return {
                    header: "Success",
                    content: submissionModalMessages["SUCCESS"],
                    actions: [{ header: "Success!", content: "Done", positive: true, key: 0 }],
                };
            case MODAL_STATUS.FAIL:
                return {
                    header: "There was an issue...",
                    content: submissionModalMessages["SUCCESS"],
                    actions: [{ header: "There was an issue", content: "Keep editing...", positive: true, key: 0 }],
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

    const handleSubmit = async function (e) {
        let body = new FormData();

        Object.keys(formData).forEach((key) => {
            body.append(key, formData[key]);
        });

        console.log("formData: ", formData);

        fetch(submitRoute, {
            method: "post",
            body: body,
        })
            .then((response) => {
                if (response.status === 200) {
                    setSubmissionModalOpen(MODAL_STATUS.SUCCESS);
                } else {
                    setSubmissionModalOpen(MODAL_STATUS.FAIL);
                }
            })
            .catch((error) => {
                // TODO: handle errors
                console.error(error);
            });
    };

    const handleChange = (e, { name, value }) => {
        console.log("form field name and value: ", name, value);
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    let fieldComponents = [];

    for (let i = 0; i < formFieldArray.length; i++) {
        let field = formFieldArray[i];
        switch(field.type) {
            case "input":
                fieldComponents.push(
                    <Form.Field key={field.name}>
                        <Form.Input
                            label={field.label}
                            placeholder={field.placeholder}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                        />
                    </Form.Field>
                );
                break;
            case "date":
                fieldComponents.push(
                    <Form.Field key={field.name}>
                        <Form.Input
                            label={field.label}
                            type="date"
                            placeholder={field.placeholder}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                        />
                    </Form.Field>
                );
                break;
            case "textArea":
                fieldComponents.push(
                    <Form.Field key={field.name}>
                        <Form.TextArea
                            placeholder={field.placeholder}
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            style={{ minHeight: 200 }}
                            onChange={handleChange}
                        />
                    </Form.Field>
                );
                break;
            case "dropdown":
                const options = Object.keys(semesterMap).map((semester_id, idx) => {
                    return { key: idx, text: semesterMap[semester_id], value: semester_id };
                });    
                fieldComponents.push(
                    <Form.Field key={field.name}>
                        <label>{field.label}</label>
                        <Dropdown
                            selection
                            options={options}
                            loading={props.semesterData.loading}
                            disabled={props.semesterData.loading}
                            value={formData[field.name].toString()}
                            name={field.name}
                            onChange={handleChange}
                        />
                    </Form.Field>
                );
                break;
            default:
                return;
        }
    }

    return (
        <Form
            onSubmit={(e) => {
                handleSubmit(e);
            }}
        >
            {fieldComponents}
            <Button type="submit">Submit</Button>
            <Modal open={!!submissionModalOpen} {...generateModalFields()} onClose={() => closeSubmissionModal()} />
        </Form>
    );
}
