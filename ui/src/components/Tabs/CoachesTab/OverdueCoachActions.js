import React from "react";
import { 
    Accordion,
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
 } from "semantic-ui-react";
 import CoachProjects from "./CoachProjects"

export default function OverdueCoachActions({ coaches, semesterId }) {
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
                                            <TableHeaderCell>Project Name</TableHeaderCell>
                                            <TableHeaderCell>Action Name</TableHeaderCell>
                                            <TableHeaderCell>Due Date</TableHeaderCell>
                                            </TableRow>
                                        </TableHeader>
                                    {coach.projects
                                    ?.filter(
                                        (project) =>
                                        project.semester_id === semesterId.toString(),
                                    )
                                    ?.map((project) => {
                                        return (
                                            <CoachProjects
                                            project = {project}
                                            />
                                        );
                                    })}
                                    </Table>
                                )
                            }
                        }
                    ]}
                />
            </div>
        )

    }

    return coaches && coaches.map((coach) => content(coach));
}