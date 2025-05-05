import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { formatDateTime } from "../../util/functions/utils";
import SubmissionsFileData from "./SubmissionsFileData";
import _ from "lodash";
import SubmissionsLateData from "./SubmissionsLateData";

export default function SubmissionsTable(props) {

  return (
    <>
      <Table celled>
        <TableHeader>
          <TableRow>
          <TableHeaderCell>Project</TableHeaderCell>
          <TableHeaderCell>Submitted By</TableHeaderCell>
          <TableHeaderCell>Submission Time</TableHeaderCell>
          <TableHeaderCell>Submission Data</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
            {props.submissions.map((log, idx) => {
              let submittedBy = `${log.name} (${log.system_id})`;
              if (log.mock_id) {
                submittedBy = `${log.mock_name} (${log.mock_id}) as ${log.name} (${log.system_id})`;
              }
              return(
                <TableRow key={idx}>
                  <TableCell>{log.title}</TableCell>
                  <TableCell>{submittedBy}</TableCell>
                  <TableCell>
                    {formatDateTime(log.submission_datetime)}
                    <SubmissionsLateData
                      log={log}
                    />
                  </TableCell>
                  <TableCell>
                    <>
                      <SubmissionsFileData
                        log={log}
                        target={props.target}
                        isOpenCallback={props.isOpenCallback}
                      />
                    </>
                  </TableCell>
                </TableRow>
              )
          })}
        </TableBody>
      </Table>
    </>
  );
}