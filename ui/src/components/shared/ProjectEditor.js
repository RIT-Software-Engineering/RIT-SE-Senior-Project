import React, { useState, useEffect } from "react";
import { Accordion } from "semantic-ui-react";
import Proposals from "./Proposals";
import { config } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";

export default function ProjectEditor(props) {
    const [proposalData, setProposalData] = useState({});
    const [activeCoaches, setActiveCoaches] = useState([])
    let semesters = {}

    if (!!props.semesterData) {
        semesters = {};
        props.semesterData.forEach((semester) => (semesters[semester.semester_id] = semester));
    }

    const content = () => {
        return Object.keys(proposalData)
            .sort()
            .reverse()
            .map((semester_id) => {
                return (
                    <Proposals
                        key={semester_id}
                        proposalData={proposalData[semester_id]}
                        semester={semesters[semester_id] || null}
                        semesterData={props.semesterData}
                        viewOnly={props.viewOnly}
                        activeCoaches={activeCoaches}
                    />
                );
            });
    };

    useEffect(() => {
        // TODO: Do pagination
        SecureFetch(config.url.API_GET_PROJECTS)
            .then((response) => response.json())
            .then((proposals) => {
                const groupedProposalData = {};
                proposals.forEach((proposal) => {
                    if (groupedProposalData[proposal.semester]) {
                        groupedProposalData[proposal.semester].push(proposal);
                    } else {
                        groupedProposalData[proposal.semester] = [proposal];
                    }
                });
                setProposalData(groupedProposalData);
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            });

        SecureFetch(config.url.API_GET_ACTIVE_COACHES)
            .then(response => response.json())
            .then(coaches => {
                setActiveCoaches(coaches)
            })
    }, []);

    return props.noAccordion ? content() :
        <Accordion
            fluid
            styled
            panels={[
                {
                    key: "projectEditor",
                    title: props.viewOnly ? "Project Viewer" : "Project Editor",
                    content: { content: content() },
                },
            ]}
        />;
}
