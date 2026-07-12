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

const { isSameWeek, addDays } = require("date-fns");

export default function WeeklyHourViewer(props) {
  const [open, setOpen] = useState(false);

  // Check if dark mode is active
  const isDarkMode = document.body.classList.contains("dark-mode");

  const infoTextStyle = {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.4",
    color: isDarkMode ? "#ffffff" : "#333333",
  };

  const strongTextStyle = {
    color: isDarkMode ? "#ffffff" : "#333333",
  };

  const segmentStyle = {
    padding: "1em",
    marginBottom: "1em",
    backgroundColor: isDarkMode ? "#2a2a2a" : "#f8f9fa",
    border: `1px solid ${isDarkMode ? "#444444" : "#dee2e6"}`,
    color: isDarkMode ? "#ffffff" : "#333333",
  };

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
          <Segment basic secondary style={segmentStyle}>
            <p style={infoTextStyle}>
              <strong style={strongTextStyle}>How this report works:</strong>{" "}
              This table shows the total hours logged by each team member for
              each week of the semester. Weeks are calculated from Sunday to
              Saturday, spanning from the semester start date to end date. Only
              active (non-deleted) time entries are included in the
              calculations. Hours are displayed as decimal values (e.g., 1.5
              hours = 1 hour 30 minutes). Each cell represents the sum of all
              time logged during that specific week period.{" "}
              <strong style={strongTextStyle}>Note:</strong> Weeks that include
              5 or more break period days (holidays, semester breaks, etc.) are
              not included in average calculations to provide more accurate work
              hour metrics.
            </p>
          </Segment>
          <Segment style={{ overflow: "auto", maxWidth: "100%" }}>
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
                      <div style={{ display: "flex", alignItems: "center" }}>
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
                            style={{
                              position: "relative",
                              background: "none",
                              padding: 0,
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                background:
                                  percent > 0
                                    ? `linear-gradient(to top, var(--action-bar-proposal-blue) ${percent}%, transparent ${percent}%)`
                                    : "transparent",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                zIndex: 0,
                                borderRadius: "4px",
                                opacity: 0.2,
                                borderBottom:
                                  percent > 0
                                    ? "0px solid transparent"
                                    : "5px solid var(--action-bar-proposal-blue)",
                              }}
                            />
                            <div
                              style={{
                                position: "relative",
                                zIndex: 1,
                                padding: "0.5em",
                                textAlign: "center",
                              }}
                            >
                              {total}
                            </div>
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
