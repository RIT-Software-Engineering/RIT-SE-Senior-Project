import React, { useEffect, useState } from "react";
import { Accordion, Icon } from "semantic-ui-react";
import { config } from "../../util/functions/constants";
import { SecureFetch } from "../../util/functions/secureFetch";
import SemesterCoaches from "./SemesterCoaches";
import _ from "lodash";
import { isSemesterActive } from "../../util/functions/utils";

export default function CoachesTab() {

    const [semesters, setSemestersData] = useState([]);
    const [active, setActive] = useState({})
    const [coachInfo, setCoachInfoData] = useState([]);

    useEffect(() => {
        SecureFetch(config.url.API_GET_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                const sortedSemesterData = _.sortBy(semestersData, ["end_date", "start_date", "name"]).reverse();
                setSemestersData(sortedSemesterData);
                let initialActive = {};
                sortedSemesterData.forEach(semester => {
                    initialActive[semester.semester_id] = isSemesterActive(semester.start_date, semester.end_date);
                })
                setActive(initialActive);
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

        let mappedCoaches = { Unassigned: [] }
        let mappedEmails = { Unassigned: [] }

        if (!!coachInfo && !!semesters) {
            coachInfo.forEach(coach => {
                if (coach.projects) {
                    coach.projects.forEach(project => {
                        if (!mappedCoaches[project.semester_id]) {
                            mappedCoaches[project.semester_id] = [];
                            mappedEmails[project.semester_id] = [];
                        }
                        if (!mappedCoaches[project.semester_id].includes(coach)) {
                            mappedCoaches[project.semester_id].push(coach);
                            mappedEmails[project.semester_id].push(coach.email);
                        }
                    });
                } else {
                    mappedCoaches['Unassigned'].push(coach)
                    mappedEmails['Unassigned'].push(coach.email);
                }
            })
        }
        return [mappedCoaches, mappedEmails];
    }

    const [mappedCoachData, mappedEmailData] = mapCoachesToSemesters();

    return (
        <div >
            <div className="accordion-button-group">
                <Accordion
                    fluid
                    styled
                    defaultActiveIndex={0}
                    panels={[
                        {
                            key: "Unassigned",
                            title: "Unassigned",
                            content: { content: <SemesterCoaches coaches={mappedCoachData && mappedCoachData["Unassigned"]} /> },
                        },
                    ]}
                />
                <div className="accordion-buttons-container">
                    <a
                        href={`mailTo:${mappedEmailData["Unassigned"].join(",")}`}
                        className="ui icon button"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Icon name="mail" />
                    </a>
                </div>
            </div>
            {semesters.map(semester => {
                return mappedCoachData[semester.semester_id] &&
                    <div key={semester.semester_id} className="accordion-button-group">
                        <Accordion
                            fluid
                            styled
                            key={semester.semester_id}
                            onTitleClick={() => {
                                setActive({ ...active, [semester.semester_id]: !active[semester.semester_id] })
                            }}
                            panels={[
                                {
                                    key: semester.semester_id,
                                    title: semester.name,
                                    active: active[semester.semester_id],
                                    content: { content: <SemesterCoaches coaches={mappedCoachData && mappedCoachData[semester.semester_id]} semesterId={semester.semester_id} /> },
                                },
                            ]}
                    />
                    <div className="accordion-buttons-container">
                        <a
                            href={`mailTo:${mappedEmailData[semester.semester_id].join(",")}`}
                            className="ui icon button"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Icon name="mail" />
                        </a>
                    </div>
                </div>
            })}
        </div>
    )
}
