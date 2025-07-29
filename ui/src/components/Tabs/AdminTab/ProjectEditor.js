import React, { useState, useEffect, useContext } from "react";
import { Accordion } from "semantic-ui-react";
import Proposals from "../ProjectsTab/Proposals";
import { config, USERTYPES } from "../../util/functions/constants";
import { SecureFetch } from "../../util/functions/secureFetch";
import { UserContext } from "../../util/functions/UserContext";

/**
 * This is the project accordion builder inside the admin tab.
 * */
export default function ProjectEditor(props) {
  const [proposalData, setProposalData] = useState({});
  const [activeCoaches, setActiveCoaches] = useState([]);
  const [activeSponsors, setActiveSponsors] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const userContext = useContext(UserContext);
  let semesters = {};

  if (!!props.semesterData) {
    semesters = {};
    props.semesterData.forEach(
      (semester) => (semesters[semester.semester_id] = semester),
    );
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
            viewOnlyArchive={props.viewOnlyArchive}
            activeCoaches={activeCoaches}
            activeSponsors={activeSponsors}
            callback={getProjectInformation}
            isAllProjectsView={true}
            userProjects={userProjects}
          />
        );
      });
  };

  const getProjectInformation = () => {
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

    // Get user's projects for permission checking
    SecureFetch(config.url.API_GET_MY_PROJECTS)
      .then((response) => response.json())
      .then((projects) => {
        setUserProjects(projects);
      })
      .catch((error) => {
        console.error("Failed to get user projects:", error);
      });

    SecureFetch(config.url.API_GET_ACTIVE_COACHES)
      .then((response) => response.json())
      .then((coaches) => {
        setActiveCoaches(coaches);
      });

    SecureFetch(config.url.API_GET_ALL_SPONSORS)
      .then((response) => response.json())
      .then((sponsors) => {
        setActiveSponsors(sponsors.sponsors);
      });
  };

  useEffect(() => {
    getProjectInformation();
  }, []);
  /*useEffect(() => {
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
      .then((response) => response.json())
      .then((coaches) => {
        setActiveCoaches(coaches);
      });

    SecureFetch(config.url.API_GET_ALL_SPONSORS)
      .then((response) => response.json())
      .then((sponsors) => {
        setActiveSponsors(sponsors.sponsors);
      });
  }, []);*/

  return props.noAccordion ? (
    content()
  ) : (
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
    />
  );
}
