import React, { useState, useEffect, useContext } from 'react';
import { Accordion } from "semantic-ui-react";
import { formatDateTime } from "../../util/functions/utils";
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

const LOGS_PER_PAGE = 50;

export default function ActionLogs(props) {

    const semesterMap = {};
    props.semesterData.forEach(semester => semesterMap[semester.semester_id] = semester);
    const [actionLogs, setActionLogs] = useState([]);
    const [actionLogCount, setActionLogCount] = useState(LOGS_PER_PAGE);
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

    useEffect(() => {
        getPaginationData(0);
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
                                title: "Semester Here",
                                content: {
                                    content: <div className="accordion-button-group">
                                        <Accordion
                                            fluid
                                            styled
                                            defaultActiveIndex={0}
                                            panels={[
                                                {
                                                    key: "Project Here",
                                                    title: "Project Here",
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
                                                                <TableRow style={{background: 'none', fontWeight: 'none'}}>
                                                                    <TableHeaderCell>Jeffery Beril (qrs123)</TableHeaderCell>
                                                                    <TableHeaderCell>03/06/2023</TableHeaderCell>
                                                                    <TableHeaderCell>3 hrs</TableHeaderCell>
                                                                    <TableHeaderCell>Coded Widget</TableHeaderCell>
                                                                    <TableHeaderCell>03/07/2023</TableHeaderCell>
                                                                </TableRow>
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
