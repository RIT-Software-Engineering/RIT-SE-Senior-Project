import React, { useEffect, useState } from "react";
import { config, USERTYPES } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";
import { createSemesterDropdownOptions } from "../util/utils";
import DatabaseTableEditor from "./DatabaseTableEditor";

const PROJECT_STATUSES = {
    SUBMITTED: "submitted",
    NEEDS_REVISION: "needs revision",
    FUTURE_PROJECT: "future project",
    CANDIDATE: "candidate",
    IN_PROGRESS: "in progress",
    COMPLETE: "completed",
    ARCHIVED: "archive",
};

export default function ProjectEditorModal(props) {

    const formattedAttachments = () => {
        return props.project?.attachments?.split(", ").map(attachment => {
            return {
                title: attachment,
                link: `${config.url.API_GET_PROPOSAL_ATTACHMENT}?proposalTitle=${props.project.title}&name=${attachment}`,
            }
        })
    }

    const [projectMembers, setProjectMembers] = useState({ students: [], coaches: [] })
    const [initialState, setInitialState] = useState({
        project_id: props.project.project_id || "",
        display_name: props.project.display_name || "",
        title: props.project.title || "",
        organization: props.project.organization || "",
        primary_contact: props.project.primary_contact || "",
        contact_email: props.project.contact_email || "",
        contact_phone: props.project.contact_phone || "",
        attachments: formattedAttachments() || [],
        background_info: props.project.background_info || "",
        project_description: props.project.project_description || "",
        project_scope: props.project.project_scope || "",
        project_challenges: props.project.project_challenges || "",
        constraints_assumptions: props.project.constraints_assumptions || "",
        sponsor_provided_resources: props.project.sponsor_provided_resources || "",
        project_search_keywords: props.project.project_search_keywords || "",
        sponsor_deliverables: props.project.sponsor_deliverables || "",
        proprietary_info: props.project.proprietary_info || "",
        sponsor_avail_checked: props.project.sponsor_avail_checked || "",
        sponsor_alternate_time: props.project.sponsor_alternate_time || "",
        project_agreements_checked: props.project.project_agreements_checked || "",
        assignment_of_rights: props.project.assignment_of_rights || "",
        team_name: props.project.team_name || "",
        poster: props.project.poster || "",
        video: props.project.video || "",
        website: props.project.website || "",
        synopsis: props.project.synopsis || "",
        sponsor: props.project.sponsor || "",
        semester: props.project.semester || "",
        date: props.project.date || "",
        status: props.project.status || "",
    })

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_PROJECT_MEMBERS}?project_id=${props.project?.project_id}`)
            .then(response => response.json())
            .then(members => {
                let projectMemberOptions = { students: [], coaches: [] }
                let projectGroupedValues = { students: [], coaches: [] }
                members.forEach(member => {
                    switch (member.type) {
                        case USERTYPES.STUDENT:
                            projectMemberOptions.students.push({ key: member.system_id, text: `${member.lname}, ${member.fname}`, value: member.system_id });
                            projectGroupedValues.students.push(member.system_id);
                            break;
                        case USERTYPES.COACH:
                            if (props.viewOnly) {
                                projectMemberOptions.coaches.push({ key: member.system_id, text: `${member.lname}, ${member.fname}`, value: member.system_id });
                            }
                            projectGroupedValues.coaches.push(member.system_id);
                            break;
                        default:
                            console.error(`Project editor error - invalid project member type "${member.type}" for member: `, member);
                            break;
                    }
                });
                setInitialState({
                    ...initialState,
                    projectStudents: projectGroupedValues.students,
                    projectCoaches: projectGroupedValues.coaches,
                });
                setProjectMembers(projectMemberOptions);
            })
    }, [])

    let semesterMap = {};

    if (!!props.semesterData) {
        for (let i = 0; i < props.semesterData.length; i++) {
            const semester = props.semesterData[i];
            semesterMap[semester.semester_id] = semester.name;
        }
    }

    let submissionModalMessages = {
        SUCCESS: "The project has been updated.",
        FAIL: "We were unable to receive your update to the project.",
    };

    const options = Object.keys(PROJECT_STATUSES).map((status, idx) => {
        return {
            key: idx,
            text: PROJECT_STATUSES[status],
            value: PROJECT_STATUSES[status],
        };
    });

    let formFieldArray = [
        {
            type: "input",
            label: "project_id",
            placeHolder: "project_id",
            name: "project_id",
            disabled: true,
            hidden: props.viewOnly,
        },
        {
            type: "input",
            label: "display_name",
            placeHolder: "display_name",
            name: "display_name",
        },
        {
            type: "input",
            label: "title",
            placeHolder: "title",
            name: "title",
        },
        {
            type: "multiSelectDropdown",
            label: "Students",
            options: projectMembers.students,
            name: "projectStudents",
            disabled: true,
        },
        {
            type: "multiSelectDropdown",
            label: "Coaches",
            options: props.viewOnly ? projectMembers.coaches : props.activeCoaches?.map(coach => { return { key: coach.system_id, text: `${coach.lname}, ${coach.fname}`, value: coach.system_id } }),
            name: "projectCoaches",
            disabled: props.viewOnly
        },
        {
            type: "input",
            label: "organization",
            placeHolder: "organization",
            name: "organization",
        },
        {
            type: "input",
            label: "primary_contact",
            placeHolder: "primary_contact",
            name: "primary_contact",
        },
        {
            type: "input",
            label: "contact_email",
            placeHolder: "contact_email",
            name: "contact_email",
        },
        {
            type: "input",
            label: "contact_phone",
            placeHolder: "contact_phone",
            name: "contact_phone",
        },
        {
            type: "files",
            name: "attachments",
            placeHolder: "attachments",
            label: "attachments",
            disabled: true,
        },
        {
            type: "input",
            label: "background_info",
            placeHolder: "background_info",
            name: "background_info",
        },
        {
            type: "input",
            label: "project_description",
            placeHolder: "project_description",
            name: "project_description",
        },
        {
            type: "input",
            label: "project_scope",
            placeHolder: "project_scope",
            name: "project_scope",
        },
        {
            type: "input",
            label: "project_challenges",
            placeHolder: "project_challenges",
            name: "project_challenges",
        },
        {
            type: "input",
            label: "constraints_assumptions",
            placeHolder: "constraints_assumptions",
            name: "constraints_assumptions",
        },
        {
            type: "input",
            label: "sponsor_provided_resources",
            placeHolder: "sponsor_provided_resources",
            name: "sponsor_provided_resources",
        },
        {
            type: "input",
            label: "project_search_keywords",
            placeHolder: "project_search_keywords",
            name: "project_search_keywords",
        },
        {
            type: "input",
            label: "sponsor_deliverables",
            placeHolder: "sponsor_deliverables",
            name: "sponsor_deliverables",
        },
        {
            type: "input",
            label: "proprietary_info",
            placeHolder: "proprietary_info",
            name: "proprietary_info",
        },
        {
            type: "input",
            label: "sponsor_avail_checked",
            placeHolder: "sponsor_avail_checked",
            name: "sponsor_avail_checked",
        },
        {
            type: "input",
            label: "sponsor_alternate_time",
            placeHolder: "sponsor_alternate_time",
            name: "sponsor_alternate_time",
        },
        {
            type: "input",
            label: "project_agreements_checked",
            placeHolder: "project_agreements_checked",
            name: "project_agreements_checked",
        },
        {
            type: "input",
            label: "assignment_of_rights",
            placeHolder: "assignment_of_rights",
            name: "assignment_of_rights",
        },
        {
            type: "input",
            label: "team_name",
            placeHolder: "team_name",
            name: "team_name",
        },
        {
            type: "input",
            label: "poster",
            placeHolder: "poster",
            name: "poster",
        },
        {
            type: "input",
            label: "video",
            placeHolder: "video",
            name: "video",
        },
        {
            type: "input",
            label: "website",
            placeHolder: "website",
            name: "website",
        },
        {
            type: "input",
            label: "synopsis",
            placeHolder: "synopsis",
            name: "synopsis",
        },
        {
            type: "input",
            label: "sponsor",
            placeHolder: "sponsor",
            name: "sponsor",
        },
        {
            type: "dropdown",
            label: "Semester",
            placeHolder: "Semester",
            name: "semester",
            options: createSemesterDropdownOptions(props.semesterData),
            loading: props.semesterData?.loading,
        },
        {
            type: "input",
            label: "date",
            name: "date",
            placeHolder: "date",
            disabled: true,
        },
        {
            type: "dropdown",
            label: "status",
            options: options,
            name: "status",
        },
    ]

    let fetchOptions = {
        headers: {
            "Content-Type": "application/json",
        },
    }

    return (
        <DatabaseTableEditor
            initialState={initialState}
            submissionModalMessages={submissionModalMessages}
            submitRoute={props.viewOnly ? "" : config.url.API_POST_EDIT_PROJECT}
            formFieldArray={formFieldArray}
            semesterData={props.semesterData}
            header={`${props.viewOnly ? "Viewing" : "Editing"} project: ${props.project.display_name || props.project.title}`}
            fetchOptions={fetchOptions}
            button={props.viewOnly ? "eye" : "edit"}
            viewOnly={props.viewOnly}
        />
    );
}
