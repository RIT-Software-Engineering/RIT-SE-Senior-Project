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
import { formatDate } from "../util/utils";

export default function ActionTable(props) {
    const renderActions = () => {
        let actions = _.sortBy(props.actions, ["due_date", "start_date"])

        return actions.map((action, i) => {
            return (
                <TableRow key={i}>
                    <TableCell>{action.action_title}</TableCell>
                    <TableCell>{action.action_target}</TableCell>
                    <TableCell>{formatDate(action.start_date)}</TableCell>
                    <TableCell>{formatDate(action.due_date)}</TableCell>
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
                                key={"copyAction-" + i}
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
        // TODO: This is pretty inefficient and will get slower as more semesters are added - find better way to handle this.
        title = props.semesterData.find(semester => props.actions[0].semester === semester.semester_id)?.name
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
                            ),
                        },
                    },
                ]}
            />
        </>
    );
}
