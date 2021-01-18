import React, {useEffect, useState} from "react";
import {Accordion} from "semantic-ui-react";
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
            })
    }, []);

        let semesterPanels = [];

    if(semesters){
        for(let i = 0; i < semesters.length; i ++){
            let semesterData = semesters[i];
            semesterPanels.push({
                key: semesterData.semester_id,
                title: semesterData.name,
                content: {
                    content: <SemesterPanel {...semesterData} key={'editSemester-' + i}/>
                }
            })
        }
    }
    let semestersToEdit = (<Accordion fluid styled panels={semesterPanels} key={'semestersToEdit'} />);

return(
    <div>
        <Accordion fluid styled panels={[{
            key: 'semesterEditor',
            title: 'Semester Editor',
            content: {content:semestersToEdit}
        }]}
        />
    </div>
);

}