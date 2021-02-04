import React, { useEffect, useState } from "react";
import Proposals from "./Proposals";

export default function ProposalTable() {
    const [proposalData, setProposalData] = useState([]);

    useEffect(() => {
        // TODO: Do pagination
        fetch("http://localhost:3001/db/getProjects?type=proposal")
            .then((response) => response.json())
            .then((proposals) => {
                setProposalData(proposals);
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            });
    }, []);

    return <Proposals proposalData={proposalData} />;
}
