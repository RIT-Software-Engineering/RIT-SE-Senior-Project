import React, { useEffect, useState } from 'react'
import { Icon, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';

export default function Proposals() {

    const [proposals, setProposals] = useState();

    useEffect(() => {

        // TODO: Do pagination
        fetch("http://localhost:3001/db/getProposals")
            .then((response) => response.json())
            .then((proposals) => {
                setProposals(proposals)
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            })
    }, []);

    const renderProposals = () => {

        if(!proposals) {
            return<TableRow textAlign='center'><TableCell><Icon name="spinner"/></TableCell></TableRow>;
        }

        if(proposals.length === 0) {
            return <TableRow textAlign='center'><TableCell>No proposals</TableCell></TableRow>;
        }

        return(proposals.map((proposal, idx) => {
            let rowColor;
            switch (proposal.status) {
                case "submitted":
                    rowColor="negative"
                    break;
                case "completed":
                    rowColor="positive"
                    break;
                default:
                    break;
            }

            return <TableRow warning={rowColor === "warning"} negative={rowColor === "negative"} positive={rowColor === "positive"} key={idx}>
                <TableCell>{proposal.status}</TableCell>
                <TableCell>
                    <a href={`http://localhost:3001/db/getProposalPdf?name=${proposal.title}.pdf`} target="_blank" rel="noreferrer">
                        {proposal.title}
                    </a>
                </TableCell>
                <TableCell>
                {proposal.attachments?.split(', ').map((attachment, attachmentIdx) => {
                    return (<><a href={`/db/getProposalAttachment?proposalTitle=${proposal.title}&name=${attachment}`} target="_blank" rel="noreferrer" key={attachmentIdx}>
                                {attachment}
                            </a><br/></>)
                })}
                </TableCell>
            </TableRow>
        }));
    }

    return (
        <Table sortable>
            <TableHeader>
                <TableRow>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Title</TableHeaderCell>
                    <TableHeaderCell>Attachments</TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {renderProposals()}
            </TableBody>
        </Table>
    )
}
