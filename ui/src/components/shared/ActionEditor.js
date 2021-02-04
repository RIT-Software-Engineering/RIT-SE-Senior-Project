import React, { useEffect, useState } from "react";
import ActionPanel from "./ActionPanel";
import { Accordion } from "semantic-ui-react";

export default function ActionEditor() {
    const [actions, setActionsData] = useState([]);
    const [semesters, setSemestersData] = useState([]);

    const getActionsRoute = "http://localhost:3001/db/getActions";
    const getSemestersRoute = "http://localhost:3001/db/getSemesters";
    
    useEffect(() => {
        fetch(getActionsRoute)
            .then((response) => response.json())
            .then((actionsData) => {
                setActionsData(actionsData);
            })
            .catch((error) => {
                alert("Failed to get actionss data" + error);
            });
        fetch(getSemestersRoute)
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
            semesterMap[actionData.name].push(
                <Accordion
                    fluid
                    styled
                    panels={[
                        {
                            key: actionData.action_id,
                            title: actionData.action_title,
                            content: {
                                content: (
                                    <ActionPanel
                                        actionData={actionData}
                                        semesterData={semesters}
                                        key={"editAction-" + i}
                                    />
                                ),
                            },
                        },
                    ]}
                    key={"editingTheAction-" + i}
                />
            );
        }
        for (const [key, value] of Object.entries(semesterMap)) {
            semesterPanels.push(
                <Accordion
                    fluid
                    styled
                    panels={[
                        {
                            key: "actionEditor-semester-selector-" + key,
                            title: key,
                            content: { content: value },
                        },
                    ]}
                />
            );
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
