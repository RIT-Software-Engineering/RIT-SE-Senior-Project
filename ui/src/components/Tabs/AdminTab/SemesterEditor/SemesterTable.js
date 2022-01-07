import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import {formatDateNoOffset} from "../../../util/functions/utils";
import SemesterPanel from "./SemesterPanel";

export default function SemesterTable(props) {
    const renderSemester = () => {
        return props.semesters.map((semester, i) => {
            return (
                <TableRow key={i}>
                    <TableCell>{`${semester.name} (ID: ${semester.semester_id})`}</TableCell>
                    <TableCell>{semester.dept}</TableCell>
                    <TableCell>{formatDateNoOffset(semester.start_date)}</TableCell>
                    <TableCell>{formatDateNoOffset(semester.end_date)}</TableCell>

                    <TableCell>
                        <SemesterPanel
                            semester={semester}
                            semesterData={props.semesterData}
                            header={`Currently Editing "${semester.name} (${semester.semester_id})"`}
                            key={"editSemester-" + i}
                        />
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <>
            <Table sortable>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell
                        // sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
                        // onClick={() => changeSort(COLUMNS.DATE)}
                        >
                            Semester Name (Semester ID)
                        </TableHeaderCell>
                        <TableHeaderCell
                        // sorted={proposalData.column === COLUMNS.ACTION ? proposalData.direction : null}
                        // onClick={() => changeSort(COLUMNS.ACTION)}
                        >
                            Department
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
                            End Date
                        </TableHeaderCell>
                        <TableHeaderCell
                        // sorted={proposalData.column === COLUMNS.ATTACHMENTS ? proposalData.direction : null}
                        // onClick={() => changeSort(COLUMNS.ATTACHMENTS)}
                        >
                            Edit
                        </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>{renderSemester()}</TableBody>
            </Table>
        </>
    );
}
