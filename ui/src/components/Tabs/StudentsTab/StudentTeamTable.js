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
  let tableHeaderCells = [];
  let login = true;

  if (!props.studentsTab) {
    tableHeaderCells.push(
      <TableHeaderCell
        key={"student-team-table-id"}
        // sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
        // onClick={() => changeSort(COLUMNS.DATE)}
      >
        ID
      </TableHeaderCell>
    );

    tableHeaderCells.push(
      <TableHeaderCell
        key={"student-team-table-name"}
        // sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
        // onClick={() => changeSort(COLUMNS.DATE)}
      >
        Name
      </TableHeaderCell>
    );

    tableHeaderCells.push(
      <TableHeaderCell
        key={"student-team-table-email"}
        // sorted={proposalData.column === COLUMNS.ACTION ? proposalData.direction : null}
        // onClick={() => changeSort(COLUMNS.ACTION)}
      >
        Email
      </TableHeaderCell>
    );
    tableHeaderCells.push(
      <TableHeaderCell key={"student-tab-table-login"}>
        Last Login
      </TableHeaderCell>
    );
  } else {
    tableHeaderCells.push(
      <TableHeaderCell
        key={"student-tab-table-name"}
        // sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
        // onClick={() => changeSort(COLUMNS.DATE)}
      >
        Name
      </TableHeaderCell>
    );

    tableHeaderCells.push(
      <TableHeaderCell
        key={"student-tab-table-project"}
        // sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
        // onClick={() => changeSort(COLUMNS.DATE)}
      >
        Project Name
      </TableHeaderCell>
    );

    tableHeaderCells.push(
      <TableHeaderCell
        key={"student-tab-table-email"}
        // sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
        // onClick={() => changeSort(COLUMNS.DATE)}
      >
        Email
      </TableHeaderCell>
    );

    /**
     * If the user is a student and it is the first table in the students tab, then it will
     * display last login of teammates. Otherwise it won't, unless you are any other type of user.
     * This only effects the students tab and the users in the admin tab.
     **/
    if (props.isStudent) {
      if (props.firstTable) {
        tableHeaderCells.push(
          <TableHeaderCell key={"student-tab-table-login"}>
            Last Login
          </TableHeaderCell>
        );
      } else {
        login = false;
      }
    } else {
      tableHeaderCells.push(
        <TableHeaderCell key={"student-tab-table-login"}>
          Last Login
        </TableHeaderCell>
      );
    }
  }

  const table = (
    <Table sortable>
      <TableHeader>
        <TableRow key="studentTeamTableHeaders">
          {tableHeaderCells}
          {!props.viewOnly && (
            <TableHeaderCell
            // sorted={proposalData.column === COLUMNS.EDIT ? proposalData.direction : null}
            // onClick={() => changeSort(COLUMNS.EDIT)}
            >
              Action
            </TableHeaderCell>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.students?.map((student) => (
          <StudentRow
            key={student.system_id}
            student={student}
            showLogin={login}
            semesterData={props.semesterData}
            projectsData={props.projectsData}
            viewOnly={props.viewOnly}
            studentsTab={props.studentsTab}
          />
        ))}
      </TableBody>
    </Table>
  );

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
              content: table,
            },
          },
        ]}
      />
      <div className="accordion-buttons-container">
        <a
          href={`mailTo:${props.students
            ?.map((student) => student.email)
            .join(",")}`}
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
