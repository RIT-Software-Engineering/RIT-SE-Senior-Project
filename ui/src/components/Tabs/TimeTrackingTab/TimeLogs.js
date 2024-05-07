import React, { useState, useEffect, useContext } from 'react';
import { Accordion } from "semantic-ui-react";
import { formatDateTime, formatDate } from "../../util/functions/utils";
import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Icon,
} from "semantic-ui-react";
import SubmissionViewerModal from "../DashboardTab/TimelinesView/Timeline/SubmissionViewerModal";
import { SecureFetch } from '../../util/functions/secureFetch';
import { config, USERTYPES } from '../../util/functions/constants';
import { UserContext } from "../../util/functions/UserContext";
import TimeLogPanel from "./TimeLogPanel";
import TimeLogDelete from "./TimeLogDelete";

const LOGS_PER_PAGE = 50;

export default function TimeLogs(props) {
    const newData = {};
    const time = 0;
    const semesterMap = {};
    props.semesterData.forEach(semester => semesterMap[semester.semester_id] = semester);
    const [actionLogs, setActionLogs] = useState([]);
    const [actionLogCount, setActionLogCount] = useState(LOGS_PER_PAGE);
    const [timeLogs, setTimeLogs] = useState([]);
    const [timeLogCount, setTimeLogCount] = useState(LOGS_PER_PAGE);
    const [timeStats, setTimeStats] = useState([]);
    const userContext = useContext(UserContext)
    const prevLogin = new Date(userContext.user.prev_login);

    const getPaginationData = (page) => {
        SecureFetch(`${config.url.API_GET_ALL_ACTION_LOGS}/?resultLimit=${LOGS_PER_PAGE}&offset=${LOGS_PER_PAGE * page}`)
            .then((response) => response.json())
            .then((action_logs) => {
                setActionLogs(action_logs.actionLogs);
                setActionLogCount(action_logs.actionLogCount);
            })
            .catch((error) => {
                alert("Failed to get action log data " + error);
            });
    }

    const getTimeData = (page) => {
        SecureFetch(`${config.url.API_GET_ALL_TIME_LOGS}/?resultLimit=${LOGS_PER_PAGE}&offset=0`)
            .then((response) => response.json())
            .then((time_logs) => {
                setTimeLogs(time_logs.timeLogs);
                setTimeLogCount(time_logs.timeLogCount);
                var users = [];
                for (var i = 0; i < time_logs.timeLogs.length; i++){
                    var timeLog = time_logs.timeLogs[i]
                    if (!users.includes(timeLog.name)){
                        users.push(timeLog.name);
                    }
                }
                var userStats = [];
                for (var i = 0; i < users.length; i++){
                    var userTotal = time_logs.timeLogs.filter(log => log.name == users[i]).map(log=>log.time_amount).reduce((a,b)=>a+b);
                    var uProject = time_logs.timeLogs.filter(log => log.name == users[i])[0].project;
                    var sysid = time_logs.timeLogs.filter(log => log.name == users[i])[0].system_id;
                    userStats.push({name: users[i], total: userTotal, lastWeek: 4, thisWeek: 2, project: uProject, system_id: sysid});
                }
                setTimeStats(userStats);
            })
            .catch((error) => {
                alert("Failed to get time log data " + error);
            });
    }

    useEffect(() => {
        getPaginationData(0);
    }, [])
    useEffect(() => {
        getTimeData(0);
    }, [])
    return (
        //TODO FULLY INTEGRATE DATABASE
        <>
            <h3>Time Logging</h3>
            <div>
                <div className="accordion-button-group">
                    <Accordion
                        fluid
                        styled
                        defaultActiveIndex={0}
                        panels={[
                            {
                                key: "Semester Here",
                                title: "2021-21 Spring / Summer",
                                content: {
                                    content: <div className="accordion-button-group">
                                        <Accordion
                                            fluid
                                            styled
                                            defaultActiveIndex={0}
                                            panels={[
                                                {
                                                    key: "Project Here",
                                                    title: "Overall Time Commitment",
                                                    content: {
                                                        content: <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHeaderCell>Name</TableHeaderCell>
                                                                    <TableHeaderCell>Time (hrs)</TableHeaderCell>
                                                                    <TableHeaderCell>Date Range</TableHeaderCell>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {timeLogs?.filter(log => log.project == '2021-5-14_da90mGtCgojqWElAItowB').map((timeLog, idx) => {
                                                                    let submittedBy = `${timeLog.name} (${timeLog.system_id})`;
                                                                    if (timeLog.mock_id) {
                                                                        submittedBy = `${timeLog.mock_name} (${timeLog.mock_id}) as ${timeLog.name} (${timeLog.system_id})`
                                                                    }
                                                                    let showNewSubmissionHighlight = new Date(timeLog.submission_datetime) > prevLogin;
                                                                    return (

                                                                        <TableRow style={{background: showNewSubmissionHighlight? '#fffaf3' : 'none', fontWeight: showNewSubmissionHighlight? 'bold': 'none'}} key={idx}>

                                                                            <TableCell>{submittedBy}</TableCell>
                                                                            <TableCell>{formatDate(timeLog.work_date)}</TableCell>
                                                                            <TableCell>{ time}</TableCell>

                                                                            <TableCell>
                                                                                <div className="accordion-buttons-container">
                                                                                    <TimeLogDelete header="Delete log? (This action cannot be undone)" />
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    },
                                                },
                                                {
                                                    key: "Project Here",
                                                    title: " This Week March 6  - March 7",
                                                    content: {
                                                        content: <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHeaderCell>Name</TableHeaderCell>
                                                                    <TableHeaderCell>Date</TableHeaderCell>
                                                                    <TableHeaderCell>Time (hrs)</TableHeaderCell>
                                                                    <TableHeaderCell>Comment</TableHeaderCell>
                                                                    <TableHeaderCell>Submission Date</TableHeaderCell>
                                                                    <TableHeaderCell>Delete</TableHeaderCell>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {timeLogs?.filter(log => log.project == '2021-5-14_da90mGtCgojqWElAItowB').map((timeLog, idx) => {
                                                                    let submittedBy = `${timeLog.name} (${timeLog.system_id})`;
                                                                    if (timeLog.mock_id) {
                                                                        submittedBy = `${timeLog.mock_name} (${timeLog.mock_id}) as ${timeLog.name} (${timeLog.system_id})`
                                                                    }
                                                                    let showNewSubmissionHighlight = new Date(timeLog.submission_datetime) > prevLogin;
                                                                    return (

                                                                        <TableRow style={{background: showNewSubmissionHighlight? '#fffaf3' : 'none', fontWeight: showNewSubmissionHighlight? 'bold': 'none'}} key={idx}>

                                                                            <TableCell>{submittedBy}</TableCell>
                                                                            <TableCell>{formatDate(timeLog.work_date)}</TableCell>
                                                                            <TableCell>{timeLog.time_amount}</TableCell>
                                                                            <TableCell>{timeLog.work_comment}</TableCell>
                                                                            <TableCell>{formatDateTime(timeLog.submission_datetime)}</TableCell>
                                                                            <TableCell>
                                                                                <div className="accordion-buttons-container">
                                                                                    <TimeLogDelete header="Delete log? (This action cannot be undone)" />
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    },
                                                },{
                                                    key: "Project Here",
                                                    title: " Completed Weeks",
                                                    content: {
                                                        content: <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHeaderCell>Name</TableHeaderCell>
                                                                    <TableHeaderCell>Date</TableHeaderCell>
                                                                    <TableHeaderCell>Time (hrs)</TableHeaderCell>
                                                                    <TableHeaderCell>Comment</TableHeaderCell>
                                                                    <TableHeaderCell>Submission Date</TableHeaderCell>
                                                                    <TableHeaderCell>Delete</TableHeaderCell>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {timeLogs?.filter(log => log.project == '2021-5-14_da90mGtCgojqWElAItowB').map((timeLog, idx) => {
                                                                    let submittedBy = `${timeLog.name} (${timeLog.system_id})`;
                                                                    if (timeLog.mock_id) {
                                                                        submittedBy = `${timeLog.mock_name} (${timeLog.mock_id}) as ${timeLog.name} (${timeLog.system_id})`
                                                                    }
                                                                    let showNewSubmissionHighlight = new Date(timeLog.submission_datetime) > prevLogin;
                                                                    return (

                                                                        <TableRow style={{background: showNewSubmissionHighlight? '#fffaf3' : 'none', fontWeight: showNewSubmissionHighlight? 'bold': 'none'}} key={idx}>

                                                                            <TableCell>{submittedBy}</TableCell>
                                                                            <TableCell>{formatDate(timeLog.work_date)}</TableCell>
                                                                            <TableCell>{timeLog.time_amount}</TableCell>
                                                                            <TableCell>{timeLog.work_comment}</TableCell>
                                                                            <TableCell>{formatDateTime(timeLog.submission_datetime)}</TableCell>
                                                                            <TableCell>
                                                                                <div className="accordion-buttons-container">
                                                                                    <TimeLogDelete header="Delete log? (This action cannot be undone)" />
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    },
                                                }
                                            ]

                                            }
                                        />
                                        <div className="accordion-buttons-container">
                                            <TimeLogPanel header="Log Time" />
                                        </div>
                                        <Accordion
                                            fluid
                                            styled
                                            defaultActiveIndex={0}
                                            panels={[
                                                {
                                                    key: "Project Here",
                                                    title: "Lenel onGaurd Datawarehouse",
                                                    content: {
                                                        content: <div>
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHeaderCell>Name</TableHeaderCell>
                                                                    <TableHeaderCell>Date</TableHeaderCell>
                                                                    <TableHeaderCell>Time (hrs)</TableHeaderCell>
                                                                    <TableHeaderCell>Comment</TableHeaderCell>
                                                                    <TableHeaderCell>Submission Date</TableHeaderCell>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {timeLogs?.filter(log => log.project == '2021-5-14_RUM5kpFxW_doOsiZpkdri').map((timeLog, idx) => {
                                                                    let submittedBy = `${timeLog.name} (${timeLog.system_id})`;
                                                                    if (timeLog.mock_id) {
                                                                        submittedBy = `${timeLog.mock_name} (${timeLog.mock_id}) as ${timeLog.name} (${timeLog.system_id})`
                                                                    }
                                                                    let showNewSubmissionHighlight = new Date(timeLog.submission_datetime) > prevLogin;
                                                                    return (

                                                                        <TableRow style={{background: showNewSubmissionHighlight? '#fffaf3' : 'none', fontWeight: showNewSubmissionHighlight? 'bold': 'none'}} key={idx}>

                                                                            <TableCell>{submittedBy}</TableCell>
                                                                            <TableCell>{formatDate(timeLog.work_date)}</TableCell>
                                                                            <TableCell>{timeLog.time_amount}</TableCell>
                                                                            <TableCell>{timeLog.work_comment}</TableCell>
                                                                            <TableCell>{formatDateTime(timeLog.submission_datetime)}</TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHeaderCell>Name</TableHeaderCell>
                                                                    <TableHeaderCell>04/07/2023 - 04/15/2023</TableHeaderCell>
                                                                    <TableHeaderCell>03/31/2023 - 04/06/2023</TableHeaderCell>
                                                                    <TableHeaderCell>Total (hrs)</TableHeaderCell>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {timeStats?.filter(log => log.project == '2021-5-14_RUM5kpFxW_doOsiZpkdri').map((timeLog, idx) => {
                                                                    let submittedBy = `${timeLog.name} (${timeLog.system_id})`;
                                                                    let showNewSubmissionHighlight = new Date(timeLog.submission_datetime) > prevLogin;
                                                                    return (

                                                                        <TableRow style={{background: showNewSubmissionHighlight? '#fffaf3' : 'none', fontWeight: showNewSubmissionHighlight? 'bold': 'none'}} key={idx}>

                                                                            <TableCell>{submittedBy}</TableCell>
                                                                            <TableCell>{timeLog.thisWeek}</TableCell>
                                                                            <TableCell>{timeLog.lastWeek}</TableCell>
                                                                            <TableCell>{timeLog.total}</TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                        </div>
                                                    },
                                                },
                                            ]}
                                        />
                                    </div>
                                },
                            },{

                            }
                        ]}
                    />
                </div>
            </div>

            <div className="pagination-container">
                <Pagination
                    defaultActivePage={1}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    prevItem={{ content: <Icon name="angle left" />, icon: true }}
                    nextItem={{ content: <Icon name="angle right" />, icon: true }}
                    totalPages={Math.ceil(actionLogCount / LOGS_PER_PAGE)}
                    onPageChange={(event, data) => {
                        getPaginationData(data.activePage - 1);
                    }}
                />
            </div>
        </>
    )
}
