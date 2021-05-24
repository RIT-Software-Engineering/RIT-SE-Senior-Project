import React, { useEffect, useState } from "react";
import { Accordion, Button, Icon } from "semantic-ui-react";
import { config } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";
// import ActionModal from "./ActionModal";
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
                alert("Failed to get actionss data" + error);
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
            semesterPanels.push(<ActionTable actions={value} semesterData={props.semesterData} />);
        }
    }

    const onAdd = () => {
        // return <ActionModal />;
        //todo
        alert("Blank Action Modal");
    };

    return (
        <div className="accordion-button-group">
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
            <div className="accordion-buttons-container">
                <Button
                    icon
                    onClick={() => {
                        onAdd();
                    }}
                >
                    <Icon name="plus" />
                </Button>
            </div>
        </div>
    );
}
