import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../util/constants";
import UsersTab from "./UsersTab";
import UserPanel from "./UserPanel";
import { SecureFetch } from "../util/secureFetch";

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
        SecureFetch(config.url.API_GET_USERS)
            .then((response) => response.json())
            .then((userData) => {
                setUserData(userData);
            })
            .catch((error) => {
                alert("Failed to get user data" + error);
            });
        SecureFetch(config.url.API_GET_SEMESTERS)
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
                <UserPanel userData={{}} semesterData={semesters} header={`Create user`} />
            </div>
        </div>
    );
}