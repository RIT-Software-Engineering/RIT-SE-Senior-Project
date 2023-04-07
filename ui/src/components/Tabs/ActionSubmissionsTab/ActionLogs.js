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

const LOGS_PER_PAGE = 50;

export default function ActionLogs(props) {

    const semesterMap = {};
    props.semesterData.forEach(semester => semesterMap[semester.semester_id] = semester);
    const [actionLogs, setActionLogs] = useState([]);
    const [actionLogCount, setActionLogCount] = useState(LOGS_PER_PAGE);
    const [timeLogs, setTimeLogs] = useState([]);
    const [timeLogCount, setTimeLogCount] = useState(LOGS_PER_PAGE)
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
        /*SecureFetch(`${config.url.API_GET_ALL_TIME_LOGS}/?resultLimit=${LOGS_PER_PAGE}&offset=0`)
            .then((response) => response.json())
            .then((time_logs) => {
                setTimeLogs(time_logs.timeLogs);
                setTimeLogCount(time_logs.timeLogCount);
            })
            .catch((error) => {
                alert("Failed to get time log data " + error);
            });*/
        setTimeLogs([{name:'Jeffery Beril', system_id:'qrs123', submission_datetime:'2021-03-08', work_comment:"Coded Widget", time_amount:3, work_date:'2021-03-06', project_id:'2021-5-14_RUM5kpFxW_doOsiZpkdri'},
                     {name:'Steven Jobe', system_id:'tuv123', submission_datetime:'2021-03-07', work_comment:"Debugged Feature", time_amount:2, work_date:'2021-03-05', project_id:'2021-5-14_RUM5kpFxW_doOsiZpkdri'},
                     {name:'John Smith', system_id:'abc123', submission_datetime:'2021-03-07', work_comment:"Designed Architecture", time_amount:4, work_date:'2021-03-07', project_id:'2021-5-14_da90mGtCgojqWElAItowB'},
                     {name:'Tom Amaril', system_id:'nop123', submission_datetime:'2021-03-09', work_comment:"Applied Code Standards", time_amount:1, work_date:'2021-03-06', project_id:'2021-5-14_RUM5kpFxW_doOsiZpkdri'},
                     {name:'Dude Bro', system_id:'def123', submission_datetime:'2021-03-05', work_comment:"Documented Progress", time_amount:2, work_date:'2021-03-06', project_id:'2021-5-14_da90mGtCgojqWElAItowB'},
                     {name:'Steven Jobe', system_id:'tuv123', submission_datetime:'2021-03-06', work_comment:"Resolved Merge Request", time_amount:3, work_date:'2021-03-07', project_id:'2021-5-14_RUM5kpFxW_doOsiZpkdri'},
                     {name:'Tom Amaril', system_id:'nop123', submission_datetime:'2021-03-06', work_comment:"Ate Spaghetti Code", time_amount:2, work_date:'2021-03-05', project_id:'2021-5-14_RUM5kpFxW_doOsiZpkdri'}])
    }

    useEffect(() => {
        getPaginationData(0);
    }, [])
    useEffect(() => {
        getTimeData(0);
    }, [])
    return (
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
                                                    title: "In Progress Project",
                                                    content: {
                                                        content: <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHeaderCell>Name</TableHeaderCell>
                                                                    <TableHeaderCell>Date</TableHeaderCell>
                                                                    <TableHeaderCell>Time</TableHeaderCell>
                                                                    <TableHeaderCell>Comment</TableHeaderCell>
                                                                    <TableHeaderCell>Submission Date</TableHeaderCell>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {timeLogs?.filter(log => log.project_id == '2021-5-14_da90mGtCgojqWElAItowB').map((timeLog, idx) => {
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
                                                    },
                                                },
                                            ]}
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
                                                        content: <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHeaderCell>Name</TableHeaderCell>
                                                                    <TableHeaderCell>Date</TableHeaderCell>
                                                                    <TableHeaderCell>Time</TableHeaderCell>
                                                                    <TableHeaderCell>Comment</TableHeaderCell>
                                                                    <TableHeaderCell>Submission Date</TableHeaderCell>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {timeLogs?.filter(log => log.project_id == '2021-5-14_RUM5kpFxW_doOsiZpkdri').map((timeLog, idx) => {
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
                                                    },
                                                },
                                            ]}
                                        />
                                    </div>
                                },
                            },
                        ]}
                    />
                </div>
            </div>
            <h3>Action Submissions</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        {userContext.user?.role !== USERTYPES.STUDENT && <TableHeaderCell>Project</TableHeaderCell>}
                        <TableHeaderCell>Action</TableHeaderCell>
                        <TableHeaderCell>Action Type</TableHeaderCell>
                        <TableHeaderCell>Submitted By</TableHeaderCell>
                        <TableHeaderCell>Submission Time</TableHeaderCell>
                        <TableHeaderCell>View</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {actionLogs?.map((action, idx) => {
                        let submittedBy = `${action.name} (${action.system_id})`;
                        if (action.mock_id) {
                            submittedBy = `${action.mock_name} (${action.mock_id}) as ${action.name} (${action.system_id})`
                        }
                        let showNewSubmissionHighlight = new Date(action.submission_datetime) > prevLogin;
                        return (

                            <TableRow style={{background: showNewSubmissionHighlight? '#fffaf3' : 'none', fontWeight: showNewSubmissionHighlight? 'bold': 'none'}} key={idx}>

                                {userContext.user?.role !== USERTYPES.STUDENT && <TableCell>{action.display_name || action.title}</TableCell>}
                                <TableCell>{action.action_title}</TableCell>
                                <TableCell>{action.action_target}</TableCell>
                                <TableCell>{submittedBy}</TableCell>
                                <TableCell>{formatDateTime(action.submission_datetime)}</TableCell>
                                <TableCell>
                                    <SubmissionViewerModal
                                        projectName={action.display_name || action.title}
                                        semesterName={semesterMap[action.semester]?.name}
                                        action={action}
                                        target={action?.action_target}
                                        isOpenCallback={()=>{}}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

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
