import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";
import SemesterCoaches from "./SemesterCoaches";

export default function CoachesTab() {

    const [semesters, setSemestersData] = useState([]);
    const [coachInfo, setCoachInfoData] = useState([]);

    useEffect(() => {
        SecureFetch(config.url.API_GET_ACTIVE_SEMESTERS)
        .then((response) => response.json())
        .then((semestersData) => {
            setSemestersData(semestersData);
        })
        .catch((error) => {
            alert("Failed to get semestersData data" + error);
        });
    }, [])

    useEffect(() => {
        SecureFetch(config.url.API_GET_ALL_COACH_INFO)
        .then((response) => response.json())
        .then((coachInfo) => {
            coachInfo.map(coach => {
                coach.projects = JSON.parse(coach.projects);
                return coach;
            });
            setCoachInfoData(coachInfo);
        })
        .catch((error) => {
            alert("Failed to get coachInfo data" + error);
        });
    }, [])


    const mapCoachesToSemesters = () => {
        let toReturn = {Unassigned: []}
        if(!!coachInfo && !!semesters) {
            coachInfo.forEach(coach => {
                if(coach.projects) {
                    coach.projects.forEach(project => {
                        if(!toReturn[project.semester_id]) {
                            toReturn[project.semester_id] = [];
                        }
                        toReturn[project.semester_id].push(coach)
                    });
                } else {
                    toReturn['Unassigned'].push(coach)
                }
            })
        }
        return toReturn
    }

    const mappedCoachData = mapCoachesToSemesters();

    return (
        <div>
            {semesters.map(semester => {
                return <Accordion
                    fluid
                    styled
                    key={semester.semester_id}
                    panels={[
                        {
                            key: semester.semester_id,
                            title: semester.name,
                            content: { content: <SemesterCoaches coaches={mappedCoachData && mappedCoachData[semester.semester_id]}/> },
                        },
                    ]}
                />
            })}
            <Accordion
                    fluid
                    styled
                    panels={[
                        {
                            key: "Unassigned",
                            title: "Unassigned",
                            content: { content: <SemesterCoaches coaches={mappedCoachData && mappedCoachData["Unassigned"]}/> },
                        },
                    ]}
            />
        </div>
    )
}
