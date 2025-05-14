import React, { useState, useEffect } from "react";
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
import { SecureFetch } from "../../util/functions/secureFetch";
import { config, USERTYPES } from "../../util/functions/constants";
import { formatDateTime, formatDate } from "../../util/functions/utils";
import SubmissionsFileData from "./SubmissionsFileData";
import _ from "lodash";

const SUBMISSIONS_PER_PAGE = 50;

export default function SubmissionsTable(props) {
  const [submissions, setSubmissions] = useState([]);
  const [submissionsCount, setSubmissionsCount] = useState(SUBMISSIONS_PER_PAGE);

  const getSubmissions = (page) => {
    if(props.userContext.user?.role !== USERTYPES.STUDENT) {
      SecureFetch(
        `${config.url.API_GET_SUBMISSIONS}/?action_id=${props.action.action_id}&resultLimit=${SUBMISSIONS_PER_PAGE}&offset=${SUBMISSIONS_PER_PAGE * page}`
      )
        .then((response) => response.json())
        .then((sub) => {
          if (sub.submissions.length > 0) {
            let actionSubmissions = [];
            for(let i=0; i<sub.submissions.length; i++) {
              let submissionsData = [];
              let formData = JSON.parse(sub.submissions[i].form_data.toString());
              let fileData = sub.submissions[i].files?.split(",");
              let logId = sub.submissions[i].action_log_id;
              let actionId = sub.submissions[i].action_id;
              let dueDate = new Date(sub.submissions[i].due_date);
              let submissionDate = new Date(sub.submissions[i].submission_datetime);
              let name = sub.submissions[i].name;
              let mockName = sub.submissions[i].mock_name;
              let systemId = sub.submissions[i].system_id;
              let mockId = sub.submissions[i].mock_id;
              let title = sub.submissions[i].title;
              let project = sub.submissions[i].project;


              dueDate.setDate(dueDate.getDate()+1);
              submissionsData.push([formData, fileData, logId, actionId, dueDate, submissionDate, name, mockName, systemId, mockId, title, project]);
              actionSubmissions.push(submissionsData);
            }
            setSubmissions(actionSubmissions);
            setSubmissionsCount(sub.submissionsCount);
          }
      })
      .catch((error) => {
          alert("Failed to get submission data " + error);
      });
    }
  }

  useEffect(() => {
    getSubmissions(0);
  }, []);

  const daysLate = (due, submitted) => {
      let dueDate = formatDate(due);
      let submitDate = formatDate(submitted);
      let diffInMs = new Date(submitDate) - new Date(dueDate);
      let diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      return diffInDays;
  };

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
          {submissions.map((sub, idx) => {
            if(sub.length > 0) {
              let submission = sub[0][0];
              let files = sub[0][1];
              let logId = sub[0][2];
              let due = sub[0][4];
              let submitDate = sub[0][5];
              let name = sub[0][6];
              let mockName = sub[0][7];
              let systemId = sub[0][8];
              let mockId = sub[0][9];
              let title = sub[0][10];
              let project = sub[0][11];
              let noSubmission = (submission.length === 0 && files.length === 0);
              

              let submittedBy = `${name} (${systemId})`;
              if (mockId) {
                submittedBy = `${mockName} (${mockId}) as ${name} (${systemId})`;
              }
              return(
                <TableRow key={idx}>
                  <TableCell>{title}</TableCell>
                  <TableCell>{submittedBy}</TableCell>
                  <TableCell>
                    {formatDateTime(submitDate)}<br />
                    {`(Due ${formatDate(due)})`}<br />
                    {(due < submitDate) &&
                    ` ${daysLate(due, submitDate)} days late`}
                  </TableCell>
                  <TableCell>
                    <>
                      <SubmissionsFileData
                        logId={logId}
                        project={project}
                        actionTitle={props.actionTitle}
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

      <div className="pagination-container">
        <Pagination
          defaultActivePage={1}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          prevItem={{ content: <Icon name="angle left" />, icon: true }}
          nextItem={{ content: <Icon name="angle right" />, icon: true }}
          totalPages={Math.ceil(submissionsCount / SUBMISSIONS_PER_PAGE)}
          onPageChange={(event, data) => {
            getSubmissions(data.activePage - 1);
          }}
        />
      </div>
    </>
  );
}