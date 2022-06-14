import React, { useState, useEffect } from "react";
import {Accordion, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow} from "semantic-ui-react";
import { config } from "../../../util/functions/constants";
import { SecureFetch } from "../../../util/functions/secureFetch";

export default function ArchiveTable() {

    const [archive, setArchive] = useState([])

    useEffect(() => {
        SecureFetch(config.url.API_GET_ARCHIVE)
            .then((response) => response.json())
            .then((archiveData) => {
                console.log(archiveData);
                setArchive(archiveData);
            })
            .catch((err) => {
                console.log("Issue you getting archive data: ",err);
            })
    }, [])

    const table = () => {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>
                            Title
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Members
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Sponsor
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Tags
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Edit/Original
                        </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>{archive?.map((project, idx) => {
                    let title = `${project.title}`
                    let members = `${project.members}`
                    let sponsor = `${project.sponsor}`
                    let tags = [project.featured ? 'featured' : null, project.creative ? 'creative' : null, project.outstanding ? 'outstanding' : null]
                    return (
                        <TableRow key={idx}>
                            <TableCell>{title}</TableCell>
                            <TableCell>{members}</TableCell>
                            <TableCell>{sponsor}</TableCell>
                            <TableCell>{tags.filter(Boolean).join(", ")}</TableCell>
                        </TableRow>
                    )
                })}</TableBody>
            </Table>
        );
    }

    return (
        <Accordion
            fluid
            styled
            panels={[
                {
                    key: "archiveEditor",
                    title: "Archive Editor",
                    content: { content: table() },
                },
            ]}
        />
    )
}