import React, { useEffect, useState, useContext } from "react";
import Proposals from "./Proposals";
import { config, USERTYPES } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";
import ProjectEditor from "./ProjectEditor";
import { UserContext } from "../util/UserContext";

export default function ProjectsTab(props) {

    const [myProposalData, setMyProposalData] = useState([]);
    const [candidateProjects, setCandidateProjects] = useState([]);
    const userContext = useContext(UserContext);

    console.log("myProposalData", myProposalData);
    console.log("candidateProjects", candidateProjects);

    useEffect(() => {
        // TODO: Do pagination
        SecureFetch(config.url.API_GET_MY_PROJECTS)
            .then((response) => response.json())
            .then((proposals) => {
                setMyProposalData(proposals);
                // Only load candidate projects if student and don't have a project
                if (proposals.length === 0 && userContext.user?.role === USERTYPES.STUDENT) {
                    SecureFetch(config.url.API_GET_CANDIDATE_PROJECTS)
                        .then((response) => response.json())
                        .then(projects => {
                            setCandidateProjects(projects);
                        })
                }
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            });
    }, []);

    return <>
        {candidateProjects.length > 0 ? <>
            <h3>Candidate Projects:</h3>
            <Proposals noAccordion viewOnly proposalData={candidateProjects} semesterData={props.semesterData} />
            <br />
        </> : <>
            <h3>My Projects:</h3>
                <Proposals noAccordion viewOnly proposalData={myProposalData} semesterData={props.semesterData} />
            <br />
        </>}
        {userContext.user?.role !== USERTYPES.STUDENT && <>
            <h3>All Projects</h3>
            <ProjectEditor noAccordion semesterData={props.semesterData} />
        </>}
    </>;
}
