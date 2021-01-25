import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import SemesterPanel from "./SemesterPanel";

export default function SemesterEditor(props) {
    const [semesters, setSemestersData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/db/getSemesters")
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
                // console.log('semestersData', semestersData);
            })
            .catch((error) => {
                alert("Failed to get semesters data" + error);
            });
    }, []);

    let semesterPanels = [];

    if (semesters) {
        for (let i = 0; i < semesters.length; i++) {
            let semester = semesters[i];
            semesterPanels.push({
                key: semester.semester_id,
                title: semester.name,
                content: {
                    content: <SemesterPanel semester={semester} semesterData={semesters} key={"editSemester-" + i} />,
                },
            });
        }
    }
    let semestersToEdit = <Accordion fluid styled panels={semesterPanels} key={"semestersToEdit"} />;

    return (
        <div>
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
        </div>
    );
}
