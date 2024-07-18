import React, { useState } from "react";
import {
  Accordion,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Divider,
  Icon,
} from "semantic-ui-react";
import { formatDateTime, formatDate } from "../../util/functions/utils";
import TimeLogPanel from "./TimeLogPanel";
import TimeLogDelete from "./TimeLogDelete";
import WeeklyHoursViewer from "./WeeklyHoursViewer";
import { USERTYPES } from "../../util/functions/constants";

const TIME_LOGS_PER_PAGE = 5;

export default function TimeLogProjects(props) {
  const semesters = props.semesters;
  const prevLogin = props.prevLogin;
  const currentUser = props.user;
  const pastWeek = props.pastWeek;
  const currentWeek = props.currentWeek;
  const userLogs = props.userLogs;
  const timeLogCount = props.timeLogCount;

  function getAverageHours(sum, hoursPerWeek) {
    let avg = 0;
    const filtered = hoursPerWeek.filter((item) => item != 0);

    if (filtered.length !== 0 && sum != 0) {
      avg = sum / filtered.length;
    }
    return avg.toFixed(2);
  }

  const content = (semesters) => {
    let semesterprojects = [];

    Object.keys(semesters.projects).map((projectKey, idx) => {
      if (
        semesters.projects[projectKey].students.length > 0 &&
        semesters.projects[projectKey].name !== undefined
      ) {
        semesters.projects[projectKey].timelogs.sort(
          (a, b) => b.time_log_id - a.time_log_id
        );

        semesterprojects.push(
          <div className="accordion-button-group">
            <Accordion
              fluid
              styled
              panels={[
                {
                  key: idx,
                  title: `${semesters.projects[projectKey].name}`,
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
                                <TableHeaderCell>Date</TableHeaderCell>
                                <TableHeaderCell>Time (hrs)</TableHeaderCell>
                                <TableHeaderCell>Comment</TableHeaderCell>
                                <TableHeaderCell>
                                  Submission Date
                                </TableHeaderCell>
                                <TableHeaderCell>Delete</TableHeaderCell>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {semesters.projects[projectKey].timelogs.map(
                                (timeLog, idx) => {
                                  let submittedBy = `${timeLog.name} (${timeLog.system_id})`;
                                  if (timeLog.mock_id === undefined) {
                                    submittedBy = `${timeLog.mock_name} (${timeLog.mock_id}) as ${timeLog.name} (${timeLog.system_id})`;
                                  }
                                  let showNewSubmissionHighlight =
                                    new Date(timeLog.submission_datetime) >
                                    prevLogin;
                                  const isNotDeactivated =
                                    timeLog.active === null;

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
                                      key={idx}
                                    >
                                      <TableCell>{submittedBy}</TableCell>
                                      <TableCell>
                                        {formatDate(timeLog.work_date)}
                                      </TableCell>
                                      <TableCell>
                                        {timeLog.time_amount}
                                      </TableCell>
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
                                          timeLog.system_id ===
                                            currentUser.user ? (
                                            <TimeLogDelete
                                              header="Confirm Delete?"
                                              body={
                                                <div>
                                                  <p>
                                                    <b>Semester/Project:</b>{" "}
                                                    {semesters.name} -{" "}
                                                    {
                                                      semesters.projects[
                                                        projectKey
                                                      ].name
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
                                                    <b>
                                                      Time log submitted by:
                                                    </b>{" "}
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
                                              projectKey={projectKey}
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
                        {/* <div className="pagination-container">
                          <Pagination
                            defaultActivePage={1}
                            ellipsisItem={null}
                            firstItem={null}
                            lastItem={null}
                            prevItem={{
                              content: <Icon name="angle left" />,
                              icon: true,
                            }}
                            nextItem={{
                              content: <Icon name="angle right" />,
                              icon: true,
                            }}
                            totalPages={Math.ceil(
                              timeLogCount / TIME_LOGS_PER_PAGE
                            )} //semesters.projects[projectKey].timelogs.length
                            onPageChange={(event, data) => {
                              // handlePageChange(projectKey, data.activePage - 1);
                              props.timelogPagination(data.activePage - 1);
                            }}
                          />
                        </div> */}

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHeaderCell>Name</TableHeaderCell>
                              <TableHeaderCell>{pastWeek}</TableHeaderCell>
                              <TableHeaderCell>{currentWeek}</TableHeaderCell>
                              <TableHeaderCell>Average (hrs)</TableHeaderCell>
                              <TableHeaderCell>Total (hrs)</TableHeaderCell>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {semesters.projects[projectKey].students.map(
                              (student, idx) => {
                                let submittedBy = `${student.fname} ${student.lname} (${student.system_id})`;
                                let userWeekData = userLogs[student.system_id];

                                const sum =
                                  props.userLogs[student.system_id]?.totalHours;
                                const avg = getAverageHours(
                                  sum,
                                  semesters.projects[projectKey].hoursPerWeek
                                );

                                return (
                                  <TableRow>
                                    <TableCell>{submittedBy}</TableCell>
                                    <TableCell>
                                      {userWeekData ? userWeekData.lastWeek : 0}
                                    </TableCell>
                                    <TableCell>
                                      {userWeekData ? userWeekData.thisWeek : 0}
                                    </TableCell>
                                    <TableCell>{avg}</TableCell>
                                    <TableCell>
                                      {userWeekData
                                        ? userWeekData.totalHours
                                        : 0}
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
                            project={semesters.projects[projectKey].name}
                            user={currentUser}
                            semWeeks={semesters.weeks}
                            semStudents={
                              semesters.projects[projectKey].students
                            }
                            hoursPerWeek={
                              semesters.projects[projectKey].hoursPerWeek
                            }
                            userLogs={userLogs}
                            isOpenCallback={() => {}}
                          />
                        </div>
                      </div>
                    ),
                  },
                },
              ]}
            />

            {currentUser.role === USERTYPES.STUDENT && (
              <div className="accordion-buttons-container">
                <TimeLogPanel
                  header="Log Time"
                  mockUser={currentUser.isMock ? currentUser.mockUser : ""}
                  project={projectKey}
                  user={currentUser}
                  reloadData={props.reloadData}
                />
              </div>
            )}
          </div>
        );
      }
    });

    return semesterprojects;
  };

  return content(semesters);
}
