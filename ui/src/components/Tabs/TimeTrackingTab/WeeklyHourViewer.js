import { useState } from "react";

import {
  Button,
  Icon,
  Modal,
  Segment,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config } from "../../util/functions/constants";
import ProfileCircle from "../../util/components/ProfileCircle";
import "./../../../css/components/tabs/weeklyhour.css";

const { isSameWeek, addDays } = require("date-fns");

export default function WeeklyHourViewer(props) {
  const [open, setOpen] = useState(false);

  let maxTime = props.timeLog.reduce(
    (max, log) => Math.max(max, log.time_amount),
    0,
  );

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

    if (total === 0 || parseFloat(total) / parseInt(total) === 1) {
      return total;
    }
    return total.toFixed(2);
  };

  return (
    <Modal
      closeOnDimmerClick={false}
      size={"fullscreen"}
      className={"sticky"}
      closeIcon={true}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
      trigger={
        <div>
          {props.trigger || (
            <Button icon className="weeklyhour-icon">
              <Icon name="calendar" />
              Time Log Report
            </Button>
          )}
        </div>
      }
    >
      <Modal.Header className="weeklyhour-header">
        {props.projectName} Time Log Report
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Segment basic secondary className="weeklyhour-info-segment">
            <p className="weeklyhour-info-text">
              <strong className="weeklyhour-info-strong">
                How this report works:
              </strong>{" "}
              This table shows the total hours logged by each team member for
              each week of the semester. Weeks are calculated from Sunday to
              Saturday, spanning from the semester start date to end date. Only
              active (non-deleted) time entries are included in the
              calculations. Hours are displayed as decimal values (e.g., 1.5
              hours = 1 hour 30 minutes). Each cell represents the sum of all
              time logged during that specific week period.{" "}
              <strong className="weeklyhour-info-strong">Note:</strong> Weeks
              that include 5 or more break period days (holidays, semester
              breaks, etc.) are not included in average calculations to provide
              more accurate work hour metrics.
            </p>
          </Segment>
          <Segment className="weeklyhour-segment">
            <Table celled>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  {props.weeks !== undefined &&
                    props.weeks.map((week) => (
                      <TableHeaderCell key={week.toISOString()}>
                        {week.toLocaleDateString()} to{" "}
                        {addDays(week, 7).toLocaleDateString()}
                      </TableHeaderCell>
                    ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {props.students.map((stu) => (
                  <TableRow key={stu.name}>
                    <TableCell>
                      <div className="weeklyhour-table-cell">
                        <ProfileCircle
                          name={stu.name}
                          showFullName
                          size="tiny"
                        />
                      </div>
                    </TableCell>
                    {props.weeks !== undefined &&
                      props.weeks.map((week) => {
                        const total = getTotalTime(week, stu.name);
                        const percent =
                          maxTime > 0
                            ? Math.min(100, (parseFloat(total) / maxTime) * 100)
                            : 0;
                        return (
                          <TableCell
                            key={week.toISOString() + stu.name}
                            className="weeklyhour-table"
                          >
                            <div
                              className="weeklyhour-bar"
                              style={{
                                background:
                                  percent > 0
                                    ? `linear-gradient(to top, var(--action-bar-proposal-blue) ${percent}%, transparent ${percent}%)`
                                    : "transparent",
                                borderBottom:
                                  percent > 0
                                    ? "0px solid transparent"
                                    : "5px solid var(--action-bar-proposal-blue)",
                              }}
                            />
                            <div className="weeklyhour">{total}</div>
                          </TableCell>
                        );
                      })}
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
