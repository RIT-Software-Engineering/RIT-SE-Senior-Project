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

export default function ActionLogs(props) {

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
        <>
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
