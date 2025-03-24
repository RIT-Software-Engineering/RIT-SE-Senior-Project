import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { config, USERTYPES } from '../../util/functions/constants'
import { SecureFetch } from '../../util/functions/secureFetch'
import { formattedAttachments } from './ProjectEditorModal'
import {decode} from 'he'

export default function ProjectViewerModal(props) {

    const [projectMembers, setProjectMembers] = useState({ students: [], coaches: [] })
    const [URL, setURL] = useState("No URL found")

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_PROJECT_MEMBERS}?project_id=${props.project?.project_id}`)
            .then(response => response.json())
            .then(members => {
                let projectGroupedValues = { students: [], coaches: [] };
                members.forEach((member, idx) => {
                    switch (member.type) {
                        case USERTYPES.STUDENT:
                            projectGroupedValues.students.push(`${member.fname} ${member.lname}`);
                            break;
                        case USERTYPES.COACH:
                            projectGroupedValues.coaches.push(`${member.fname} ${member.lname}`);
                            break;
                        default:
                            console.error(`Project editor error - invalid project member type "${member.type}" for member: `, member);
                            break;
                    }
                });
                setProjectMembers(projectGroupedValues);
            })
    }, [props.project?.project_id])

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_ARCHIVE_FROM_PROJECT}?project_id=${props.project?.project_id}`)
            .then(response => response.json())
            .then(archives => {
                if (archives.length > 0) {
                    if (archives[0].url_slug != null && archives[0].url_slug != ""){
                        setURL(archives[0].url_slug);
                    }
                }
            });
    }, [props.project?.project_id])

    const generateModalContent = () => {
        return <>
            <style>
                {`
                #gfg {
                    overflow-x: auto;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                `}
            </style>
            <h3>Team members</h3>
            <b>Students:</b> {projectMembers.students?.join(",")} <br />
            <b>Coaches:</b> {projectMembers.coaches?.join(",")} <br />

            <h3>Website</h3>
            <b>URL:</b> {URL} <br />

            <h3>Sponsor Info</h3>
            <b>Organization:</b> {decode(props.project.organization||'')} <br />
            <b>Primary Contact:</b> {decode(props.project.primary_contact||'')} <br />
            <b>Email:</b> {decode(props.project.contact_email||'')} <br />
            <b>Phone:</b> {decode(props.project.contact_phone||'')} <br />

            <h3>Project Info</h3>
            <pre style={{overflowX:'auto', whiteSpace:'pre-wrap', wordWrap:'break-word'}}>
            <b>Original Submission Date:</b><br /> {decode(props.project.submission_datetime||'')}<br /><br />
            <b>Background info:</b><br /> {decode(props.project.background_info||'')}<br /><br />
            <b>Description:</b><br /> {decode(props.project.project_description||'')}<br /><br />
            <b>Scope:</b><br /> {decode(props.project.project_scope||'')}<br /><br />
            <b>Challenges:</b><br /> {decode(props.project.project_challenges||'')}<br /><br />
            <b>Constraints & Assumptions:</b><br /> {decode(props.project.constraints_assumptions||'')}<br /><br />
            <b>Provided Resources:</b><br /> {decode(props.project.sponsor_provided_resources||'')}<br /><br />
            <b>Search keywords:</b><br /> {decode(props.project.project_search_keywords||'')}<br /><br />
            <b>Deliverables:</b><br /> {decode(props.project.sponsor_deliverables||'')}<br /><br />
            <b>Proprietary Info:</b><br /> {decode(props.project.proprietary_info||'')}<br /><br />
            <b>Sponsor Available: </b>{decode(props.project.sponsor_avail_checked) === "on" ? "Yes" : "No"}<br />
            <b>Assignment of Rights: </b>{decode(props.project.assignment_of_rights||'')}<br />
            <b>Semester: </b>{decode(props.semesterMap[props.project.semester]||'')}<br />
            <b>Status: </b>{decode(props.project.status||'')}<br />
            </pre>

            <h3>Attachments</h3>
            {props.project.attachments ? formattedAttachments(props.project)?.map(file => {
                return <><a target="_blank" rel="noreferrer" href={file.link}>{file.title}</a><br /></>
            }) : <p>No Attachments</p>} <br />


        </>
    }
    return (
        <Modal className={"sticky"}
            trigger={<Button icon="eye" />}
            header={`Viewing "${props.project.display_name || props.project.title}"`}
            content={{ content: generateModalContent() }}
            actions={[{ key: "Close", content: "Close" }]}
        />
    )
}
