import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../../../util/functions/constants";
import { SecureFetch } from "../../../util/functions/secureFetch";
import ActionPanel from "./ActionPanel";
import ActionTable from "./ActionTable";

export default function ActionEditor(props) {
  const [actions, setActionsData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const getActionData = () => {
    SecureFetch(config.url.API_GET_ACTIONS)
      .then((response) => response.json())
      .then((actionsData) => {
        setActionsData(actionsData);
      })
      .catch((error) => {
        setActionsData([]); //unable to get actions, semester is null
        alert(
          "Failed to get actions data " +
            error +
            " \n No actions will be displayed",
        );
      });
  };

  const getProjectData = () => {
    SecureFetch(config.url.API_GET_PROJECTS)
      .then((response) => response.json())
      .then((projectData) => {
        setProjectData(projectData);
      })
      .catch((error) => {
        setProjectData([]); // unable to get projects
        console.log("Failed to get projects ", error);
      });
  };

  useEffect(() => {
    getActionData();
    getProjectData();
  }, []);

  let semesterPanels = [];
  if (actions) {
    let semesterMap = {};
    for (let i = 0; i < actions.length; i++) {
      let actionData = actions[i];
      if (!semesterMap[actionData.semester]) {
        semesterMap[actionData.semester] = [];
      }
      semesterMap[actionData.semester].push(actionData);
    }
    for (const [key, value] of Object.entries(semesterMap)) {
      semesterPanels.push(
        <ActionTable
          autoLoadSubmissions
          key={key}
          actions={value}
          semesterData={props.semesterData}
          projectData={projectData}
          callback={getActionData}
        />,
      );
    }
  }

  return (
    <div className="accordion-button-group">
      <Accordion
        fluid
        styled
        panels={[
          {
            key: "actionEditor",
            title: "Action / Announcement / Peer Eval / Break Period",
            content: { content: semesterPanels },
          },
        ]}
      />
      <div className="accordion-buttons-container">
        <ActionPanel
          semesterData={props.semesterData}
          header={"New Action / Announcement / Peer Eval / Break Period"}
          create={true}
          key={"createAction"}
          callback={getActionData}
          isOpenCallback={(isOpen) => setIsOpen(isOpen)} // Pass the isOpenCallback prop
        />
      </div>
    </div>
  );
}
