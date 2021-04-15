import React, { useEffect, useState } from "react";
import { Accordion, Button, Icon } from "semantic-ui-react";
import { config } from "../util/constants";
import UserTable from "./UserTable";

export default function UserEditor(props) {
    const [users, setUserData] = useState([]);
    const [semesters, setSemestersData] = useState([]);

    useEffect(() => {
        fetch(config.url.API_GET_USERS)
            .then((response) => response.json())
            .then((userData) => {
                setUserData(userData);
            })
            .catch((error) => {
                alert("Failed to get user data" + error);
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
    if (users) {
        let semesterMap = {};
        for (let i = 0; i < users.length; i++) {
            let userData = users[i];
            if (!semesterMap[userData.user_id]) {
                semesterMap[userData.user_id] = [];
            }
            semesterMap[userData.user_id].push(userData);
        }
        for (const [, value] of Object.entries(semesterMap)) {
            semesterPanels.push(<UserTable users={value} semesterData={semesters} />);
        }
    }

    const onAdd = () => {
        //todo 
        alert("Empty User Modal");
    }

    return (
        <div className="accordion-button-group">
            <Accordion
                fluid
                styled
                panels={[
                    {
                        key: "userEditor",
                        title: "Users",
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