import React, { useEffect, useState } from "react";
import { Accordion, Button, Icon } from "semantic-ui-react";
import { config } from "../util/constants";
import SemesterTable from "./SemesterTable";

export default function SemesterEditor(props) {
    const [semesters, setSemestersData] = useState([]);
    
    useEffect(() => {
        fetch(config.url.API_GET_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
            })
            .catch((error) => {
                alert("Failed to get semesters data" + error);
            });
    }, []);

    let semestersToEdit = <SemesterTable semesters={semesters} semesterData={semesters}/>;

    const onAdd = () => {
        //todo 
        alert("Empty Semester Modal");
    }
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
