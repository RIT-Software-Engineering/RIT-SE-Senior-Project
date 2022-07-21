import DatabaseTableEditor from "../../../shared/editors/DatabaseTableEditor";
import {config, USERTYPES} from "../../../util/functions/constants";
import React, {useEffect, useState} from "react";
import {SecureFetch} from "../../../util/functions/secureFetch";
import {Modal} from "semantic-ui-react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";

export default function ArchivePanel(props){

    const [projectMembers, setProjectMembers] = useState({ students: [], coaches: [], sponsor: "" })

    const assignSponsor = () => {
        //finds the sponsor name inside the list of sponsor objects.
        if(props.activeSponsors !== undefined){
            let sponsorName = props?.activeSponsors.find((sponsyBoi) => sponsyBoi.sponsor_id === props?.project?.sponsor)
            if(sponsorName !== undefined){
                setInitialState((prevInitialState) => {
                    return {
                        ...prevInitialState,
                        sponsor: `${sponsorName.fname} ${sponsorName.lname}`
                    }
                });
            }
        }
    }

    useEffect(() => {
        assignSponsor()
    }, [props.activeSponsors])

    //This is for if creating a new archived project.
    //If there is a newArchive property, then do what's inside the useEffect.
    //It is for filling form data to archive that does not exist.
    useEffect(() => {
        if(props.newArchive) {
            SecureFetch(`${config.url.API_GET_PROJECT_MEMBERS}?project_id=${props.project?.project_id}`)
                .then(response => response.json())
                .then(members => {
                    let projectMemberOptions = {students: [], coaches: []}
                    let projectGroupedValues = {students: [], coaches: []}
                    members.forEach(member => {
                        switch (member.type) {
                            case USERTYPES.STUDENT:

                                projectMemberOptions.students.push({
                                    key: member.system_id,
                                    text: `${member.lname}, ${member.fname} (${member.system_id})`,
                                    value: member.system_id
                                });
                                projectGroupedValues.students.push(` ${member.fname} ${member.lname}`);
                                break;
                            case USERTYPES.COACH:
                                if (props.viewOnly) {
                                    projectMemberOptions.coaches.push({
                                        key: member.system_id,
                                        text: `${member.lname}, ${member.fname} (${member.system_id})`,
                                        value: member.system_id
                                    });
                                }
                                projectGroupedValues.coaches.push(`${member.fname} ${member.lname}`);
                                break;
                            default:
                                console.error(`Project editor error - invalid project member type "${member.type}" for member: `, member);
                                break;
                        }
                    });
                    setInitialState((prevInitialState) => {
                        return {
                            ...prevInitialState,
                            members: projectGroupedValues.students,
                            coach: projectGroupedValues.coaches,
                        }
                    });
                    setProjectMembers(projectMemberOptions);
                })
        }
    }, [props.project, props.newArchive])

    console.log(props?.project)

    const [initialState, setInitialState] = useState({
        featured: props?.project?.featured || "",
        outstanding: props?.project?.outstanding || "",
        creative: props?.project?.creative || "",
        archive_id: props?.project?.archive_id || "",
        project_id: props?.project?.project_id || "",
        title: props?.project?.title || "",
        team_name: props?.project?.team_name || "",
        members: props?.project?.members || "",
        sponsor: props?.activeSponsors || "",
        coach: props?.project?.coach || "",
        poster_thumb: props?.project?.poster_thumb || "",
        poster_full: props?.project?.poster_full || "",
        synopsis: props?.project?.synopsis || "",
        video: props?.project?.video || "",
        name: props?.project?.name || "",
        dept: props?.project?.dept || "",
        start_date: props?.project?.start_date || "",
        end_date: props?.project?.end_date || "",
    });

    let submissionModalMessages = props.create ? {
        SUCCESS: "The archive project has been created.",
        FAIL: "We were unable to add to archive.",
    } : {
        SUCCESS: "The archived project has been Edited.",
        FAIL: "Could not make edits.",
    }

    //TODO JA Make a route to update the archived project.
    let submitRouter = config.url.API_POST_EDIT_ARCHIVE;

    let formFieldArray = [
        {
            type: "input",
            label: "Project ID",
            placeHolder: "Project ID",
            name: "project_id",
            disabled: true
        },
        {
            type: "input",
            label: "Archive Project Title",
            placeHolder: "Archive Project Title",
            name: "title",
        },
        {
            type: "input",
            label: "Team Name",
            placeHolder: "Team Name",
            name: "team_name"
        },
        {
            type: "input",
            label: "Members",
            placeHolder: "Members",
            name: "members"
        },
        {
            type: "input",
            label: "Sponsor",
            placeHolder: "Sponsor",
            name: "sponsor"
        },
        {
            type: "input",
            label: "Coach",
            placeHolder: "Coach",
            name: "coach"
        },
        {
            type: "input",
            label: "Poster Thumb",
            placeHolder: "Poster Thumb",
            name: "poster_thumb"
        },
        {
            type: "input",
            label: "Poster Full",
            placeHolder: "Poster Full",
            name: "poster_full"
        },
        {
            type: "input",
            label: "Synopsis",
            placeHolder: "Synopsis",
            name: "synopsis"
        },
        {
            type: "input",
            label: "Video",
            placeHolder: "Video",
            name: "video"
        },
        {
            type: "input",
            label: "Name",
            placeHolder: "Name",
            name: "name"
        },
        {
            type: "input",
            label: "Department",
            placeHolder: "Department",
            name: "dept"
        },
        {
            type: "date",
            label: "Start Date",
            placeHolder: "Start Date",
            name: "start_date"
        },
        {
            type: "date",
            label: "End Date",
            placeHolder: "End Date",
            name: "end_date"
        },
        {
            type: "checkbox",
            label: "featured",
            placeHolder: "featured",
            name: "featured",
            disabled: false
        },
        {
            type: "checkbox",
            label: "outstanding",
            placeHolder: "outstanding",
            name: "outstanding",
            disabled: false
        },
        {
            type: "checkbox",
            label: "creative",
            placeHolder: "creative",
            name: "creative",
            disabled: false
        }
    ];


    return (
        <DatabaseTableEditor
            initialState={initialState}
            submissionModalMessages={submissionModalMessages}
            submitRoute={submitRouter}
            formFieldArray={formFieldArray}
            header={props.header}
            button={props.buttonIcon || (!!props.create ? "plus" : "edit")}
        />
    );
}