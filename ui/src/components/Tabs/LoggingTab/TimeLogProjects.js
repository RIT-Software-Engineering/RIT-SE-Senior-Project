import React, { useState } from "react";
import { Accordion } from "semantic-ui-react";
import {
  formatDateTime,
  formatDate,
  isSemesterActive,
} from "../../util/functions/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Divider,
} from "semantic-ui-react";
import _ from "lodash";

import { USERTYPES } from "../../util/functions/constants";
import TimeLogPanel from "./TimeLogPanel";
import TimeLogDelete from "./TimeLogDelete";
import WeeklyHoursViewer from "./WeeklyHoursViewer";

export default function TimeLogProjects(props) {
  const semesterProjects = props.semesterProjects;
  const onlySemesters = props.onlySemesters;
  const projectTimelogs = props.projectTimelogs;
  const myProjects = props.myProjects;
  const projectsData = props.projectsData;
  const prevLogin = props.prevLogin;
  const currentUser = props.user;
  const [activeSemesters, setActiveSemesters] = useState({});
  let initialActive = {};

  const semTable = () => {
    return Object.keys(semesterProjects)
      .sort()
      .reverse()
      .map((semester, idx) => {
        initialActive[semester] = isSemesterActive(
          onlySemesters[semester].start_date,
          onlySemesters[semester].end_date
        );

        if (
          Object.keys(activeSemesters).length === 0 &&
          !_.isEqual(activeSemesters, initialActive)
        ) {
          setActiveSemesters(initialActive);
        }
        return (
          <div className="accordion-button-group">
            <Accordion
              fluid
              styled
              onTitleClick={() => {
                setActiveSemesters({
                  ...activeSemesters,
                  [semester]: !activeSemesters[semester],
                });
              }}
              panels={[
                {
                  key: { idx },
                  title: `${onlySemesters[semester].name}`,
                  active: activeSemesters[semester],
                  content: {
                    content: projectTable(semester),
                  },
                },
              ]}
            />
          </div>
        );
      });
  };

  const projectTable = (semester) => {
    return Object.keys(semesterProjects[semester]).map((project, idx) => {
      projectTimelogs[project]?.timelogs.sort(
        (a, b) => b.time_log_id - a.time_log_id
      );

      const weeksWorked = projectsData[project].weeklyHours.filter(
        (v) => v != 0
      ).length;

      return (
        <div className="accordion-button-group">
          <Accordion
            fluid
            styled
            panels={[
              {
                key: idx,
                title: `${semesterProjects[semester][project]}`,
                content: {
                  content: (
                    <div>
                      <div
                        style={{
                          maxHeight: "500px",
                          overflowY: "auto",
                        }}
                      >
                        <Table>
                          <TableHeader style={{ position: "sticky" }}>
                            <TableRow>
                              <TableHeaderCell>Name</TableHeaderCell>
                              <TableHeaderCell>Date of Work</TableHeaderCell>
                              <TableHeaderCell>Time (hrs)</TableHeaderCell>
                              <TableHeaderCell>Comment</TableHeaderCell>
                              <TableHeaderCell>Submission Date</TableHeaderCell>
                              <TableHeaderCell>Delete</TableHeaderCell>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {projectTimelogs[project]?.timelogs.map(
                              (timeLog, idx) => {
                                let submittedBy = `${timeLog.name} (${timeLog.system_id})`;
                                if (
                                  timeLog.mock_id != "undefined" &&
                                  timeLog.mock_id != null &&
                                  timeLog.mock_id != ""
                                ) {
                                  submittedBy = `${timeLog.mock_name} (${timeLog.mock_id}) as ${timeLog.name} (${timeLog.system_id})`;
                                }
                                let showNewSubmissionHighlight =
                                  new Date(timeLog.submission_datetime) >
                                  prevLogin;
                                const isNotDeactivated =
                                  timeLog.active === null;

                                let date = timeLog.work_date.split("-");

                                return (
                                  <TableRow
                                    style={{
                                      background: showNewSubmissionHighlight
                                        ? "#fffaf3"
                                        : "none",
                                      fontWeight: showNewSubmissionHighlight
                                        ? "bold"
                                        : "none",
                                      backgroundColor: isNotDeactivated
                                        ? "transparent"
                                        : "#d1d1d1",
                                    }}
                                  >
                                    <TableCell>{submittedBy}</TableCell>
                                    <TableCell>
                                      {`${date[1]}/${date[2]}/${date[0]}`}
                                    </TableCell>
                                    <TableCell>{timeLog.time_amount}</TableCell>
                                    <TableCell>
                                      {timeLog.work_comment}
                                    </TableCell>
                                    <TableCell>
                                      {formatDateTime(
                                        timeLog.submission_datetime
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="delete-button-container">
                                        {timeLog.active === null &&
                                        projectsData[project].details.status ===
                                          "in progress" &&
                                        timeLog.system_id ===
                                          currentUser.user ? (
                                          <TimeLogDelete
                                            header="Confirm Delete?"
                                            body={
                                              <div>
                                                <p>
                                                  <b>Semester/Project:</b>{" "}
                                                  {onlySemesters[semester].name}{" "}
                                                  -{" "}
                                                  {
                                                    semesterProjects[semester][
                                                      project
                                                    ]
                                                  }
                                                </p>
                                                <p>
                                                  <b>Number of hours:</b>{" "}
                                                  {timeLog.time_amount}
                                                </p>
                                                <p>
                                                  <b>Comment:</b>{" "}
                                                  {timeLog.work_comment}
                                                </p>
                                                <p>
                                                  <b>Time log submitted by:</b>{" "}
                                                  {submittedBy}
                                                </p>

                                                <Divider />
                                                <h3>Deletion</h3>
                                                {
                                                  <p>
                                                    {`Click submit to delete this time log entry.
                                                        Deleted time logs will not be calculated in totals. This action cannot be undone.`}
                                                  </p>
                                                }
                                              </div>
                                            }
                                            dataOnSubmit={
                                              currentUser.isMock
                                                ? `Deleted by ${currentUser.mockUser.fname} ${currentUser.mockUser.lname} on `
                                                : `Deleted by ${currentUser.fname} ${currentUser.lname} on `
                                            }
                                            mockUser={currentUser.mockUser}
                                            timelog={timeLog}
                                            user={currentUser}
                                            reloadData={props.reloadData}
                                            project={project}
                                          />
                                        ) : (
                                          timeLog.active
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>{props.pastWeek}</TableHeaderCell>
                            <TableHeaderCell>
                              {props.currentWeek}
                            </TableHeaderCell>
                            <TableHeaderCell>Average (hrs)</TableHeaderCell>
                            <TableHeaderCell>Total (hrs)</TableHeaderCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(myProjects[project]).map(
                            ([student, studentData], idx) => {
                              let name = `${studentData.name} (${student})`;
                              return (
                                <TableRow>
                                  <TableCell>{name}</TableCell>
                                  <TableCell>{studentData.lastWeek}</TableCell>
                                  <TableCell>{studentData.thisWeek}</TableCell>
                                  <TableCell>
                                    {weeksWorked === 0
                                      ? studentData.avgHours
                                      : (
                                          studentData.totalHours / weeksWorked
                                        ).toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    {studentData.totalHours}
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        </TableBody>
                      </Table>

                      <div>
                        <WeeklyHoursViewer
                          header="Hours by the Week"
                          project={semesterProjects[semester][project]}
                          myProjects={myProjects[project]}
                          weeksWorked={weeksWorked}
                          weeks={onlySemesters[semester].weeks}
                          isOpenCallback={() => {}}
                        />
                      </div>
                    </div>
                  ),
                },
              },
            ]}
          />

          {currentUser.role === USERTYPES.STUDENT &&
            projectsData[project].details.status === "in progress" && (
              <div className="accordion-buttons-container">
                <TimeLogPanel
                  header="Log Time"
                  mockUser={currentUser.isMock ? currentUser.mockUser : ""}
                  project={project}
                  user={currentUser}
                  reloadData={props.reloadData}
                />
              </div>
            )}
        </div>
      );
    });
  };

  return semTable();
}
