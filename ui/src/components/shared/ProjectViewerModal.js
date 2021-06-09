import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { config, USERTYPES } from '../util/constants'
import { SecureFetch } from '../util/secureFetch'
import { formattedAttachments } from './ProjectEditorModal'

export default function ProjectViewerModal(props) {

    const [projectMembers, setProjectMembers] = useState({ students: [], coaches: [] })

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_PROJECT_MEMBERS}?project_id=${props.project?.project_id}`)
            .then(response => response.json())
            .then(members => {
                let projectGroupedValues = { students: [], coaches: [] };
                members.forEach(member => {
                    switch (member.type) {
                        case USERTYPES.STUDENT:
                            projectGroupedValues.students.push(`${member.fname} ${member.lname}, `);
                            break;
                        case USERTYPES.COACH:
                            projectGroupedValues.coaches.push(`${member.fname} ${member.lname}, `);
                            break;
                        default:
                            console.error(`Project editor error - invalid project member type "${member.type}" for member: `, member);
                            break;
                    }
                });
                setProjectMembers(projectGroupedValues);
            })
    }, [props.project?.project_id])

    const generateModalContent = () => {
        return <>
            <h3>Team members</h3>
            <b>Students:</b> {projectMembers.students} <br />
            <b>Coaches:</b> {projectMembers.coaches} <br />

            <h3>Sponsor Info</h3>
            <b>Sponsor:</b> {props.project.sponsor} <br />
            <b>Organization:</b> {props.project.organization} <br />
            <b>Primary Contact:</b> {props.project.primary_contact} <br />
            <b>Email:</b> {props.project.contact_email} <br />
            <b>Phone:</b> {props.project.contact_phone} <br />

            <h3>Project Info</h3>
            <b>Background info:</b> {props.project.background_info} <br />
            <b>Description:</b> {props.project.project_description} <br />
            <b>Scope:</b> {props.project.project_scope} <br />
            <b>Challenges:</b> {props.project.project_challenges} <br />
            <b>Constraints & Assumptions:</b> {props.project.constraints_assumptions} <br />
            <b>Provided Resources:</b> {props.project.sponsor_provided_resources} <br />
            <b>Search keywords (are we showing this?):</b> {props.project.project_search_keywords} <br />
            <b>Deliverables:</b> {props.project.sponsor_deliverables} <br />
            <b>Proprietary Info:</b> {props.project.proprietary_info} <br />
            <b>Sponsor Available:</b> {props.project.sponsor_avail_checked === "on" ? "Yes" : "No"} <br />
            <b>Assignment of Rights:</b> {props.project.assignment_of_rights} <br />
            <b>Semester:</b> {props.semesterMap[props.project.semester]} <br />
            <b>Status:</b> {props.project.status} <br />

            <h3>Final Project Info</h3>
            <b>Poster:</b> {props.project.poster} <br />
            <b>Video:</b> {props.project.video} <br />
            <b>Website:</b> {props.project.website} <br />
            <b>Synopsis:</b> {props.project.synopsis} <br />

            <h3>Attachments</h3>
            {props.project.attachments ? formattedAttachments(props.project)?.map(file => {
                return <><a target="_blank" rel="noreferrer" href={file.link}>{file.title}</a><br /></>
            }) : <p>No Attachments</p>} <br />


        </>
    }

    return (
        <Modal
            trigger={<Button icon="eye" />}
            header={`Viewing "${props.project.display_name || props.project.title}"`}
            content={{ content: generateModalContent() }}
            actions={[{ key: "Done", content: "Done" }]}
        />
    )
}
