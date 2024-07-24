import React, {useContext, useEffect, useState} from 'react';
import {
    Accordion,
    Icon,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "semantic-ui-react";
import {formatDate, formatDateTime} from "../../util/functions/utils";
import {SecureFetch} from '../../util/functions/secureFetch';
import {config} from '../../util/functions/constants';
import {UserContext} from "../../util/functions/UserContext";
import TimeLogPanel from "./TimeLogPanel";
import IndividualTimeModal from "./IndividualTimeModal";
import WeeklyHoursViewer from "./WeeklyHourViewer";
import moment from "moment-timezone";

import ProjectTime from "./ProjectTIme";

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
    const [projects, setProjects] = useState([]);
    const [currProj, setCurrProject] = useState({});
    const [currSem, setCurrSem] = useState({});
    const [avgTime, setAvgTime] = useState({});
    const [isOpen, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [postsPerPage, setPostsPerPage] = useState(7)
    const [totalEntries, setTotalEntries] = useState(0)
    const [weeks,setWeeks] = useState([])
    const [semesters,setSemesters] = useState([])
    const [key, setKey] = useState(Math.random());

    const [students, setStudentsData] = useState([]);
    const { eachWeekOfInterval } = require("date-fns");
    useEffect(() => {
        console.log(userContext)
        setActionLogs([]);
        SecureFetch(config.url.API_GET_MY_PROJECTS)
            .then((response) => response.json())
            .then((project) => {
                if(project.length !== 0) {
                    console.log(project)
                    //Get list of semesters
                    const tracker = []
                    for (let x of project) {
                        if(!tracker.includes(x.semester)){
                            tracker.push(x.semester)

                        }
                    }
                    const tracker2 = []
                    const tracker3 = []
                    for(let x of props.semesterData){
                        if(tracker.includes(x.semester_id)){
                            tracker2.push(x)
                            tracker3.push(setWeeks(eachWeekOfInterval({
                                start: new Date(props.semesterData[x.semester_id].start_date),
                                end: new Date(props.semesterData[x.semester_id].end_date)
                            })))
                        }
                    }
                    setSemesters(tracker2)
                    setWeeks(tracker3)
                    //Get projects
                    setProjects(project)
                }
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            });

    }, [userContext]);

    const resetKey = () => {
        console.log("hi")
        setKey(Math.random());
    }
    const getTimeData = () => {
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




    function getPaginationData(number) {

    }

    useEffect(() => {
        getPaginationData(0);
    }, [])
    useEffect(() => {
        console.log("changed")
        getTimeData(0);
    }, [key])

    return (
        <>

        {semesters.length > 0 && <h3>Time Log</h3>}
            {
                semesters.map((sem) =>  {
                    return (<>
                        <div className="accordion-button-group">
                            <Accordion
                                fluid
                                styled
                                panels={[
                                    {
                                        key: "Semester Here",
                                        title: sem.name,
                                        content: {
                                            content:
                                                <>
                                                    {projects.filter(log => log.semester === sem.semester_id).map((proj,counter) => {
                                                        return(
                                                            <ProjectTime reset ={resetKey} semester = {sem} proj= {proj} studentData = {students} timeStats = {timeStats} timeLogs = {timeLogs}></ProjectTime>
                                                        );
                                                    })}
                                                </>

                                        },
                                    }, {}
                                ]}
                            />
                        </div>

                    </>)})
            }

        </>
    )
}
