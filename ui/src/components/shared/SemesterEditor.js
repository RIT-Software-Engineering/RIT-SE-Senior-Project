import React from "react";
import {Accordion} from "semantic-ui-react";
import SemesterPanel from "./SemesterPanel";

export default function SemesterEditor(props) {

    let semesterPanels = [];

    if(props.semesters){
        for(let i = 0; i < props.semesters.length; i ++){
            let semesterData = props.semesters[i];
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