import React, { useEffect, useState } from "react";
import {
    Icon,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Accordion,
} from "semantic-ui-react";
import ProjectEditorModal from "./ProjectEditorModal";
import _ from "lodash";
import { config, PROJECT_STATUSES } from "../util/constants";
import { formatDateTime } from "../util/utils";
import "../../css/dashboard-proposal.css";

const COLUMNS = {
    DATE: "date",
    STATUS: "status",
    TITLE: "title",
    ATTACHMENTS: "attachments",
    EDIT: "edit",
};

const ASCENDING = "ascending";
const DESCENDING = "descending";

export default function Proposals(props) {
    const [proposalData, setProposalData] = useState({});

    useEffect(() => {
        const newProposalData = {
            proposals: props.proposalData,
            column: COLUMNS.DATE,
            direction: DESCENDING,
        };
        newProposalData.proposals = _.sortBy(newProposalData.proposals, [COLUMNS.DATE]);
        setProposalData(newProposalData);
    }, [props.proposalData]);

    const changeSort = (column) => {
        if (proposalData.column === column) {
            setProposalData({
                column: column,
                direction: proposalData.direction === ASCENDING ? DESCENDING : ASCENDING,
                proposals: proposalData.proposals.slice().reverse(),
            });
            return;
        }

        setProposalData({
            direction: DESCENDING,
            column: column,
            proposals: _.sortBy(proposalData.proposals, [column]),
        });
    };

    const renderProposals = () => {
        if (!proposalData.proposals) {
            return (
                <TableRow textAlign="center">
                    <TableCell>
                        <Icon name="spinner" />
                    </TableCell>
                </TableRow>
            );
        }

        if (proposalData.proposals?.length === 0) {
            return (
                <TableRow textAlign="center">
                    <TableCell>No projects</TableCell>
                </TableRow>
            );
        }

        return proposalData.proposals.map((proposal, idx) => {
            let rowColor;
            switch (proposal.status) {
                case PROJECT_STATUSES.ARCHIVED:
                case PROJECT_STATUSES.COMPLETE:
                    rowColor = "proposal-row-gray";
                    break;
                case PROJECT_STATUSES.CANDIDATE:
                    rowColor = "proposal-row-green";
                    break;
                case PROJECT_STATUSES.IN_PROGRESS:
                    rowColor = "proposal-row-yellow";
                    break;
                default:
                    rowColor = "";
                    break;
            }

            return (
                <TableRow className={rowColor} key={idx}>
                    <TableCell>{formatDateTime(proposal.submission_datetime)}</TableCell>
                    {/* TODO: This is dumb -- Consider adding submission date to projects table */}
                    <TableCell>{proposal.status}</TableCell>
                    <TableCell>
                        <a
                            href={`${config.url.API_GET_PROPOSAL_PDF}?name=${proposal.title}.pdf`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {proposal.display_name || proposal.title}
                        </a>
                    </TableCell>
                    <TableCell className="attachments">
                        {proposal.attachments?.split(", ").map((attachment, attachmentIdx) => {
                            return (
                                <React.Fragment key={attachmentIdx}>
                                    <a
                                        href={`${config.url.API_GET_PROPOSAL_ATTACHMENT}?proposalTitle=${proposal.title}&name=${attachment}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {attachment}
                                    </a>
                                    <br />
                                </React.Fragment>
                            );
                        })}
                    </TableCell>
                    <TableCell>
                        <ProjectEditorModal viewOnly={props.viewOnly} project={proposal} semesterData={props.semesterData} />
                    </TableCell>
                </TableRow>
            );
        });
    };

    const semesterName = () => {
        if (props.semester === null) {
            return "No semester";
        }

        return props.semester?.name && props.semester.name;
    };

    const table = () => {
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
                            sorted={proposalData.column === COLUMNS.STATUS ? proposalData.direction : null}
                            onClick={() => changeSort(COLUMNS.STATUS)}
                        >
                            Status
                        </TableHeaderCell>
                        <TableHeaderCell
                            sorted={proposalData.column === COLUMNS.TITLE ? proposalData.direction : null}
                            onClick={() => changeSort(COLUMNS.TITLE)}
                        >
                            Name (pdf)
                        </TableHeaderCell>
                        <TableHeaderCell
                            sorted={proposalData.column === COLUMNS.ATTACHMENTS ? proposalData.direction : null}
                            onClick={() => changeSort(COLUMNS.ATTACHMENTS)}
                        >
                            Attachments
                        </TableHeaderCell>
                        <TableHeaderCell
                            sorted={proposalData.column === COLUMNS.EDIT ? proposalData.direction : null}
                            onClick={() => changeSort(COLUMNS.EDIT)}
                        >
                            Edit
                        </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>{renderProposals()}</TableBody>
            </Table>
        );
    };

    return (
        <>
            <Accordion panels={[{ key: 0, title: semesterName(), content: { content: table() } }]} />
        </>
    );
}
