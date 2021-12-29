import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../../../util/functions/constants";
import { SecureFetch } from "../../../util/functions/secureFetch";
import SemesterPanel from "./SemesterPanel";
import SemesterTable from "./SemesterTable";

export default function SemesterEditor() {
    const [semesters, setSemestersData] = useState([]);

    useEffect(() => {
        SecureFetch(config.url.API_GET_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
            })
            .catch((error) => {
                alert("Failed to get semesters data" + error);
            });
    }, []);

    let semestersToEdit = <SemesterTable semesters={semesters} semesterData={semesters}/>;

    return (
        <div className="accordion-button-group">
            <Accordion
                fluid
                styled
                panels={[
                    {
                        key: "semesterEditor",
                        title: "Semester Editor",
                        content: { content: semestersToEdit },
                    },
                ]}
            />
            <div className="accordion-buttons-container">
                <SemesterPanel header="Create Semester" />
            </div>
        </div>
    );
}
