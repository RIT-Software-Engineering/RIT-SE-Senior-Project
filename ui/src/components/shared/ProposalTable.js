import React, { useEffect, useState } from "react";
import Proposals from "./Proposals";
import { config } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";
import ProjectEditor from "./ProjectEditor";

export default function ProposalTable(props) {

    const [myProposalData, setMyProposalData] = useState([]);

    useEffect(() => {
        // TODO: Do pagination
        SecureFetch(config.url.API_GET_MY_PROJECTS)
            .then((response) => response.json())
            .then((proposals) => {
                setMyProposalData(proposals);
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            });
    }, []);

    return <>
        <h3>My Projects:</h3>
        <Proposals viewOnly proposalData={myProposalData} semesterData={props.semesterData} />
        <br />
        <h3>All Projects</h3>
        <ProjectEditor semesterData={props.semesterData} viewOnly />
    </>;
}
