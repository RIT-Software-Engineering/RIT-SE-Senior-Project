import React, { useEffect, useState } from "react";
import Proposals from "./Proposals";
import { config } from "../util/constants";
import { useLocation } from "react-router";
import ProposalsForStudents from "./ProposalsForStudents";

export default function ProposalTable() {
    const [proposalData, setProposalData] = useState([]);

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();
    let role = query.get("role") || "noRole";

    useEffect(() => {
        // TODO: Do pagination
        fetch(`${config.url.API_GET_PROJECTS}?type=proposal`)
            .then((response) => response.json())
            .then((proposals) => {
                setProposalData(proposals);
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            });
    }, []);
    if(role === "student"){

        return <ProposalsForStudents proposalData={proposalData} />;
    }
    return <Proposals proposalData={proposalData} />;
}
