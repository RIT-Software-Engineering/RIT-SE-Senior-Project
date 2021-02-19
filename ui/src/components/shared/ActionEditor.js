import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../util/constants";
import ActionTable from "./ActionTable";

export default function ActionEditor() {
    const [actions, setActionsData] = useState([]);
    const [semesters, setSemestersData] = useState([]);

    useEffect(() => {
        fetch(config.url.API_GET_ACTIONS)
            .then((response) => response.json())
            .then((actionsData) => {
                setActionsData(actionsData);
            })
            .catch((error) => {
                alert("Failed to get actionss data" + error);
            });
        fetch(config.url.API_GET_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
            })
            .catch((error) => {
                alert("Failed to get semestersData data" + error);
            });
    }, []);

    let semesterPanels = [];
    if (actions) {
        let semesterMap = {};
        for (let i = 0; i < actions.length; i++) {
            let actionData = actions[i];
            if (!semesterMap[actionData.name]) {
                semesterMap[actionData.name] = [];
            }
            semesterMap[actionData.name].push(actionData);
        }
        for (const [, value] of Object.entries(semesterMap)) {
            semesterPanels.push(<ActionTable actions={value} semesterData={semesters} />);
        }
    }

    return (
        <div>
            <Accordion
                fluid
                styled
                panels={[
                    {
                        key: "actionEditor",
                        title: "Action Editor",
                        content: { content: semesterPanels },
                    },
                ]}
            />
        </div>
    );
}
