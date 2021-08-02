import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../util/constants";
import UsersTab from "./UsersTab";
import UserPanel from "./UserPanel";
import { SecureFetch } from "../util/secureFetch";
import BatchUserPanel from "./BatchUserPanel";

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
    const [semesters, setSemestersData] = useState([]);

    useEffect(() => {
        SecureFetch(config.url.API_GET_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
            })
            .catch((error) => {
                alert("Failed to get semestersData data" + error);
            });
    }, []);

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
                        content: { content: <UsersTab /> },
                    },
                ]}
            />
            <div className="accordion-buttons-container">
                <UserPanel userData={{}} semesterData={semesters} header={`Create user`} />
                <BatchUserPanel />
            </div>
        </div>
    );
}