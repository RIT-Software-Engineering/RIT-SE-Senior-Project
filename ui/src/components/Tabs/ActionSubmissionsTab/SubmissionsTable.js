import React, { useContext, useState } from "react";

import {
  Button,
  Divider,
  Icon,
  Label,
  Modal,
  ModalActions,
  Segment,
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
import { ACTION_TARGETS, config } from "../../util/functions/constants";
import SubmissionsModal from "./SubmissionsModal";

const { isSameWeek, addDays } = require("date-fns");

export default function SubmissionsTable(props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [submission, setSubmission] = useState({});
  const [files, setFiles] = useState([]);
  const [noSubmission, setNoSubmission] = useState(true);
  const [due, setDue] = useState();
  const [late, setLate] = useState(false);
  const [day, setDay] = useState(0);
  const [actions, setActions] = useState([]);

  const loadSubmission = (action) => {
    SecureFetch(
      `${config.url.API_GET_SUBMISSION}?log_id=${action.action_log_id}`,
    )
      .then((response) => response.json())
      .then((submission) => {
        if (submission.length > 0) {
          const formData = JSON.parse(submission[0].form_data.toString());
          const fileData = submission[0].files?.split(",");
          setSubmission(formData);
          setFiles(fileData);
          setNoSubmission(formData.length === 0 && files.length === 0);
        }
      })
      .catch((error) => {
        alert("Failed to get action log data " + error);
      });

    SecureFetch(
      `${config.url.API_GET_LATE_SUBMISSION}?log_id=${action.action_log_id}`,
    )
      .then((response) => response.json())
      .then((dueDate) => {
        let dueDateTime = new Date(dueDate[0].due_date);
        setDue(dueDateTime);
        let submitDate = new Date(
          action.submission_datetime.split(" ")[0].toString(),
        );
        setLate(dueDateTime < submitDate);
        if (dueDateTime < submitDate) {
          daysLate(dueDateTime, submitDate);
        }
      })
      .catch((error) => {
        alert("Failed to get due and submission data " + error);
      });
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

  function getActions(keyFn, actionLogs) {
    var mySet = new Set();
    return actionLogs.filter(function(x) {
        var key = keyFn(x), isNew = !mySet.has(key);
        if (isNew) mySet.add(key);
        return isNew;
    });
  };

  return (
    <>
      <h3>All Action Submissions</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Action</TableHeaderCell>
            <TableHeaderCell>Action Type</TableHeaderCell>
            <TableHeaderCell style={{textAlign: "right"}}>View All</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
            {/* {console.log(getActions((x) => x.action_template, props.actionLogs))} */}
            {getActions((x) => x.action_template, props.actionLogs)?.map((action, idx) => {
              if((props.project.title === action.display_name || props.project.title === action.title)) {
                let submittedBy = `${action.name} (${action.system_id})`;
                if (action.mock_id) {
                  submittedBy = `${action.mock_name} (${action.mock_id}) as ${action.name} (${action.system_id})`;
                }
                return(
                  <TableRow
                    key={idx}
                  >
                    <TableCell>{action.action_title}</TableCell>
                    <TableCell>{action.action_target}</TableCell>
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
      </Table>
    </>
  );
}