import React, { useEffect, useState } from 'react'
import { Dropdown, Icon, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';

const PROJECT_STATUSES = {
    SUBMITTED: "submitted",
    NEEDS_REVISION: "needs revision",
    FUTURE_PROJECT: "future project",
    CANDIDATE: "candidate",
    IN_PROGRESS: "in progress",
    COMPLETE: "completed",
    ARCHIVED: "archive",
}

export default function Proposals() {

    const [proposals, setProposals] = useState();

    useEffect(() => {

        // TODO: Do pagination
        fetch("http://localhost:3001/db/getProposals")
            .then((response) => response.json())
            .then((proposals) => {
                const restructuredProposals = {}
                proposals.forEach((proposal) => {
                    restructuredProposals[proposal.project_id] = proposal;
                })
                setProposals(restructuredProposals)
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            })
    }, []);

    const generateActions = (proposal) => {
        const options = Object.keys(PROJECT_STATUSES).map((status, idx) => {
            return {key:  idx, text: PROJECT_STATUSES[status], value: PROJECT_STATUSES[status]}
        })

        return <Dropdown 
            selection
            loading={proposal.loading}
            disabled={proposal.loading}
            options={options}
            defaultValue={proposal.status}
            onChange={(event, change) => {
                setProposals({...proposals, [proposal.project_id]: {...proposal, loading: true}})
                fetch("http://localhost:3001/db/updateProposalStatus", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        project_id: proposal.project_id,
                        status: change.value
                    })
                })
                .then((response) => {
                    if (response.ok) {
                        setProposals({...proposals, [proposal.project_id]: {...proposal, status: change.value, loading: false}})
                    } else {
                        throw response;
                    }
                }).catch((error) => {
                    console.error(error);
                })
            }}
        />
    }

    const renderProposals = () => {

        if(!proposals) {
            return <TableRow textAlign='center'><TableCell><Icon name="spinner"/></TableCell></TableRow>;
        }

        if(Object.keys(proposals).length === 0) {
            return <TableRow textAlign='center'><TableCell>No proposals</TableCell></TableRow>;
        }

        return(Object.keys(proposals).map((proposal_id, idx) => {
            const proposal = proposals[proposal_id];
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
                <TableCell>{proposal.title.split("_")[0]}</TableCell>{/* TODO: This is dumb -- Consider adding submission date to projects table */}
                <TableCell>{generateActions(proposal)}</TableCell>
                <TableCell>{proposal.status}</TableCell>
                <TableCell>
                    <a href={`http://localhost:3001/db/getProposalPdf?name=${proposal.title}.pdf`} target="_blank" rel="noreferrer">
                        {proposal.display_name || proposal.title}
                    </a>
                </TableCell>
                <TableCell>
                {proposal.attachments?.split(', ').map((attachment, attachmentIdx) => {
                    return (<React.Fragment key={attachmentIdx}>
                                <a href={`http://localhost:3001/db/getProposalAttachment?proposalTitle=${proposal.title}&name=${attachment}`} target="_blank" rel="noreferrer">
                                    {attachment}
                                </a><br/>
                            </React.Fragment>)
                })}
                </TableCell>
            </TableRow>
        }));
    }

    return (
        <Table sortable>
            <TableHeader>
                <TableRow>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Action</TableHeaderCell>
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
