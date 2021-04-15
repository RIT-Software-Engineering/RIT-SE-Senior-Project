import React, { useState, useEffect } from "react";
import { Accordion, Button, Icon } from "semantic-ui-react";
import Proposals from "./Proposals";
import { config } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";

export default function ProjectEditor() {
    const [proposalData, setProposalData] = useState({});
    const [semesters, setSemestersData] = useState([]);

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
                    />
                );
            });
    };

    useEffect(() => {
        // TODO: Do pagination
        SecureFetch(config.url.API_GET_PROJECTS + "?type=project")
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

        // TODO: This fetch is done in multiple places and is inefficient - Figure out a better method of dealing with getting semester names. Maybe put it in redux?
        SecureFetch(config.url.API_GET_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                const formattedSemesterData = {};
                semestersData.forEach((semester) => (formattedSemesterData[semester.semester_id] = semester));
                setSemestersData(formattedSemesterData);
            })
            .catch((error) => {
                alert("Failed to get semestersData data" + error);
            });
    }, []);

    return (
        <div className="accordion-button-group">
            <Accordion
                fluid
                styled
                panels={[
                    {
                        key: "projectEditor",
                        title: "Project Editor",
                        content: { content: content() },
                    },
                ]}
            />
            <div className="accordion-buttons-container">
                <Button
                    icon
                    onClick={() => {
                        alert("Edit");
                    }}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Icon name="edit" />
                </Button>
                <Button
                    icon
                    onClick={() => {
                        alert("Email");
                    }}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Icon name="mail" />
                </Button>
                <Button icon href={config.url.PROPOSAL_FORM} target="_blank" rel="noreferrer">
                    <Icon name="plus" />
                </Button>
            </div>
        </div>
    );
}
