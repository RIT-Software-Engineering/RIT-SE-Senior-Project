import React from "react";
import { Button, Divider } from "semantic-ui-react";
import { formatDate, formatDateTime } from "../../util/functions/utils";

export default function IndividualTimeModalContent({
  timeLog,
  semesterName,
  projectName,
  user,
  deleteButton,
  onClose,
}) {
  return (
    <div>
      <p>
        <b>Semester/Project:</b> {semesterName} - {projectName}
      </p>
      <p>
        <b>Date of Work:</b> {formatDate(timeLog.work_date)}
      </p>
      <p>
        <b>Total Hours:</b> {timeLog.time_amount}
      </p>
      <p>
        <b>Comment:</b> {timeLog.work_comment}
      </p>
      <p>
        <b>Submission Date:</b> {formatDateTime(timeLog.submission_datetime)}
      </p>
      {timeLog.active === 0 && (
        <p style={{ background: "#FF999C" }}>
          <b>
            <i>DELETED</i>
          </b>
        </p>
      )}

      <Divider />

      <div style={{ textAlign: "right" }}>
        <Button onClick={onClose}>Close</Button>
        {deleteButton}
      </div>
    </div>
  );
}
