import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Accordion,
  Icon,
  Pagination,
  Popup,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { formatDate, formatDateTime } from "../../util/functions/utils";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config } from "../../util/functions/constants";
import { UserContext } from "../../util/functions/UserContext";
import TimeLogPanel from "./TimeLogPanel";
import IndividualTimeModal from "./IndividualTimeModal";
import WeeklyHoursViewer from "./WeeklyHourViewer";
import ProfileCircle from "../../util/components/ProfileCircle";
import "./../../../css/components/tabs/time.css";

export default function ProjectTime(props) {
  const userContext = useContext(UserContext);
  const prevLogin = new Date(userContext.user.prev_login);
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(7);
  const [avgTime, setAvgTime] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const { eachWeekOfInterval, sub } = require("date-fns");
  const modalTriggerRef = useRef(null);
  const [openLog, setOpenLog] = useState(null);
  const [contactInfo, setContactInfo] = useState({});
  const [hoverRow, setHoverRow] = useState(null);

  useEffect(() => {
    SecureFetch(
      `${config.url.API_GET_TIME_AVG}?project_id=${props.proj.project_id}`,
    )
      .then((response) => response.json())
      .then((time) => {
        setAvgTime(time);
      });
    setWeeks(
      eachWeekOfInterval({
        start: new Date(props.semester.start_date),
        end: new Date(props.semester.end_date),
      }),
    );
  }, [userContext, props.timeLogs, props.timeStats]);

  useEffect(() => {
    if (openLog) modalTriggerRef.current?.click();
  }, [openLog]);

  const loadContactInfo = (systemId) => {
    if (!systemId || contactInfo[systemId] !== undefined) return;
    setContactInfo((prev) => ({ ...prev, [systemId]: null }));
    SecureFetch(`${config.url.API_GET_ADDITIONAL_INFO}?system_id=${systemId}`)
      .then((r) => r.json())
      .then((data) => setContactInfo((prev) => ({ ...prev, [systemId]: data })))
      .catch((err) => console.error("Error fetching additional info:", err));
  };

  const resetKey = () => {
    props.reset();
  };
  return (
    <div className="accordion-button-group">
      <Accordion
        fluid
        styled
        panels={[
          {
            key: "Project Here",
            title: props.proj.display_name || props.proj.title,
            content: {
              content: (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {/*Headers for the table */}
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Date of Work</TableHeaderCell>
                        <TableHeaderCell>Time in Hours</TableHeaderCell>
                        <TableHeaderCell>Comment</TableHeaderCell>
                        <TableHeaderCell>Submission Date</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {props.timeLogs
                        ?.filter((log) => log.project === props.proj.project_id)
                        .map((timeLog, idx) => {
                          let submittedBy = (
                            <span className="time-table">
                              <ProfileCircle
                                name={timeLog.name}
                                size="tiny"
                                isStudent={false}
                                showFullName
                                allowInfo
                              />
                              ({timeLog.system_id})
                            </span>
                          );
                          if (timeLog.mock_id) {
                            //submittedBy = `${timeLog.mock_name} (${timeLog.mock_id}) as ${timeLog.name} (${timeLog.system_id})`;
                            submittedBy = (
                              <span className="time-table">
                                <ProfileCircle
                                  name={timeLog.name}
                                  size="tiny"
                                  isStudent={false}
                                  showFullName
                                  allowInfo
                                />
                                ({timeLog.mock_id}) as&nbsp;
                                <ProfileCircle
                                  name={timeLog.name}
                                  size="tiny"
                                  isStudent={false}
                                  showFullName
                                  allowInfo
                                />
                                ({timeLog.system_id})
                              </span>
                            );
                          }
                          let showNewSubmissionHighlight =
                            new Date(timeLog.submission_datetime) > prevLogin;
                          if (
                            idx >= currentPage * postsPerPage &&
                            idx <= currentPage * postsPerPage + postsPerPage - 1
                          ) {
                            let rowClassName = "time-row-clickable";
                            if (showNewSubmissionHighlight) {
                              rowClassName += " time-row-new";
                            } else if (timeLog.active === 0) {
                              rowClassName += " time-row-deleted";
                            }
                            return (
                              <TableRow
                                className={rowClassName}
                                key={idx}
                                style={{ cursor: "pointer" }}
                                onMouseEnter={(e) => {
                                  setHoverRow({
                                    log: timeLog,
                                    x: e.clientX,
                                    y: e.clientY,
                                  });
                                  loadContactInfo(timeLog.system_id);
                                }}
                                onMouseLeave={() => setHoverRow(null)}
                                onClick={() => {
                                  setHoverRow(null);
                                  setOpenLog({
                                    log: timeLog,
                                    n: Date.now(),
                                    submittedBy,
                                  });
                                }}
                              >
                                <TableCell>
                                  <div className="time-table-cell">
                                    {timeLog.mock_id ? (
                                      <>
                                        <ProfileCircle
                                          name={timeLog.mock_name ?? ""}
                                          size="tiny"
                                          isStudent={false}
                                          showFullName
                                        />
                                        <span className="time-profile">as</span>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    <ProfileCircle
                                      name={timeLog.name ?? ""}
                                      size="tiny"
                                      isStudent={false}
                                      showFullName
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {formatDate(timeLog.work_date)}
                                </TableCell>
                                <TableCell>{timeLog.time_amount}</TableCell>
                                <TableCell>
                                  {timeLog.work_comment.length < 10
                                    ? timeLog.work_comment
                                    : timeLog.work_comment.slice(0, 10) +
                                      "...."}
                                </TableCell>
                                <TableCell>
                                  {formatDateTime(timeLog.submission_datetime)}
                                </TableCell>
                              </TableRow>
                            );
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
                      prevItem={{
                        content: <Icon name="angle left" />,
                        icon: true,
                      }}
                      nextItem={{
                        content: <Icon name="angle right" />,
                        icon: true,
                      }}
                      totalPages={Math.ceil(
                        props.timeLogs?.filter(
                          (log) => log.project === props.proj.project_id,
                        ).length / postsPerPage,
                      )}
                      onPageChange={(event, data) => {
                        setCurrentPage(data.activePage - 1);
                      }}
                    />
                    {hoverRow &&
                      (() => {
                        const log = hoverRow.log;
                        const extra = contactInfo[log.system_id];
                        const contact = extra?.contact;
                        const info = extra?.additional_info;

                        return (
                          <Popup
                            open
                            className="universal-tooltip"
                            position="bottom left"
                            offset={[0, 8]}
                            trigger={
                              <span
                                style={{
                                  position: "fixed",
                                  left: hoverRow.x,
                                  top: hoverRow.y,
                                  width: 0,
                                  height: 0,
                                  pointerEvents: "none",
                                }}
                              />
                            }
                            content={
                              <div>
                                {log.name}
                                {contact?.value && (
                                  <div>
                                    {contact.label}: {contact.value}
                                  </div>
                                )}
                                {info && (
                                  <div className="profile-hover">
                                    Additional Info: {info}
                                  </div>
                                )}

                                {log.work_comment && (
                                  <>
                                    <div
                                      style={{
                                        borderTop:
                                          "1px solid var(--border-color)",
                                        margin: "6px -16px",
                                      }}
                                    />
                                    <div>Comment: {log.work_comment}</div>
                                  </>
                                )}
                              </div>
                            }
                          />
                        );
                      })()}
                    {openLog && (
                      <IndividualTimeModal
                        key={openLog.n}
                        projectName={
                          props.proj.display_name || props.proj.title
                        }
                        semesterName={props.semester.name}
                        user={openLog.submittedBy}
                        timeLog={openLog.log}
                        userId={openLog.log.system_id}
                        id={openLog.log.time_log_id}
                        delete={openLog.log.active}
                        resetKey={resetKey}
                        trigger={
                          <span
                            ref={modalTriggerRef}
                            style={{ display: "none" }}
                          />
                        }
                      />
                    )}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {/*Headers for the table */}
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Average Hours</TableHeaderCell>
                        <TableHeaderCell>Total Hours</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {props.timeStats
                        ?.filter((log) => log.project === props.proj.project_id)
                        .map((timeStat, idx) => {
                          let totalHours;
                          if (
                            timeStat.total === 0 ||
                            parseFloat(timeStat.total) /
                              parseInt(timeStat.total) ===
                              1
                          ) {
                            totalHours = timeStat.total;
                          } else {
                            totalHours = timeStat.total.toFixed(2);
                          }
                          return (
                            <TableRow key={idx}>
                              <TableCell>
                                <div className="time-table-cell">
                                  <ProfileCircle
                                    name={timeStat.name}
                                    size="tiny"
                                    showFullName
                                    allowInfo
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                {avgTime[idx]?.avgTime ?? 0}
                              </TableCell>
                              <TableCell>{totalHours}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                  <div>
                    <WeeklyHoursViewer
                      projectName={props.proj.display_name || props.proj.title}
                      semesterName={props.semester.name}
                      weeks={weeks}
                      timeLog={props.timeLogs.filter(
                        (log) => log.project === props.proj.project_id,
                      )}
                      students={props.timeStats.filter(
                        (log) => log.project === props.proj.project_id,
                      )}
                    />
                  </div>
                </div>
              ),
            },
          },
        ]}
      />
      <div className="accordion-buttons-container">
        <TimeLogPanel
          callback={resetKey}
          header="Log Time"
          viewOnly={props.viewOnly}
        />
      </div>
    </div>
  );
}
