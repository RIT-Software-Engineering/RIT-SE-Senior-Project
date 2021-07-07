import React from "react";
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Accordion,
    Icon,
} from "semantic-ui-react";
import StudentRow from "./StudentRow";

export default function StudentTeamTable(props) {

    const table = (
        <Table sortable>
            <TableHeader>
                <TableRow key="studentTeamTableHeaders">
                    <TableHeaderCell
                    // sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
                    // onClick={() => changeSort(COLUMNS.DATE)}
                    >
                        ID
                    </TableHeaderCell>
                    <TableHeaderCell
                    // sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
                    // onClick={() => changeSort(COLUMNS.DATE)}
                    >
                        Name
                    </TableHeaderCell>

                    <TableHeaderCell
                    // sorted={proposalData.column === COLUMNS.ACTION ? proposalData.direction : null}
                    // onClick={() => changeSort(COLUMNS.ACTION)}
                    >
                        Email
                    </TableHeaderCell>
                    {!props.viewOnly && <TableHeaderCell
                    // sorted={proposalData.column === COLUMNS.EDIT ? proposalData.direction : null}
                    // onClick={() => changeSort(COLUMNS.EDIT)}
                    >
                        Action
                    </TableHeaderCell>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.students?.map(student =>
                    <StudentRow key={student.system_id} student={student} semesterData={props.semesterData} projectsData={props.projectsData} viewOnly={props.viewOnly} />
                )}

            </TableBody>
        </Table>
    )

    if (props.noAccordion) {
        return table;
    }

    return (
        <div className="accordion-button-group">
            <Accordion
                fluid
                styled
                key={"Student-TeamTable-Accordion"}
                panels={[
                    {
                        key: props.childKey,
                        title: props.title,
                        content: {
                            content: (table)
                        },
                    },
                ]}
            />
            <div className="accordion-buttons-container">
                <a
                    href={`mailTo:${props.students?.map(student => student.email).join(",")}`}
                    className="ui icon button"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Icon name="mail" />
                </a>
            </div>
        </div>
    );
}
