import React, { useEffect, useState } from 'react'
import { Dropdown, Icon, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';
import _ from 'lodash';
import "../../css/admin-proposal.css";

const PROJECT_STATUSES = {
    SUBMITTED: "submitted",
    NEEDS_REVISION: "needs revision",
    FUTURE_PROJECT: "future project",
    CANDIDATE: "candidate",
    IN_PROGRESS: "in progress",
    COMPLETE: "completed",
    ARCHIVED: "archive",
}

const COLUMNS = {
    DATE: 'date',
    ACTION: 'action',
    STATUS: 'status',
    TITLE: 'title',
    ATTACHMENTS: 'attachments',
}

const ASCENDING = 'ascending';
const DESCENDING = 'descending';

export default function Proposals() {

    const [proposalData, setProposalData] = useState({});

    useEffect(() => {

        // TODO: Do pagination
        fetch("http://localhost:3001/db/getProposals")
            .then((response) => response.json())
            .then((proposals) => {
                const newProposalData = {
                    proposals: [],
                    column: COLUMNS.DATE,
                    direction: DESCENDING,
                }
                proposals.forEach((proposal) => {
                    proposal.date = proposal.title.split("_")[0];
                    newProposalData.proposals.push(proposal);
                })
                newProposalData.proposals = _.sortBy(newProposalData.proposals, [COLUMNS.DATE])
                setProposalData(newProposalData)
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            })
    }, []);

    const generateActions = (proposal, idx) => {
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
                const updatedProposals = [...proposalData.proposals];
                updatedProposals[idx].loading = true;
                setProposalData({...proposalData, proposals: updatedProposals});
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
                        let updatedProposals = [...proposalData.proposals];
                        updatedProposals[idx].loading = false;
                        updatedProposals[idx].status = change.value;
                        updatedProposals = _.sortBy(updatedProposals, [proposalData.column])
                        if(proposalData.direction === ASCENDING) {
                            updatedProposals.reverse();
                        }
                        setProposalData({...proposalData, proposals: updatedProposals});
                    } else {
                        throw response;
                    }
                }).catch((error) => {
                    let undoProposals = [...proposalData];
                    undoProposals[idx].loading = false;
                    setProposalData(undoProposals);
                    console.error(error);
                })
            }}
        />
    }

    const changeSort = (column) => {
        if(proposalData.column === column) {
            setProposalData({
                column: column,
                direction: proposalData.direction === ASCENDING ? DESCENDING : ASCENDING,
                proposals: proposalData.proposals.slice().reverse(),
            })
            return;
        }

        setProposalData({
            direction: DESCENDING,
            column: column,
            proposals: _.sortBy(proposalData.proposals, [column])
        })

    }

    const renderProposals = () => {

        console.log(proposalData);
        if(!proposalData.proposals) {
            return <TableRow textAlign='center'><TableCell><Icon name="spinner"/></TableCell></TableRow>;
        }

        if(proposalData.proposals?.length === 0) {
            return <TableRow textAlign='center'><TableCell>No proposals</TableCell></TableRow>;
        }


        return(proposalData.proposals.map((proposal, idx) => {
            let rowColor;
            switch (proposal.status) {
                case PROJECT_STATUSES.ARCHIVED:
                case PROJECT_STATUSES.COMPLETE:
                    rowColor="proposal-row-gray"
                    break;
                case PROJECT_STATUSES.CANDIDATE:
                    rowColor="proposal-row-green"
                    break;
                case PROJECT_STATUSES.IN_PROGRESS:
                    rowColor="proposal-row-yellow"
                    break;
                default:
                    rowColor=""
                    break;
            }

            return <TableRow className={rowColor} key={idx}>
                <TableCell>{proposal.date}</TableCell>{/* TODO: This is dumb -- Consider adding submission date to projects table */}
                <TableCell>{generateActions(proposal, idx)}</TableCell>
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
                    <TableHeaderCell
                        sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
                        onClick={() => changeSort(COLUMNS.DATE)}
                    >
                        Date
                    </TableHeaderCell>
                    <TableHeaderCell
                        sorted={proposalData.column === COLUMNS.ACTION ? proposalData.direction : null}
                        onClick={() => changeSort(COLUMNS.ACTION)}
                    >
                        Action
                    </TableHeaderCell>
                    <TableHeaderCell
                        sorted={proposalData.column === COLUMNS.STATUS ? proposalData.direction : null}
                        onClick={() => changeSort(COLUMNS.STATUS)}
                    >
                        Status
                    </TableHeaderCell>
                    <TableHeaderCell
                        sorted={proposalData.column === COLUMNS.TITLE ? proposalData.direction : null}
                        onClick={() => changeSort(COLUMNS.TITLE)}
                    >
                        Title
                    </TableHeaderCell>
                    <TableHeaderCell
                        sorted={proposalData.column === COLUMNS.ATTACHMENTS ? proposalData.direction : null}
                        onClick={() => changeSort(COLUMNS.ATTACHMENTS)}
                    >
                        Attachments
                    </TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {renderProposals()}
            </TableBody>
        </Table>
    )
}
