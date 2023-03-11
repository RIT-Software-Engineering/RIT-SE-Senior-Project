import React, { useEffect, useState } from "react";
import { config, USERTYPES } from "../../util/functions/constants";
import { SecureFetch } from "../../util/functions/secureFetch";
import { createSemesterDropdownOptions, SEMESTER_DROPDOWN_NULL_VALUE } from "../../util/functions/utils";
import DatabaseTableEditor from "../../shared/editors/DatabaseTableEditor";
import {decode} from "html-entities";

const PROJECT_STATUSES = {
    SUBMITTED: "submitted",
    NEEDS_REVISION: "needs revision",
    FUTURE_PROJECT: "future project",
    CANDIDATE: "candidate",
    IN_PROGRESS: "in progress",
    COMPLETE: "completed",
    ARCHIVED: "archive",
};

export const formattedAttachments = (project) => {
    return project?.attachments?.split(", ").map(attachment => {
        return {
            title: attachment,
            link: `${config.url.API_GET_PROPOSAL_ATTACHMENT}?project_id=${project.project_id}&name=${attachment}`,
        }
    })
}

/**
 * Note: Now that ProjectViewModal exists, there isn't much of a need for the viewOnly prop,
 * but I'll leave it in for now.
 * 
 * @param {*} props 
 * @returns 
 */
export default function ProjectEditorModal(props) {

    const [projectMembers, setProjectMembers] = useState({ students: [], coaches: [], sponsor: "" })
    const [initialState, setInitialState] = useState({
        project_id: props.project.project_id || "",
        display_name: decode(props.project.display_name) || "",
        title: decode(props.project.title) || "",
        organization: decode(props.project.organization) || "",
        primary_contact: decode(props.project.primary_contact) || "",
        contact_email: props.project.contact_email || "",
        contact_phone: props.project.contact_phone || "",
        attachments: formattedAttachments(props.project) || [],
        background_info: decode(props.project.background_info).replace(/\r\n|\r/g, '\n') || "",
        project_description: decode(props.project.project_description).replace(/\r\n|\r/g, '\n') || "",
        project_scope: decode(props.project.project_scope).replace(/\r\n|\r/g, '\n') || "",
        project_challenges: decode(props.project.project_challenges).replace(/\r\n|\r/g, '\n') || "",
        constraints_assumptions: decode(props.project.constraints_assumptions).replace(/\r\n|\r/g, '\n') || "",
        sponsor_provided_resources: decode(props.project.sponsor_provided_resources).replace(/\r\n|\r/g, '\n') || "",
        project_search_keywords: decode(props.project.project_search_keywords) || "",
        sponsor_deliverables: decode(props.project.sponsor_deliverables).replace(/\r\n|\r/g, '\n') || "",
        proprietary_info: decode(props.project.proprietary_info).replace(/\r\n|\r/g, '\n') || "",
        sponsor_avail_checked: props.project.sponsor_avail_checked || "",
        sponsor_alternate_time: props.project.sponsor_alternate_time || "",
        project_agreements_checked: props.project.project_agreements_checked || "",
        assignment_of_rights: props.project.assignment_of_rights || "",
        team_name: decode(props.project.team_name) || "",
        poster: decode(props.project.poster) || "",
        video: decode(props.project.video) || "",
        website: props.project.website || "",
        synopsis: decode(props.project.synopsis).replace(/\r\n|\r/g, '\n') || "",
        sponsor: decode(props.project.sponsor) || "",
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
                            projectMemberOptions.students.push({ key: member.system_id, text: `${member.lname}, ${member.fname} (${member.system_id})`, value: member.system_id });
                            projectGroupedValues.students.push(member.system_id);
                            break;
                        case USERTYPES.COACH:
                            if (props.viewOnly) {
                                projectMemberOptions.coaches.push({ key: member.system_id, text: `${member.lname}, ${member.fname} (${member.system_id})`, value: member.system_id });
                            }
                            projectGroupedValues.coaches.push(member.system_id);
                            break;
                        default:
                            console.error(`Project editor error - invalid project member type "${member.type}" for member: `, member);
                            break;
                    }
                });
                setInitialState((prevInitialState) => {
                    return {
                        ...prevInitialState,
                        projectStudents: projectGroupedValues.students,
                        projectCoaches: projectGroupedValues.coaches,
                    }
                });
                setProjectMembers(projectMemberOptions);
            })
        SecureFetch(`${config.url.API_GET_PROJECT_SPONSOR}?project_id=${props.project?.project_id}`)
            .then(response => response.json())
            .then(sponsor => {
                let noSponsMembers = projectMembers;
                noSponsMembers.sponsor = sponsor;
                setProjectMembers(noSponsMembers)
            })


            }, [props.project, props.viewOnly])

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
            type: "textArea",
            label: "background_info",
            placeHolder: "background_info",
            name: "background_info",
        },
        {
            type: "textArea",
            label: "project_description",
            placeHolder: "project_description",
            name: "project_description",
        },
        {
            type: "textArea",
            label: "project_scope",
            placeHolder: "project_scope",
            name: "project_scope",
        },
        {
            type: "textArea",
            label: "project_challenges",
            placeHolder: "project_challenges",
            name: "project_challenges",
        },
        {
            type: "textArea",
            label: "constraints_assumptions",
            placeHolder: "constraints_assumptions",
            name: "constraints_assumptions",
        },
        {
            type: "textArea",
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
            type: "textArea",
            label: "sponsor_deliverables",
            placeHolder: "sponsor_deliverables",
            name: "sponsor_deliverables",
        },
        {
            type: "textArea",
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
            type: "textArea",
            label: "synopsis",
            placeHolder: "synopsis",
            name: "synopsis",
        },
        {
            type: "searchDropdown",
            label: "sponsor",
            options: props.viewOnly ? projectMembers.sponsor : props.activeSponsors?.map(sponsor => { return { key: sponsor.sponsor_id, text: `${sponsor.lname}, ${sponsor.fname} (${sponsor.company})`, value: sponsor.sponsor_id } }),
            name: "sponsor",
            disabled: props.viewOnly
        },
        {
            type: "dropdown",
            label: "Semester",
            placeHolder: "Semester",
            name: "semester",
            options: createSemesterDropdownOptions(props.semesterData),
            nullValue: SEMESTER_DROPDOWN_NULL_VALUE,
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
