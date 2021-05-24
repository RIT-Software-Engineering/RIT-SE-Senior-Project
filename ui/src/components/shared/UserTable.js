import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import UserPanel from "./UserPanel";

//This and all references should be removed, I think I stopped using it
export default function UserTable(props) {
    const renderUser = () => {
        return props.users.map((user, i) => {
            return (
                <TableRow key={i}>
                    <TableCell>{user.system_id}</TableCell>
                    <TableCell>{user.fname}</TableCell>
                    <TableCell>{user.lname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>{user.semester_id}</TableCell>
                    <TableCell>{user.project}</TableCell>
                    <TableCell>{user.active}</TableCell>
                    <TableCell>
                        <UserPanel
                            userData={user}
                            semesterData={props.semesterData}
                            header={`Currently Editing "${user.fname} ${user.lname}"`}
                            key={"editAction-" + i}
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
                            Username
                        </TableHeaderCell>
                        <TableHeaderCell
                        >
                            First Name
                        </TableHeaderCell>
                        <TableHeaderCell
                        >
                            Last Name
                        </TableHeaderCell>
                        <TableHeaderCell
                        >
                            Email
                        </TableHeaderCell>
                        <TableHeaderCell
                        >
                            User Type
                        </TableHeaderCell>
                        <TableHeaderCell
                        >
                            Semester
                        </TableHeaderCell>
                        <TableHeaderCell
                        >
                            Project
                        </TableHeaderCell>
                        <TableHeaderCell
                        >
                            Active User?
                        </TableHeaderCell>
                        <TableHeaderCell
                        // sorted={proposalData.column === COLUMNS.EDIT ? proposalData.direction : null}
                        // onClick={() => changeSort(COLUMNS.EDIT)}
                        >
                            Edit
                        </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>{renderUser()}</TableBody>
            </Table>
        </>
    );
}
