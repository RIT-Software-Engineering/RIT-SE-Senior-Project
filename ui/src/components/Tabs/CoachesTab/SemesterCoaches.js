import React from "react";
import {
  Accordion,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Icon,
} from "semantic-ui-react";
import { USERTYPES } from "../../util/functions/constants";
import ViewProjectMembers from "./ViewProjectMembers";

export default function SemesterCoaches({ coaches, semesterId }) {
  const content = (coach) => {
    return (
      <div
        className="accordion-button-group"
        key={`${coach.system_id}-button-group`}
      >
        <Accordion
          fluid
          styled
          key={coach.system_id}
          panels={[
            {
              key: coach.system_id,
              title: `${coach.fname} ${coach.lname}`,
              content: {
                content: (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>Project</TableHeaderCell>
                        <TableHeaderCell>Organization</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>Coaches</TableHeaderCell>
                        <TableHeaderCell>Students</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coach.projects
                        ?.filter(
                          (project) =>
                            project.semester_id === semesterId.toString()
                        )
                        ?.map((project) => {
                          return (
                            <TableRow key={project.project_id}>
                              <TableCell>{project.title}</TableCell>
                              <TableCell>{project.organization}</TableCell>
                              <TableCell>{project.status}</TableCell>
                              <TableCell>
                                <ViewProjectMembers
                                  projectId={project.project_id}
                                  projectName={project.title}
                                  type={USERTYPES.COACH}
                                />
                              </TableCell>
                              <TableCell>
                                <ViewProjectMembers
                                  projectId={project.project_id}
                                  projectName={project.title}
                                  type={USERTYPES.STUDENT}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                ),
              },
            },
          ]}
        />
        <div className="accordion-buttons-container">
          <a
            href={`mailTo:${coach.email}`}
            className="ui icon button"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="mail" />
          </a>
        </div>
      </div>
    );
  };

  return coaches && coaches.map((coach) => content(coach));
}
