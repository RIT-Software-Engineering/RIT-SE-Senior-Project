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

const LOGS_PER_PAGE = 50;

export default function ProjectTime(props) {
    const userContext = useContext(UserContext)
    const prevLogin = new Date(userContext.user.prev_login);
    const [currentPage, setCurrentPage] = useState(0);
    const [postsPerPage, setPostsPerPage] = useState(7)
    const [avgTime, setAvgTime] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const { eachWeekOfInterval } = require("date-fns");

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_TIME_AVG}?project_id=${props.proj.project_id}`)
            .then((response) => response.json()).then((time) => {
            setAvgTime(time)
        })
        setWeeks(eachWeekOfInterval({
            start: new Date(props.semester.start_date),
            end: new Date(props.semester.end_date)
        }))
    }, [userContext]);

    const resetKey = () => {
        props.reset()
    }
    return(
        <div className="accordion-button-group">
            <Accordion

                fluid
                styled
                panels={[
                    {
                        key: "Project Here",
                        title: props.proj.title,
                        content: {
                            content: <div><Table>
                                <TableHeader>
                                    <TableRow>
                                        {/*Headers for the table */}
                                        <TableHeaderCell>Name</TableHeaderCell>
                                        <TableHeaderCell>Date of
                                            Work</TableHeaderCell>
                                        <TableHeaderCell>Time(hrs)</TableHeaderCell>
                                        <TableHeaderCell>Comment</TableHeaderCell>
                                        <TableHeaderCell>Submission
                                            Date</TableHeaderCell>
                                        <TableHeaderCell>View</TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {props.timeLogs?.filter(log => log.project == props.proj.project_id).map((timeLog, idx) => {

                                        let submittedBy = `${timeLog.name} (${timeLog.system_id})`;
                                        if (timeLog.mock_id) {
                                            submittedBy = `${timeLog.mock_name} (${timeLog.mock_id}) as ${timeLog.name} (${timeLog.system_id})`
                                        }
                                        let showNewSubmissionHighlight = new Date(timeLog.submission_datetime) > prevLogin;
                                        if ((idx >= currentPage * postsPerPage) && (idx <= (currentPage * postsPerPage) + postsPerPage - 1)) {
                                            return (

                                                <TableRow style={{
                                                    background: timeLog.active === 0 ? '#FF999C' : 'none',
                                                    fontWeight: showNewSubmissionHighlight ? 'bold' : 'none'
                                                }} key={idx}>

                                                    <TableCell>{submittedBy}</TableCell>
                                                    <TableCell>{formatDate(timeLog.work_date)}</TableCell>
                                                    <TableCell>{Math.round(timeLog.time_amount)}</TableCell>
                                                    <TableCell>{timeLog.work_comment.length < 10 ? timeLog.work_comment : timeLog.work_comment.slice(0, 10) + "...."}</TableCell>
                                                    <TableCell>{formatDateTime(timeLog.submission_datetime)}</TableCell>
                                                    <TableCell>
                                                        <IndividualTimeModal
                                                            projectName={props.proj.title}
                                                            semesterName={props.semester.name}
                                                            user={submittedBy}
                                                            timeLog={timeLog}
                                                            userId={timeLog.system_id}
                                                            id={timeLog.time_log_id}
                                                            delete={timeLog.active}
                                                            resetKey={resetKey}

                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }
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
                                        totalPages={Math.ceil(props.timeLogs?.filter(log => log.project === props.proj.project_id).length / postsPerPage)}
                                        onPageChange={(event, data) => {
                                            setCurrentPage(data.activePage - 1)
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
                                        {props.timeStats?.filter(log => log.project == props.proj.project_id).map((timeStat, idx) => {
                                            return (
                                                <TableRow key={idx}>
                                                    <TableCell>{timeStat.name}</TableCell>
                                                    <TableCell>{avgTime[idx]?.avgTime ?? 0}</TableCell>
                                                    <TableCell>{Math.round(timeStat.total)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                <div>
                                    <WeeklyHoursViewer
                                        projectName={props.proj.title}
                                        semesterName={props.semester.name}
                                        weeks={weeks}
                                        timeLog={props.timeLogs.filter(log => log.project == props.proj.project_id)}
                                        students={props.timeStats}
                                    />
                                </div>
                            </div>
                        },
                    },
                ]
                }

            />
            <div className="accordion-buttons-container">
                <TimeLogPanel callback = {resetKey} header="Log Time"/>
            </div>
        </div>

    )
}
