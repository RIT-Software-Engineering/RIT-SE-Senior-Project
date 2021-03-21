import React, { useEffect, useState } from "react";
import Proposals from "./Proposals";
import { config } from "../util/constants";

export default function ProposalTable() {
    const [proposalData, setProposalData] = useState([]);

    useEffect(() => {
        // TODO: Do pagination
        fetch(`${config.url.API_GET_PROJECTS}&type=proposal`)
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
