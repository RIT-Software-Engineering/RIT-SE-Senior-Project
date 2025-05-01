import React, { useContext, useState, useEffect } from "react";

import {
  Button,
  Divider,
  Icon,
  Label,
  Modal,
  ModalActions,
  Segment,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { formatDate, formatDateTime } from "../../util/functions/utils";
import { SecureFetch } from "../../util/functions/secureFetch";
import InnerHTML from "dangerously-set-html-content";
import { UserContext } from "../../util/functions/UserContext";
import { ACTION_TARGETS, ACTION_STATES, config } from "../../util/functions/constants";
import SubmissionsModal from "./SubmissionsModal";
import _ from "lodash";

const { isSameWeek, addDays } = require("date-fns");

const ACTIONS_PER_PAGE = 11;

export default function SubmissionsTable(props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [submission, setSubmission] = useState({});
  const [files, setFiles] = useState([]);
  const [noSubmission, setNoSubmission] = useState(true);
  const [due, setDue] = useState();
  const [late, setLate] = useState(false);
  const [day, setDay] = useState(0);
  // const [actionCount, setActionCount] = useState(ACTIONS_PER_PAGE);

  // const getPaginationData = (page) => {
  //   SecureFetch(
  //     `${
  //       config.url.API_GET_ALL_ACTION_LOGS
  //     }/?resultLimit=${ACTIONS_PER_PAGE}&offset=${ACTIONS_PER_PAGE * page}`,
  //   )
  //     .then((response) => response.json())
  //     .then((action_logs) => {
  //       setActions(action_logs.actionLogs);
  //       setActionCount(action_logs.actionLogCount);
  //     })
  //     .catch((error) => {
  //       alert("Failed to get action data " + error);
  //     });
  // };

  function loadSubmission(log_id) {
    return (
      SecureFetch(
        `${config.url.API_GET_SUBMISSION}?log_id=${log_id}`,
      )
        .then((response) => response.json())
        .then((submission) => {
          if (submission.length > 0) {
            const formData = JSON.parse(submission[0].form_data.toString());
            const fileData = submission[0].files?.split(",");
            // setSubmission(formData);
            // setFiles(fileData);
            // setNoSubmission(formData.length === 0 && files.length === 0);
            // console.log([formData, fileData, (formData.length === 0 && fileData.length === 0)])
            return [formData, fileData, (formData.length === 0 && fileData.length === 0)]
          }
        })
        .catch((error) => {
          alert("Failed to get action log data " + error);
        })
    )
  };

  const noSubmissionText = (target) => {
    switch (target) {
      case ACTION_TARGETS.individual:
        return "Individual Submissions are Not Viewable by Team Members";
      case ACTION_TARGETS.peer_evaluation:
        return "Peer Evaluation Submissions are Not Viewable by Team Members";
      case ACTION_TARGETS.coach:
        return "Coach Submissions are Not Viewable by Team Members";
      case ACTION_TARGETS.admin:
        return "Admin Submissions are Not Viewable by Team Members";
      default:
        return "You can not view this submission";
    }
  };

  const daysLate = (due, submitted) => {
    const dueDate = formatDate(due);
    const submitDate = formatDate(submitted);
    const diffInMs = new Date(submitDate) - new Date(dueDate);
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    setDay(diffInDays);
  };

  const IS_PEER_EVALUATION = (action) => {
    return(action.action_target === ACTION_TARGETS.peer_evaluation)
  };

  const onClose = (page) => {
    setOpen(false);
  };

  const getTotalTime = (week, name) => {
    let filteredTimeLogs = props.timeLog
      // Is not deleted
      .filter((timeLog) => timeLog.active !== 0)
      // Is from User
      .filter((timeLog) => name === timeLog.name)
      // Is in week range
      .filter((timeLog) => isSameWeek(week, new Date(timeLog.work_date)));

    let total = filteredTimeLogs.reduce(
      (total, log) => total + log.time_amount,
      0,
    );

    if (total == 0 || parseFloat(total) / parseInt(total) == 1) {
      return total;
    }
    return total.toFixed(2);
  };

  // function getActions(keyFn, actionLogs) {
  //   var mySet = new Set();
  //   return actionLogs.filter(function(x) {
  //       var key = keyFn(x), isNew = !mySet.has(key);
  //       if (isNew) mySet.add(key);
  //       return isNew;
  //   });
  // };

  const actionColor = (action) => {
    let color = "";

    switch (action.state) {
      case ACTION_STATES.YELLOW:
        color += "action-row-yellow";
        break;
      case ACTION_STATES.RED:
        color += "action-row-red";
        break;
      case ACTION_STATES.GREEN:
        color += "action-row-green";
        break;
      case ACTION_STATES.GREY:
        color += "action-row-gray";
        break;
      default:
        color += `action-row-${action.state}`;
        break;
    };

    return color;
  }

  console.log(props.submissions);

  return (
    <>
      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Action</TableHeaderCell>
            <TableHeaderCell>Action Type</TableHeaderCell>
            <TableHeaderCell>Submission Status</TableHeaderCell>
            <TableHeaderCell style={{textAlign: "right"}}>View All Submissions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
            
            {props.actions.map((action, idx) => {
              // console.log(action)
              if(props.project.semester === action.semester) {
                let submittedBy = `${action.name} (${action.system_id})`;
                if (action.mock_id) {
                  submittedBy = `${action.mock_name} (${action.mock_id}) as ${action.name} (${action.system_id})`;
                }
                return(
                  <TableRow
                    className={actionColor(action)}
                    key={idx}
                  >
                    <TableCell >{action.action_title}</TableCell>
                    <TableCell>{action.action_target}</TableCell>
                    <TableCell>{action.state}</TableCell>
                    <TableCell style={{textAlign: "right"}}>
                      <SubmissionsModal
                        projectName={action.display_name || action.title}
                        semesterName={props.semesterName}
                        actionLogs={props.actionLogs}
                        action={action}
                        target={action?.action_target}
                        isOpenCallback={() => {}}
                      />
                    </TableCell>
                  </TableRow>
                );
              }
            })}  
        </TableBody>
      </Table> */}

      {/* <div className="pagination-container">
        <Pagination
          defaultActivePage={1}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          prevItem={{ content: <Icon name="angle left" />, icon: true }}
          nextItem={{ content: <Icon name="angle right" />, icon: true }}
          totalPages={Math.ceil(actionCount / ACTIONS_PER_PAGE)}
          onPageChange={(event, data) => {
            getPaginationData(data.activePage - 1);
          }}
        />
      </div> */}
      <Table celled>
        <TableHeader>
          <TableRow>
          <TableHeaderCell>Semester/Project</TableHeaderCell>
          <TableHeaderCell>Submitted By</TableHeaderCell>
          <TableHeaderCell>Submission Time</TableHeaderCell>
          <TableHeaderCell>Submission Name</TableHeaderCell>
          <TableHeaderCell>Submission Email</TableHeaderCell>
          <TableHeaderCell>File</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          
          {/* {console.log(submissions)} */}
          
            {props.submissions.map((log, idx) => {
              // console.log(log)
              // let submission = loadSubmission(log.action_log_id)
              // let submissionName = submission.then(arr => {
              //                         return arr[0].name
              //                       })
              // console.log(submissionName)
              let submittedBy = `${log.name} (${log.system_id})`;
              if (log.mock_id) {
                submittedBy = `${log.mock_name} (${log.mock_id}) as ${log.name} (${log.system_id})`;
              }
              return(
                <TableRow key={idx}>
                  <TableCell>{log.title}</TableCell>
                  <TableCell>{submittedBy}</TableCell>
                  <TableCell>{formatDateTime(log.submission_datetime)}</TableCell>
                  <TableCell>
                    {/* {submissionName.then(name => {
                      console.log(name)
                      return name
                    })} */}
                    name
                  </TableCell>
                  <TableCell>email</TableCell>
                  <TableCell>
                    
                    {/* {!submission[2] && ( */}
                      {/* <>
                        {Object.keys(submission[0])?.map((key) => {
                          if ((submission[0])[key].includes("fakepath")) {
                            return false;
                          }
                          return (
                            <div key={key}>
                              <p>
                                <b>{key}:</b> {(submission[0])[key]}
                              </p>
                            </div>
                          );
                        })}
                        {submission[1]?.map((file) => {
                          return (
                            <div key={file}>
                              <a
                                href={`${config.url.API_GET_SUBMISSION_FILE}?file=${file}&log_id=${log.action_log_id}&project=${log.project}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {file.replace(/^[^/]*\/(.*)$/, "$1")}
                              </a>
                              <br />
                            </div>
                          );
                        })}
                      </> */}
                    {/* )} */}
                  </TableCell>
                </TableRow>
              )
          })}
        </TableBody>
      </Table>
    </>
  );
}