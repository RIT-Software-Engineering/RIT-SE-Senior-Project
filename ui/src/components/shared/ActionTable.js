import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Button,
    Modal,
    Accordion,
} from "semantic-ui-react";
import ActionPanel from "./ActionPanel";

export default function ActionTable(props) {
    const renderActions = () => {
        return props.actions.map((action, i) => {
            return (
                <TableRow>
                    <TableCell>{action.action_title}</TableCell>

                    <TableCell>{action.action_target}</TableCell>
                    <TableCell>{action.start_date}</TableCell>
                    <TableCell>{action.due_date}</TableCell>
                    <TableCell>
                        <Modal
                            trigger={<Button icon="edit" />}
                            header={`Currently Editing "${action.action_title}"`}
                            content={{
                                content: (
                                    <ActionPanel
                                        actionData={action}
                                        semesterData={props.semesterData}
                                        key={"editAction-" + i}
                                    />
                                ),
                            }}
                            actions={[
                                {
                                    key: "submit",
                                    content: "Submit",
                                    // onClick: (event, target) => submitProject(event, target),
                                    positive: true,
                                },
                            ]}
                        />
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <>
            <Accordion
                fluid
                styled
                panels={[
                    {
                        title: props.actions[0].name,
                        content: {
                            content: (
                                <Table sortable>
                                    <TableHeader>
                                        <TableRow>
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
