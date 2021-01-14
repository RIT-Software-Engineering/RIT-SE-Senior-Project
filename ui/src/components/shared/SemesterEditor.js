import React from "react";
import {Accordion} from "semantic-ui-react";
import SemesterPanel from "./SemesterPanel";

export default function SemesterEditor(props) {

    let semesterPanels = [];

    for(let i = 0; i < props.semesters.length; i ++){
        let semesterData = props.semesters[i];
        semesterPanels.push({
            key: semesterData.semester_id,
            title: semesterData.name,
            content: {
                content: <SemesterPanel {...semesterData}/>
            }
        })
    }

return(
    <div>
        <Accordion fluid styled panels={semesterPanels} key={'semesterEditor'} />
    </div>
);

}