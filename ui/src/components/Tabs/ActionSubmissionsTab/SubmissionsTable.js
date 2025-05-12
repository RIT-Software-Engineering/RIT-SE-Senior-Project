import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config, USERTYPES } from "../../util/functions/constants";
import { formatDateTime, formatDate } from "../../util/functions/utils";
import SubmissionsFileData from "./SubmissionsFileData";
import _ from "lodash";

export default function SubmissionsTable(props) {
  const [submissions, setSubmissions] = useState([]);

  const getSubmissions = () => {
    if(props.userContext.user?.role !== USERTYPES.STUDENT) {
      SecureFetch(
        `${config.url.API_GET_SUBMISSIONS}?action_id=${props.action.action_id}`)
        .then((response) => response.json())
        .then((submissions) => {
          if (submissions.length > 0) {
            let actionSubmissions = [];
            for(let i=0; i<submissions.length; i++) {
              let submissionsData = [];
              let formData = JSON.parse(submissions[i].form_data.toString());
              let fileData = submissions[i].files?.split(",");
              let logId = submissions[i].action_log_id;
              let actionId = submissions[i].action_id;
              let dueDate = new Date(submissions[i].due_date);
              dueDate.setDate(dueDate.getDate()+1);
              submissionsData.push([formData, fileData, logId, actionId, dueDate]);
              actionSubmissions.push(submissionsData);
            }
            setSubmissions(actionSubmissions);
          }
      })
      .catch((error) => {
          alert("Failed to get submission data " + error);
      });
    }
  }

  useEffect(() => {
    getSubmissions();
  }, []);

  const daysLate = (due, submitted) => {
      let dueDate = formatDate(due);
      let submitDate = formatDate(submitted);
      let diffInMs = new Date(submitDate) - new Date(dueDate);
      let diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      return diffInDays;
  };

  console.log("submissions", submissions);
  console.log("action submissions", props.actionSubmissions);

  return (
    <>
      <Table celled>
        <TableHeader>
          <TableRow>
          <TableHeaderCell>Project</TableHeaderCell>
          <TableHeaderCell>Submitted By</TableHeaderCell>
          <TableHeaderCell>Submission Time</TableHeaderCell>
          <TableHeaderCell>Submission Data</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {props.actionSubmissions.map((log, idx) => {
            if(submissions.length > 0) {
              let actionSubmission = submissions.filter((submission) => submission[0][2] === log.action_log_id);
              console.log("actionSubmission", actionSubmission);
              let submission = actionSubmission[0][0][0];
              let files = actionSubmission[0][0][1];
              let due = actionSubmission[0][0][4];
              let noSubmission = (submission.length === 0 && files.length === 0);
              let submitDate = new Date(log.submission_datetime.split(" ")[0].toString());

              let submittedBy = `${log.name} (${log.system_id})`;
              if (log.mock_id) {
                submittedBy = `${log.mock_name} (${log.mock_id}) as ${log.name} (${log.system_id})`;
              }
              return(
                <TableRow key={idx}>
                  <TableCell>{log.title}</TableCell>
                  <TableCell>{submittedBy}</TableCell>
                  <TableCell>
                    {formatDateTime(log.submission_datetime)}<br />
                    {`(Due ${formatDate(due)})`}<br />
                    {(due < submitDate) &&
                    ` ${daysLate(due, submitDate)} days late`}
                  </TableCell>
                  <TableCell>
                    <>
                      <SubmissionsFileData
                        log={log}
                        target={props.target}
                        submission={submission}
                        files={files}
                        noSubmission={noSubmission}
                        isOpenCallback={props.isOpenCallback}
                      />
                    </>
                  </TableCell>
                </TableRow>
              )
            }
          })}
        </TableBody>
      </Table>
    </>
  );
}