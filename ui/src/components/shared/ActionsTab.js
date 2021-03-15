import React, { useState, useEffect } from "react";
import { config } from "../util/constants";
import { formatDateTime } from "../util/utils";
import _ from "lodash";
import {
    Accordion,
    Button,
    Divider,
    Icon,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from "semantic-ui-react";

export default function Actions() {
    const [semesterActions, setSemesterActions] = useState({});
    const [semesters, setSemestersData] = useState([]);

    useEffect(() => {
        // TODO: Do pagination
        fetch(config.url.API_GET_ACTIVE_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
            })
            .catch((error) => {
                alert("Failed to get semestersData data" + error);
            });


        fetch(config.url.API_GET_ACTION_LOGS + "?system_id=admin")
            .then((response) => response.json())
            .then((action_logs) => {
                const newSemesterActions = {}
                action_logs.forEach(action => {
                    if(newSemesterActions[action.semester] === undefined) {
                        newSemesterActions[action.semester] = {};
                    }
                    if(newSemesterActions[action.semester][action.project] === undefined) {
                        newSemesterActions[action.semester][action.project] = [action];
                    } else {
                        newSemesterActions[action.semester][action.project].push(action);
                    }
                });
                setSemesterActions(newSemesterActions);
            })
            .catch((error) => {
                alert("Failed to get team files data " + error);
            });
    }, []);

    const viewSubmissionModal = (action) => {
        const formData = {};
        return (
            <Modal
                trigger={
                    <Button icon>
                        <Icon name="eye" />
                    </Button>
                }
                header={"Submission"}
                actions={[{ content: "Done", key: 0 }]}
                content={
                    <div>
                        <h5>Action:</h5> <p>{action.action_title}</p>
                        <h5>Submission Type:</h5> <p>{action.action_target}</p>
                        <h5>Submitted By:</h5> <p>{action.system_id}</p>
                        <h5>Submitted At:</h5> <p>{formatDateTime(action.creation_datetime)}</p>
                        <Divider />
                        <h3>Submission</h3>
                        {Object.keys(formData)?.map((key) => {
                            return (
                                <div>
                                    <h5>{key}:</h5> <p>{formData[key]}</p>
                                </div>
                            );
                        })}
                        {action.files?.split(",").map((file) => {
                            return <><a >{file}</a><br/></>;
                        })}
                    </div>
                }
            />
        );
    };

    const generateTeamActionsTable = (projects) => {
        return projects.map(project => {
            return <React.Fragment key={project.project_id}><h3>{project.project_id}</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Action</TableHeaderCell>
                        <TableHeaderCell>Action Type</TableHeaderCell>
                        <TableHeaderCell>Submitted By</TableHeaderCell>
                        <TableHeaderCell>Submission Time</TableHeaderCell>
                        <TableHeaderCell>Submission</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {project.actions.map((action, idx) => {
                        return (
                            <TableRow key={idx}>
                                <TableCell>{action.action_title}</TableCell>
                                <TableCell>{action.action_target}</TableCell>
                                <TableCell>{action.system_id}</TableCell>
                                <TableCell>{formatDateTime(action.creation_datetime)}</TableCell>
                                <TableCell>{viewSubmissionModal(action)}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table></React.Fragment>
        })
    }

    let groupedSemesters = [];

    if(!!semesters && !!semesterActions) {
        const sortedSemesters = _.sortBy(semesters, ["end_date"]).reverse();
        sortedSemesters.forEach((semesterData, idx) => {
            if(Object.keys(semesterActions).includes(semesterData.semester_id.toString())) {
                let projects = [];
                Object.keys(semesterActions[semesterData.semester_id]).forEach(project_id => {
                    projects.push({project_id: project_id, actions: _.sortBy(semesterActions[semesterData.semester_id][project_id], ["creation_datetime"])})
                })
                groupedSemesters.push({semesterData: semesterData, projects: projects});
            }
        })
    }

    return (
        <>
            {groupedSemesters.length === 1? generateTeamActionsTable(groupedSemesters[0].projects) : groupedSemesters.map((semester) => {
                // If semester end date is in the future, open accordion by default
                const activeIndex = new Date(semester.semesterData.end_date) >= new Date() ? 0 : -1;
                return <Accordion
                    fluid
                    styled
                    defaultActiveIndex={activeIndex}
                    key={semester.semesterData.semester_id}
                    panels={[{
                        key: semester.semesterData.semester_id,
                        title: semester.semesterData.name,
                        content: {content: generateTeamActionsTable(semester.projects)}
                    },]}
                />
            })}
        </>
    );
}
