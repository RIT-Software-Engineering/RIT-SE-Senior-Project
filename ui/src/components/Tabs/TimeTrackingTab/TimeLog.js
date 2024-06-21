import React, { useState, useEffect, useContext } from 'react';
import {
    Accordion,
    Button,
    Divider,
    Header, Modal,
    ModalActions,
    ModalContent,
    ModalDescription,
    ModalHeader
} from "semantic-ui-react";
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
import { FaRegTrashCan } from "react-icons/fa6";
import IndividualTimeModal from "./IndividualTimeModal";

const LOGS_PER_PAGE = 50;

export default function TimeLog(props) {
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
    const [currProj, setCurrProject] = useState({});
    const [currSem, setCurrSem] = useState({});
    const [avgTime, setAvgTime] = useState({});
    const [isOpen, setOpen] = useState(false);
    useEffect(() => {
        // TODO: Do pagination
        setActionLogs([]);
        SecureFetch(config.url.API_GET_MY_PROJECTS)
            .then((response) => response.json())
            .then((project) => {
                console.log(props.semesterData)

                if(project.length !== 0) {
                    setCurrProject(project[0])
                    setCurrSem(props.semesterData[project[0].semester_group-1])


                }
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            });

    }, [userContext]);

    useEffect(() => {
        let isMounted = true;
        if(currProj){
            handleAvg().then(data =>{if (isMounted) setAvgTime(data);    // add conditional check
             })
         return () => { isMounted = false }
        }

    }, [currProj])



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


    const handleAvg = async function  () {
        SecureFetch(`${config.url.API_GET_TIME_AVG}?project_id=${currProj.project_id}`)
            .then((response) => response.json()).then((time) => {
            return setAvgTime(time)
        }).catch((error) => {
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
            <h3>Time Logs</h3>
                <div className="accordion-button-group">
                    <Accordion
                        fluid
                        styled
                        defaultActiveIndex={0}
                        panels={[
                            {
                                key: "Semester Here",
                                title: currSem.name,
                                content: {
                                    content: <div className="accordion-button-group">
                                        <Accordion
                                            fluid
                                            styled
                                            defaultActiveIndex={0}
                                            panels={[
                                                {
                                                    key: "Project Here",
                                                    title: currProj.title,
                                                    content: {
                                                        content: <div><Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    {/*Headers for the table */}
                                                                    <TableHeaderCell>Name</TableHeaderCell>
                                                                    <TableHeaderCell>Date of Work</TableHeaderCell>
                                                                    <TableHeaderCell>Time(hrs)</TableHeaderCell>
                                                                    <TableHeaderCell>Comment</TableHeaderCell>
                                                                    <TableHeaderCell>Submission Date</TableHeaderCell>
                                                                    <TableHeaderCell>View</TableHeaderCell>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {timeLogs?.filter(log => log.project == currProj.project_id).map((timeLog, idx) => {
                                                                    let submittedBy = `${timeLog.name} (${timeLog.system_id})`;
                                                                    if (timeLog.mock_id) {
                                                                        submittedBy = `${timeLog.mock_name} (${timeLog.mock_id}) as ${timeLog.name} (${timeLog.system_id})`
                                                                    }
                                                                    let showNewSubmissionHighlight = new Date(timeLog.submission_datetime) > prevLogin;
                                                                    return (

                                                                        <TableRow style={{
                                                                            background: showNewSubmissionHighlight ? '#fffaf3' : 'none',
                                                                            fontWeight: showNewSubmissionHighlight ? 'bold' : 'none'
                                                                        }} key={idx}>

                                                                            <TableCell>{submittedBy}</TableCell>
                                                                            <TableCell>{formatDate(timeLog.work_date)}</TableCell>
                                                                            <TableCell>{timeLog.time_amount}</TableCell>
                                                                            <TableCell>{timeLog.work_comment}</TableCell>
                                                                            <TableCell>{formatDateTime(timeLog.submission_datetime)}</TableCell>
                                                                            <TableCell>
                                                                                 <IndividualTimeModal

                                                                                        projectName={currProj.title}
                                                                                        semesterName={currSem.name}
                                                                                        user = {submittedBy}
                                                                                        timeLog={timeLog}
                                                                                        id = {timeLog.time_log_id}
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
                                                                    prevItem={{
                                                                        content: <Icon name="angle left"/>,
                                                                        icon: true
                                                                    }}
                                                                    nextItem={{
                                                                        content: <Icon name="angle right"/>,
                                                                        icon: true
                                                                    }}
                                                                    totalPages={Math.ceil(actionLogCount / LOGS_PER_PAGE)}
                                                                    onPageChange={(event, data) => {
                                                                        getPaginationData(data.activePage - 1);
                                                                    }}
                                                                />
                                                            </div>
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        {/*Headers for the table */}
                                                                        <TableHeaderCell>Name</TableHeaderCell>
                                                                        <TableHeaderCell>Average(hrs)</TableHeaderCell>
                                                                        <TableHeaderCell>Total(hrs)</TableHeaderCell>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {timeStats?.filter(log => log.project == currProj.project_id).map((timeStat, idx) => {
                                                                        return (
                                                                            <TableRow key={idx}>
                                                                                <TableCell>{timeStat.name}</TableCell>
                                                                                <TableCell>{avgTime[idx] !== undefined ? Math.floor(avgTime[idx].avgTime) : 0}</TableCell>
                                                                                <TableCell>{timeStat.total}</TableCell>
                                                                            </TableRow>
                                                                        );
                                                                    })}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    },
                                                },
                                            ]
                                            }
                                        />
                                        <div className="accordion-buttons-container">
                                            <TimeLogPanel header="Log Time"/>
                                        </div>
                                    </div>
                                },
                            }, {}
                        ]}
                    />
                </div>


        </>
    )
}
