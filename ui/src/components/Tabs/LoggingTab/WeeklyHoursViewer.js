import React, { useState } from "react";
import { formatDate } from "../../util/functions/utils";
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
  const project = props.project;
  const myProjects = props.myProjects;
  const weeks = props.weeks;
  const weeksWorked = props.weeksWorked;

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
      header={
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ textAlign: "center" }}>
            {" "}
            {`${props.project} Time Log Report`}
          </h2>
        </div>
      }
      actions={[{ content: "Close", key: 0 }]}
      content={{
        content: (
          <div>
            <div style={{ overflow: "auto" }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell style={{ position: "sticky", zIndex: 1 }}>
                      Name
                    </TableHeaderCell>
                    {weeks.map((week, idx) => (
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
                  {Object.entries(myProjects).map(
                    ([student, studentData], idx) => {
                      let name = `${studentData.name} (${student})`;
                      let hoursPerWeek = studentData.hoursPerWeek;
                      let totalHours = studentData.totalHours;
                      let avgHours =
                        weeksWorked === 0
                          ? studentData.avgHours
                          : studentData.totalHours / weeksWorked;
                      return (
                        <TableRow>
                          <TableCell style={{ whiteSpace: "nowrap" }}>
                            {name}
                          </TableCell>
                          {hoursPerWeek.map((week, idx) => (
                            <TableCell>{week}</TableCell>
                          ))}
                          <TableCell>{avgHours}</TableCell>
                          <TableCell>{totalHours}</TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </div>
            <p style={{ marginTop: "10px" }}>
              Average Hours calculations only include weeks in which a team
              member reported hours.
            </p>
          </div>
        ),
      }}
    />
  );
}
