import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Accordion,
} from "semantic-ui-react";
import _ from "lodash";
import ActionPanel from "./ActionPanel";
import { formatDateNoOffset } from "../../../util/functions/utils";
import PreviewHtml from "../../../util/components/PreviewHtml";
import GanttChart from "../../DashboardTab/TimelinesView/Timeline/GanttChart";

export default function ActionTable(props) {
  // TODO: This is pretty inefficient and will get slower as more semesters are added - find better way to handle this.
  const semester = props.semesterData.find(
    (s) => s.semester_id === props.actions[0]?.semester,
  );
  const project = props.projectData.find(
    (project) => project.semester === props.actions[0]?.semester,
  );

  // if there is no semester, then there are no actions
  const semesterName = semester?.name || "No Semester";
  const semesterStart = semester?.start_date || "No Start Date";
  const semesterEnd = semester?.end_date || "No End Date";

  const projectTitle = project?.title || "No Project";
  const projectId = project?.project_id || "No Project Id";

  // const semesterName = props.semesterData.find(semester => props.actions[0].semester === semester.semester_id)?.name;
  const [open, setOpen] = React.useState("false");
  const [closeOnDocClick, setCloseOnDocClick] = useState(true);

  function isOpenCallback(isOpen) {
    setCloseOnDocClick(!isOpen);
  }

  const renderActions = () => {
    let actions = _.sortBy(props.actions, ["due_date", "start_date"]);

    return actions.map((action, i) => {
      return (
        <TableRow key={i}>
          <TableCell>{action.action_title}</TableCell>
          <TableCell>{action.action_target}</TableCell>
          <TableCell>{formatDateNoOffset(action.start_date)}</TableCell>
          <TableCell>{formatDateNoOffset(action.due_date)}</TableCell>
          <TableCell>
            <div
              className="accordion-buttons-container"
              style={{ position: "initial" }}
            >
              <ActionPanel
                actionData={action}
                semesterData={props.semesterData}
                header={`Currently Editing "${action.action_title}"`}
                key={"editAction-" + i}
                callback={props.callback}
              />
              <ActionPanel
                actionData={action}
                semesterData={props.semesterData}
                header={`Currently Copying "${action.action_title}"`}
                create={true}
                buttonIcon={"clone outline"}
                key={"copyAction-" + i}
                callback={props.callback}
              />
              <PreviewHtml
                autoLoadSubmissions={props.autoLoadSubmissions}
                action={action}
                projectName={projectTitle}
                projectId={projectId}
                semesterName={semesterName}
                header={`Currently Viewing "${action.action_title}"`}
                key={"viewHtml-" + i}
              />
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  let title;
  if (props.actions[0].name === null) {
    title = "No semester";
  } else {
    title = semesterName;
  }

  return (
    <>
      <Accordion
        fluid
        styled
        panels={[
          {
            key: "actionEditor",
            title: title || "No Semester",
            content: {
              content: (
                <div>
                  <Table sortable>
                    <TableHeader>
                      <TableRow key={"actionEditorTableHeaders"}>
                        <TableHeaderCell
                        // sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
                        // onClick={() => changeSort(COLUMNS.DATE)}
                        >
                          Action Title
                        </TableHeaderCell>

                        <TableHeaderCell
                        // sorted={proposalData.column === COLUMNS.ACTION ? proposalData.direction : null}
                        // onClick={() => changeSort(COLUMNS.ACTION)}
                        >
                          Action Target
                        </TableHeaderCell>
                        <TableHeaderCell
                        // sorted={proposalData.column === COLUMNS.TITLE ? proposalData.direction : null}
                        // onClick={() => changeSort(COLUMNS.TITLE)}
                        >
                          Start Date
                        </TableHeaderCell>
                        <TableHeaderCell
                        // sorted={proposalData.column === COLUMNS.ATTACHMENTS ? proposalData.direction : null}
                        // onClick={() => changeSort(COLUMNS.ATTACHMENTS)}
                        >
                          Due Date
                        </TableHeaderCell>
                        <TableHeaderCell
                        // sorted={proposalData.column === COLUMNS.EDIT ? proposalData.direction : null}
                        // onClick={() => changeSort(COLUMNS.EDIT)}
                        >
                          Edit
                        </TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{renderActions()}</TableBody>
                  </Table>
                  <GanttChart
                    autoLoadSubmissions
                    admin="true"
                    semesterData={props.semesterData}
                    semesterName={semesterName}
                    projectName={projectTitle}
                    projectId={projectId}
                    projectStart={semesterStart}
                    projectEnd={semesterEnd}
                    actions={props.actions}
                    isOpen={open}
                  />
                </div>
              ),
            },
          },
        ]}
        onTitleClick={(e, data) => setOpen(data.active)}
      />
    </>
  );
}
