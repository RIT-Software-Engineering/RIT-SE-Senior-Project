import React, { useEffect, useState } from "react";
import { Accordion, Button, Icon } from "semantic-ui-react";
import { config } from "../util/constants";
import UserTable from "./UserTable";
import UsersTab from "./UsersTab";
import UserPanel from "./UserPanel";

/**
 * This is the shell for the Users accordion
 * Adds a plus button for user creation
 * 
 * This currently "works". You can add a user but all fields must be filled out.
 * The workaround for this is editing, a lot of work needs to be done on both fronts though
 * @param {*} props 
 * @returns 
 */
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
    semesterPanels.push(<UsersTab/>)

    const onAdd = () => {
        //todo 
        alert("Empty User Modal");
    }

    //the empty user panel should trigger user creation
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
                <UserPanel userData={{}} semesterData={semesters}/>
            </div>
        </div>
    );
}