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
import { config } from "../../util/functions/constants";

const { isSameWeek, addDays } = require("date-fns");

export default function WeeklyHourViewer(props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const handleDelete = async function (e) {
    let body = new FormData();
    body.append("id", e);

    SecureFetch(config.url.API_DELETE_TIME_LOG, {
      method: "POST",
      body: body,
    }).then((response) => {
      console.log(response);
    });
    setOpen(false);
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

  return (
    <Modal
      closeOnDimmerClick={false}
      size={"fullscreen"}
      className={"sticky"}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
      trigger={
        <div>
          {props.trigger || (
            <Button icon style={{ width: "170px", marginLeft: "83%" }}>
              <Icon name="calendar" />
              Time Log Report
            </Button>
          )}
        </div>
      }
    >
      <Modal.Header style={{ textAlign: "center" }}>
        {props.projectName} Time Log Report
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Segment
            basic
            secondary
            style={{
              padding: "1em",
              marginBottom: "1em",
              backgroundColor: "#f8f9fa",
            }}
          >
            <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.4" }}>
              <strong>How this report works:</strong> This table shows the total
              hours logged by each team member for each week of the semester.
              Weeks are calculated from Sunday to Saturday, spanning from the
              semester start date to end date. Only active (non-deleted) time
              entries are included in the calculations. Hours are displayed as
              decimal values (e.g., 1.5 hours = 1 hour 30 minutes). Each cell
              represents the sum of all time logged during that specific week
              period.
            </p>
          </Segment>
          <Segment style={{ overflow: "auto", maxWidth: "100%" }}>
            <Table celled>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  {props.weeks != undefined &&
                    props.weeks.map((week) => (
                      <TableHeaderCell>
                        {week.toLocaleDateString()} to{" "}
                        {addDays(week, 7).toLocaleDateString()}
                      </TableHeaderCell>
                    ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {props.students.map((stu) => (
                  <TableRow>
                    <TableCell>{stu.name} </TableCell>
                    {props.weeks != undefined &&
                      props.weeks.map((week) => (
                        <TableCell>{getTotalTime(week, stu.name)}</TableCell>
                      ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Segment>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => onClose()}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
}
