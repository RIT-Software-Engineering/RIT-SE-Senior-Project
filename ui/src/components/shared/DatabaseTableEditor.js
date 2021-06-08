import React, { useState, useEffect } from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import { Dropdown, Label, Modal } from "semantic-ui-react";
import { SecureFetch } from "../util/secureFetch";

const MODAL_STATUS = { SUCCESS: "success", FAIL: "fail", CLOSED: false };

export default function DatabaseTableEditor(props) {
    let initialState = props.initialState;
    let submissionModalMessages = props.submissionModalMessages;
    let submitRoute = props.submitRoute;
    let formFieldArray = props.formFieldArray;

    const [submissionModalOpen, setSubmissionModalOpen] = useState(MODAL_STATUS.CLOSED);

    const [formData, setFormData] = useState(initialState);
    // Update initial state if provided initial state is changed
    useEffect(() => {
        setFormData(initialState)
    }, [initialState])

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

        SecureFetch(submitRoute, {
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
                alert("Error with submission, check logs");
                console.error(error);
            });
    };

    const handleChange = (e, { name, value, checked, isActiveField }) => {

        if (props.viewOnly) {
            return;
        }

        if (checked !== undefined) {
            if (isActiveField) {
                // The active field either stores and empty string or a datetime.
                // The datetime is set by the server if the active field is set to 'false'.
                value = checked ? "" : false;
            } else {
                value = checked;
            }
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    let fieldComponents = [];
    for (let i = 0; i < formFieldArray.length; i++) {
        let field = formFieldArray[i];
        if (!field.hidden) {
            switch (field.type) {
                case "input":
                    fieldComponents.push(
                        <Form.Field key={field.name}>
                            <Form.Input
                                label={field.label}
                                placeholder={field.placeholder}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                disabled={field.disabled}
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
                                disabled={field.disabled}
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
                                disabled={field.disabled}
                            />
                        </Form.Field>
                    );
                    break;
                case "dropdown":

                    fieldComponents.push(
                        <Form.Field key={field.name} disabled={field.loading || field.disabled}>
                            <label>{field.label}</label>
                            <Dropdown
                                selection
                                options={field.options}
                                loading={field.loading}
                                disabled={field.loading || field.disabled}
                                value={formData[field.name]?.toString()}
                                name={field.name}
                                onChange={handleChange}
                            />
                        </Form.Field>
                    );
                    break;

                case "checkbox":
                    fieldComponents.push(
                        <Form.Field key={field["name"]}>
                            <label>{field.label}</label>
                            <Form.Checkbox
                                label={field["label"]}
                                checked={!!formData[field["name"]]}
                                name={field["name"]}
                                onChange={handleChange}
                                disabled={field.disabled}
                            />
                        </Form.Field>
                    )
                    break;

                case "files":
                    fieldComponents.push(
                        <Form.Field key={field["name"]}>
                            <label>{field.label}</label>
                            {formData[field["name"]].length > 0 ? formData[field["name"]].map(file => {
                                return <><a target="_blank" href={file.link}>{file.title}</a><br /></>
                            }) : <p>No Attachments</p>}
                        </Form.Field>
                    )
                    break;

                case "multiSelectDropdown":
                    fieldComponents.push(
                        <Form.Field key={field.name} disabled={field.loading || field.disabled}>
                            <label>{field.label}</label>
                            <Dropdown
                                multiple
                                search
                                selection
                                placeholder={field.name}
                                options={field.options}
                                loading={field.loading}
                                disabled={field.loading || field.disabled}
                                value={formData[field.name]}
                                name={field.name}
                                onChange={handleChange}
                            />
                        </Form.Field>
                    );
                    break;


                case "activeCheckbox":
                    fieldComponents.push(
                        <Form.Field key={field["name"]}>
                            {formData[field["name"]] !== "" && <Label>Deactivated at: {formData[field["name"]] || "now"}</Label>}
                            <Form.Checkbox
                                label={field["label"]}
                                checked={formData[field["name"]] === ""}
                                name={field["name"]}
                                onChange={(e, { name, value, checked }) => handleChange(e, { name, value, checked, isActiveField: true })}
                                disabled={field.disabled}
                            />
                        </Form.Field>
                    )
                    break;

                default:
                    console.warn(`Found unknown field type: "${field.type}"`)
                    break;
            }
        }
    }

    const modalActions = () => {
        if (props.viewOnly) {
            return [
                {
                    key: "Done",
                    content: "Done",
                },
            ]
        }
        return [
            {
                key: "submit",
                content: "Submit",
                onClick: (event) => handleSubmit(event),
                positive: true,
            },
        ]
    }

    return (
        <>
            <Modal
                trigger={<Button icon={props.button} />}
                header={props.header}
                content={{ content: <Form>{fieldComponents}</Form> }}
                actions={modalActions()}
            />
            <Modal open={!!submissionModalOpen} {...generateModalFields()} onClose={() => closeSubmissionModal()} />
        </>
    );
}
