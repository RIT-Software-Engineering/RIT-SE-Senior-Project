import React from "react";
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
import {formatDateNoOffset} from "../../../util/functions/utils";
import PreviewHtml from "../../../util/components/PreviewHtml";
import GanttChart from "../../DashboardTab/TimelinesView/Timeline/GanttChart";

export default function ActionTable(props) {
    // TODO: This is pretty inefficient and will get slower as more semesters are added - find better way to handle this.
    const semester = props.semesterData.find(semester => props.actions[0].semester === semester.semester_id)
    const semesterName = semester.name
    const semesterStart = semester.start_date
    const semesterEnd = semester.end_date
    // const semesterName = props.semesterData.find(semester => props.actions[0].semester === semester.semester_id)?.name;

    const renderActions = () => {
        let actions = _.sortBy(props.actions, ["due_date", "start_date"])

        return actions.map((action, i) => {
            return (
                <TableRow key={i}>
                    <TableCell>{action.action_title}</TableCell>
                    <TableCell>{action.action_target}</TableCell>
                    <TableCell>{formatDateNoOffset(action.start_date)}</TableCell>
                    <TableCell>{formatDateNoOffset(action.due_date)}</TableCell>
                    <TableCell>
                        <div className="accordion-buttons-container" style={{ position: 'initial' }}>
                            <ActionPanel
                                actionData={action}
                                semesterData={props.semesterData}
                                header={`Currently Editing "${action.action_title}"`}
                                key={"editAction-" + i}
                            />
                            <ActionPanel
                                actionData={action}
                                semesterData={props.semesterData}
                                header={`Currently Copying "${action.action_title}"`}
                                create={true}
                                buttonIcon={"clone outline"}
                                key={"copyAction-" + i}
                            />
                            <PreviewHtml
                                action={action}
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
    if (props.actions[0].name === null){
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
                                        admin="true"
                                        semesterData={props.semesterData}
                                        semesterName={semesterName}
                                        semesterStart={semesterStart} 
                                        semesterEnd={semesterEnd} 
                                        actions={props.actions}
                                    />
                                </div>
                            ),
                        },
                    },
                ]}
            />
        </>
    );
}
