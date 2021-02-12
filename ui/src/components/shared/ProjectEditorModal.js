import React, { useState } from "react";
import { Button, Dropdown, Modal, Input } from "semantic-ui-react";
import { config } from "../util/constants";

const PROJECT_STATUSES = {
    SUBMITTED: "submitted",
    NEEDS_REVISION: "needs revision",
    FUTURE_PROJECT: "future project",
    CANDIDATE: "candidate",
    IN_PROGRESS: "in progress",
    COMPLETE: "completed",
    ARCHIVED: "archive",
};

export default function ProjectEditor(props) {
    const [editedProject, setEditedProject] = useState({});

    const projectOnChange = (event, target) => {
        setEditedProject({ ...editedProject, [target.label]: target.value });
    };

    const className = (fieldName) => {
        return editedProject[fieldName] && editedProject[fieldName] !== props.project[fieldName] ? "edited-input" : "";
    };

    const value = (fieldName) => {
        if (editedProject[fieldName] !== undefined) {
            return editedProject[fieldName];
        }
        return props.project[fieldName] || "";
    };

    const generateModalContent = () => {
        const options = Object.keys(PROJECT_STATUSES).map((status, idx) => {
            return {
                key: idx,
                text: PROJECT_STATUSES[status],
                value: PROJECT_STATUSES[status],
            };
        });

        return (
            <div className="project-editor-input-container">
                <Input
                    label="display_name"
                    className={className("display_name")}
                    value={value("display_name")}
                    onChange={projectOnChange}
                />
                <Input label="title" className={className("title")} value={value("title")} onChange={projectOnChange} />
                <Input
                    label="organization"
                    className={className("organization")}
                    value={value("organization")}
                    onChange={projectOnChange}
                />
                <Input
                    label="primary_contact"
                    className={className("primary_contact")}
                    value={value("primary_contact")}
                    onChange={projectOnChange}
                />
                <Input
                    label="contact_email"
                    className={className("contact_email")}
                    value={value("contact_email")}
                    onChange={projectOnChange}
                />
                <Input
                    label="contact_phone"
                    className={className("contact_phone")}
                    value={value("contact_phone")}
                    onChange={projectOnChange}
                />
                {/* TODO: How should attachments work? */}
                <Input
                    disabled
                    label="attachments"
                    className={className("attachments")}
                    value={value("attachments")}
                    onChange={projectOnChange}
                />
                <Input
                    label="background_info"
                    className={className("background_info")}
                    value={value("background_info")}
                    onChange={projectOnChange}
                />
                <Input
                    label="project_description"
                    className={className("project_description")}
                    value={value("project_description")}
                    onChange={projectOnChange}
                />
                <Input
                    label="project_scope"
                    className={className("project_scope")}
                    value={value("project_scope")}
                    onChange={projectOnChange}
                />
                <Input
                    label="project_challenges"
                    className={className("project_challenges")}
                    value={value("project_challenges")}
                    onChange={projectOnChange}
                />
                <Input
                    label="constraints_assumptions"
                    className={className("constraints_assumptions")}
                    value={value("constraints_assumptions")}
                    onChange={projectOnChange}
                />
                <Input
                    label="sponsor_provided_resources"
                    className={className("sponsor_provided_resources")}
                    value={value("sponsor_provided_resources")}
                    onChange={projectOnChange}
                />
                <Input
                    label="project_search_keywords"
                    className={className("project_search_keywords")}
                    value={value("project_search_keywords")}
                    onChange={projectOnChange}
                />
                <Input
                    label="sponsor_deliverables"
                    className={className("sponsor_deliverables")}
                    value={value("sponsor_deliverables")}
                    onChange={projectOnChange}
                />
                <Input
                    label="proprietary_info"
                    className={className("proprietary_info")}
                    value={value("proprietary_info")}
                    onChange={projectOnChange}
                />
                <Input
                    label="sponsor_avail_checked"
                    className={className("sponsor_avail_checked")}
                    value={value("sponsor_avail_checked")}
                    onChange={projectOnChange}
                />
                <Input
                    label="sponsor_alternate_time"
                    className={className("sponsor_alternate_time")}
                    value={value("sponsor_alternate_time")}
                    onChange={projectOnChange}
                />
                <Input
                    label="project_agreements_checked"
                    className={className("project_agreements_checked")}
                    value={value("project_agreements_checked")}
                    onChange={projectOnChange}
                />
                <Input
                    label="assignment_of_rights"
                    className={className("assignment_of_rights")}
                    value={value("assignment_of_rights")}
                    onChange={projectOnChange}
                />
                <Input
                    label="team_name"
                    className={className("team_name")}
                    value={value("team_name")}
                    onChange={projectOnChange}
                />
                <Input
                    label="poster"
                    className={className("poster")}
                    value={value("poster")}
                    onChange={projectOnChange}
                />
                <Input label="video" className={className("video")} value={value("video")} onChange={projectOnChange} />
                <Input
                    label="website"
                    className={className("website")}
                    value={value("website")}
                    onChange={projectOnChange}
                />
                <Input
                    label="synopsis"
                    className={className("synopsis")}
                    value={value("synopsis")}
                    onChange={projectOnChange}
                />
                <Input
                    label="sponsor"
                    className={className("sponsor")}
                    value={value("sponsor")}
                    onChange={projectOnChange}
                />
                <Input
                    label="coach1"
                    className={className("coach1")}
                    value={value("coach1")}
                    onChange={projectOnChange}
                />
                <Input
                    label="coach2"
                    className={className("coach2")}
                    value={value("coach2")}
                    onChange={projectOnChange}
                />
                <Input
                    label="semester"
                    className={className("semester")}
                    value={value("semester")}
                    onChange={projectOnChange}
                />
                <Input
                    disabled
                    label="date"
                    className={className("date")}
                    value={value("date")}
                    onChange={projectOnChange}
                />

                <Dropdown
                    label="status"
                    className={className("status")}
                    selection
                    options={options}
                    value={value("status")}
                    onChange={projectOnChange}
                />
            </div>
        );
    };

    const submitProject = (event, target) => {
        fetch(config.url.API_POST_EDIT_PROJECT, {
            method: "post",
            body: JSON.stringify(Object.assign({}, props.project, editedProject)),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    alert("Success!");
                } else {
                    alert("Error...");
                }
            })
            .catch((error) => {
                // TODO: Redirect to failed page or handle errors
                console.error(error);
            });
    };

    return (
        <Modal
            trigger={<Button icon="edit" />}
            header={`Currently Editing "${editedProject.title || props.project.title}"`}
            content={{ content: generateModalContent() }}
            actions={[
                {
                    key: "submit",
                    content: "Submit",
                    onClick: (event, target) => submitProject(event, target),
                    positive: true,
                },
            ]}
        />
    );
}
