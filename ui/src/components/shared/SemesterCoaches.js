import React from 'react'
import { Accordion, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, Icon } from 'semantic-ui-react';
import { USERTYPES } from '../util/constants';
import ViewProjectMembers from './ViewProjectMembers';

export default function SemesterCoaches({ coaches }) {

    const content = (coach) => {
        return <div className="accordion-button-group">
            <Accordion
                fluid
                styled
                panels={[{
                    key: coach.system_id,
                    title: `${coach.fname} ${coach.lname}`,
                    content: {
                        content: <Table>
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
                                {coach.projects?.map(project => {
                                    return <TableRow key={project.project_id}>
                                        <TableCell>{project.title}</TableCell>
                                        <TableCell>{project.organization}</TableCell>
                                        <TableCell>{project.status}</TableCell>
                                        <TableCell><ViewProjectMembers projectId={project.project_id} projectName={project.title} type={USERTYPES.COACH} /></TableCell>
                                        <TableCell><ViewProjectMembers projectId={project.project_id} projectName={project.title} type={USERTYPES.STUDENT} /></TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    }
                }]}
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
    }

    console.log("coaches", coaches);

    return (coaches && coaches.map(coach => content(coach)))
}
