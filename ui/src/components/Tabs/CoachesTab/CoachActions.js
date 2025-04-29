import { UserContext } from "../../util/functions/UserContext";
import React, { useEffect, useState } from "react";
import { 
    Accordion,
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
 } from "semantic-ui-react";
 import { config } from "../../util/functions/constants";
 import { SecureFetch } from "../../util/functions/secureFetch";
 import ActionModal from "../DashboardTab/TimelinesView/Timeline/ActionModal";
 import SubmissionViewerModal from "../DashboardTab/TimelinesView/Timeline/SubmissionViewerModal";
 import ToolTip from "../DashboardTab/TimelinesView/Timeline/ToolTip";


export default function CoachActions({project, coach, semester}){
    const [actionInfo, setActionInfo] = useState([]);
    const [closeOnDocClick, setCloseOnDocClick] = useState(true);
    
    let isOpenCallback = function (isOpen) {
        setCloseOnDocClick(!isOpen);
    };

    let getTimeline = () =>{
        SecureFetch(`${config.url.API_GET_TIMELINE_ACTIONS}?project_id=${project.project_id}`)
        .then((response) => response.json())
        .then((actionInfo) =>{
            setActionInfo(actionInfo);
            console.log(actionInfo)
        })
        .catch((error) => {
            alert("Failed to get actionInfo data" + error);
        });
    }
    useEffect(() => {
        getTimeline();
    }, []);

    // const metadata = (longSubmissionTitle) => {
    //     return (
    //       <>
    //         <p
    //           dangerouslySetInnerHTML={{
    //             __html: DOMpurify.sanitize(action?.short_desc, {
    //               ALLOWED_TAGS: ["b", "i", "strong", "em"],
    //             }),
    //           }}
    //         ></p>
    //         <p>Starts: {formatDateNoOffset(action?.start_date)}</p>
    //         <p>Due: {formatDateNoOffset(action?.due_date)}</p>
    //         <p>Project: {project.title}</p>
    //         <p>Submission Type: {submissionTypeMap[props.action?.action_target]}</p>
    //         {submissions === null && !loadingSubmissions && (
    //           <p
    //             className="fake-a"
    //             onClick={() =>
    //               loadSubmission(props.projectId, props.action?.action_id)
    //             }
    //           >
    //             Load submissions
    //           </p>
    //         )}
    //         {loadingSubmissions && <Icon name="spinner" size="large" />}
    //         {submissions?.length === 0 && (
    //           <p>
    //             <b>No submissions</b>
    //           </p>
    //         )}
    //         {submissions?.map((submission) => {
    //           return (
    //             <SubmissionViewerModal
    //               key={submission.action_log_id}
    //               action={submission}
    //               title={action?.action_title}
    //               target={action?.action_target}
    //               semesterName={semester.name}
    //               projectName={project.title}
    //               isOpenCallback={isOpenCallback}
    //               trigger={
    //                 <div className="fake-a">
    //                   {longSubmissionTitle ? (
    //                     <>
    //                       {submission.mock_id &&
    //                         `${submission.mock_name} (${submission.mock_id}) as `}
    //                       {`${submission.name} (${submission.system_id})`}{" "}
    //                       {formatDateTime(submission.submission_datetime)}{" "}
    //                     </>
    //                   ) : (
    //                     <>
    //                       <i>{formatDateTime(submission.submission_datetime)}</i>{" "}
    //                       Submission
    //                     </>
    //                   )}
    //                 </div>
    //               }
    //             />
    //           );
    //         })}
    //       </>
    //     );
    // };

    return (
        
        <TableBody>
            {actionInfo?.filter(
                (action) => 
                action.action_target === "coach"
            )
            ?.map((action) => {
                return(
                    <TableRow>
                        <TableCell> {project.title} </TableCell>
                        <TableCell> {action.action_title} </TableCell>
                        <TableCell> 
                            <ToolTip
                                autoLoadSubmissions
                                color={`proposal-row-${action.state}`}
                                noPopup
                                coachTab
                                action={action}
                                projectId={project.project_id}
                                semesterName={semester.name}
                                projectName={project.title}
                                key={`tooltip-${action.action_title}`}
                                reloadTimelineActions={getTimeline}
                            />
                        </TableCell>
                    </TableRow>
                );
            })}
        </TableBody>
    )

}