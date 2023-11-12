import React from "react";
import { formatDateTime } from "../../util/functions/utils";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Icon,
} from "semantic-ui-react";
import SubmissionViewerModal from "../DashboardTab/TimelinesView/Timeline/SubmissionViewerModal";
import { USERTYPES } from "../../util/functions/constants";

export default function ActionSubmissions(props) {
  const actionLogs = props.actionLogs;
  const actionLogCount = props.actionLogCount;
  const onlySemesters = props.onlySemesters;
  const userContext = props.userContext;
  const prevLogin = props.prevLogin;

  const LOGS_PER_PAGE = 50;

  const table = () => {
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {userContext.user?.role !== USERTYPES.STUDENT && (
                <TableHeaderCell>Project</TableHeaderCell>
              )}
              <TableHeaderCell>Action</TableHeaderCell>
              <TableHeaderCell>Action Type</TableHeaderCell>
              <TableHeaderCell>Submitted By</TableHeaderCell>
              <TableHeaderCell>Submission Time</TableHeaderCell>
              <TableHeaderCell>View</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actionLogs?.map((action, idx) => {
              let submittedBy = `${action.name} (${action.system_id})`;
              if (action.mock_id) {
                submittedBy = `${action.mock_name} (${action.mock_id}) as ${action.name} (${action.system_id})`;
              }
              let showNewSubmissionHighlight =
                new Date(action.submission_datetime) > prevLogin;
              return (
                <TableRow
                  style={{
                    background: showNewSubmissionHighlight ? "#fffaf3" : "none",
                    fontWeight: showNewSubmissionHighlight ? "bold" : "none",
                  }}
                  key={idx}
                >
                  {userContext.user?.role !== USERTYPES.STUDENT && (
                    <TableCell>{action.display_name || action.title}</TableCell>
                  )}
                  <TableCell>{action.action_title}</TableCell>
                  <TableCell>{action.action_target}</TableCell>
                  <TableCell>{submittedBy}</TableCell>
                  <TableCell>
                    {formatDateTime(action.submission_datetime)}
                  </TableCell>
                  <TableCell>
                    {
                      <SubmissionViewerModal
                        projectName={action.display_name || action.title}
                        semesterName={onlySemesters[action.semester]?.name}
                        action={action}
                        target={action?.action_target}
                        isOpenCallback={() => {}}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="pagination-container">
          <Pagination
            defaultActivePage={1}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            prevItem={{ content: <Icon name="angle left" />, icon: true }}
            nextItem={{ content: <Icon name="angle right" />, icon: true }}
            totalPages={Math.ceil(actionLogCount / LOGS_PER_PAGE)}
            onPageChange={(event, data) => {
              props.getPaginationData(data.activePage - 1);
            }}
          />
        </div>
      </div>
    );
  };

  return table();
}
