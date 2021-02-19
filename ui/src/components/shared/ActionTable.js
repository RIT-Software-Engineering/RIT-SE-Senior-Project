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
import ActionPanel from "./ActionPanel";
import { formatDateTime } from "../util/utils";

export default function ActionTable(props) {
    const renderActions = () => {
        return props.actions.map((action, i) => {
            return (
                <TableRow key={i}>
                    <TableCell>{action.action_title}</TableCell>
                    <TableCell>{action.action_target}</TableCell>
                    <TableCell>{formatDateTime(action.start_date)}</TableCell>
                    <TableCell>{formatDateTime(action.due_date)}</TableCell>
                    <TableCell>
                        <ActionPanel
                            actionData={action}
                            semesterData={props.semesterData}
                            header={`Currently Editing "${action.action_title}"`}
                            key={"editAction-" + i}
                        />
                    </TableCell>
                </TableRow>
            );
        });
    };

    let title;
    if (props.actions[0].name === null){
        title = "Unassigned";
    } else {
        title = props.actions[0].name
    }
    console.log(title);
    return (
        <>
            <Accordion
                fluid
                styled
                panels={[
                    {
                        key: "actionEditor",
                        title: title,
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
