import React, { useEffect, useState, useContext } from "react";
import Proposals from "./Proposals";
import { config, USERTYPES } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";
import ProjectEditor from "./ProjectEditor";
import { UserContext } from "../util/UserContext";

export default function ProposalTable(props) {

    const [myProposalData, setMyProposalData] = useState([]);
    const { user } = useContext(UserContext);

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
        {
            user.role !== USERTYPES.ADMIN && <>
                <h3>My Projects:</h3>
                <Proposals viewOnly proposalData={myProposalData} semesterData={props.semesterData} />
                <br />
            </>
        }
        {
            <>
                <h3>All Projects</h3>
                <ProjectEditor semesterData={props.semesterData} viewOnly />
            </>
        }
    </>;
}
