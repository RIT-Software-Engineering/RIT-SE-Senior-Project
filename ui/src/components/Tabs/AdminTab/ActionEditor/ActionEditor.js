import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../../../util/functions/constants";
import { SecureFetch } from "../../../util/functions/secureFetch";
import ActionPanel from "./ActionPanel";
import ActionTable from "./ActionTable";

export default function ActionEditor(props) {
    const [actions, setActionsData] = useState([]);

    useEffect(() => {
        SecureFetch(config.url.API_GET_ACTIONS)
            .then((response) => response.json())
            .then((actionsData) => {
                setActionsData(actionsData);
            })
            .catch((error) => {
                alert("Failed to get actions data" + error);
            });
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
            semesterPanels.push(<ActionTable key={key} actions={value} semesterData={props.semesterData} />);
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
                        title: "Action and Announcement Editor",
                        content: { content: semesterPanels },
                    },
                ]}
            />
            <div className="accordion-buttons-container">
                <ActionPanel
                    semesterData={props.semesterData}
                    header={"Create Action/Announcement"}
                    create={true}
                    key={"createAction"}
                />
            </div>
        </div>
    );
}
