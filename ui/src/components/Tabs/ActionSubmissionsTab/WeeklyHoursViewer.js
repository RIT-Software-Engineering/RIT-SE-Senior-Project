import React, { useState } from "react";
import { formatDateTime, formatDate } from "../../util/functions/utils";
import {
  Button,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Icon,
  Modal,
} from "semantic-ui-react";

export default function WeeklyHoursViewer(props) {
  const [open, setOpen] = useState(false);

  function getAverageHours(sum, hoursPerWeek) {
    let avg = 0;
    const filtered = hoursPerWeek.filter((item) => item != 0);

    if (filtered.length !== 0 && sum != 0) {
      avg = sum / filtered.length;
    }
    return avg.toFixed(2);
  }
  return (
    <Modal
      className={"sticky"}
      onClose={() => {
        setOpen(false);
        props?.isOpenCallback(false);
      }}
      onOpen={() => {
        setOpen(true);
        props?.isOpenCallback(true);
      }}
      open={open}
      size="fullscreen"
      trigger={
        <div style={{ display: "flex" }}>
          {props.trigger || (
            <Button icon style={{ marginLeft: "auto" }}>
              <Icon name="calendar" /> Time Log Report
            </Button>
          )}
        </div>
      }
      header={`${props.project} Time Log Report (Average Hours calculations only include weeks in which a team
                member reported hours.)`}
      actions={[{ content: "Close", key: 0 }]}
      content={{
        content: (
          <div style={{ overflow: "auto" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell style={{ position: "sticky", zIndex: 1 }}>
                    Name
                  </TableHeaderCell>
                  {props.semWeeks.map((week, idx) => (
                    <TableHeaderCell key={idx}>{`${
                      formatDate(week.startDate) +
                      " to " +
                      formatDate(week.endDate)
                    }`}</TableHeaderCell>
                  ))}
                  <TableHeaderCell>Average Hours</TableHeaderCell>
                  <TableHeaderCell>Total Hours</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {props.semStudents.map((student, idx) => {
                  let weekly = props.userLogs[student.system_id]?.weeklyHours;

                  const sum = props.userLogs[student.system_id]?.totalHours;
                  const avg = getAverageHours(sum, props.hoursPerWeek);

                  return (
                    <TableRow>
                      <TableCell style={{ whiteSpace: "nowrap" }}>
                        {`${student.fname} ${student.lname} (${student.system_id})`}
                      </TableCell>
                      {weekly?.map((week, idx) => (
                        <TableCell>{week}</TableCell>
                      ))}
                      <TableCell>{avg}</TableCell>
                      <TableCell>{sum}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ),
        // content:(),
      }}
    />
  );
}
