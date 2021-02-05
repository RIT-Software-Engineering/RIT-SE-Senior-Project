import React, { useEffect, useState } from "react";
import {
    Dropdown,
    Icon,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Button,
    Message,
} from "semantic-ui-react";
import ProjectEditorModal from "./ProjectEditorModal";
import _ from "lodash";
import { config } from "../util/constants";
import { formatDateTime } from "../util/utils";
import "../../css/dashboard-proposal.css";

const PROJECT_STATUSES = {
    SUBMITTED: "submitted",
    NEEDS_REVISION: "needs revision",
    FUTURE_PROJECT: "future project",
    CANDIDATE: "candidate",
    IN_PROGRESS: "in progress",
    COMPLETE: "completed",
    ARCHIVED: "archive",
};

const COLUMNS = {
    DATE: "date",
    ACTION: "action",
    STATUS: "status",
    TITLE: "title",
    ATTACHMENTS: "attachments",
    EDIT: "edit",
};

const ASCENDING = "ascending";
const DESCENDING = "descending";

export default function Proposals(props) {
    const [messages, setMessages] = useState([]);
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

    const addMessage = (positive) => {
        if (positive) {
            setMessages([...messages, { positive, header: "Success!", content: "Action was successfully updated" }]);
        } else {
            setMessages([
                ...messages,
                {
                    positive,
                    header: "Uh oh...",
                    content: "We were unable to update that action, please try again later.",
                },
            ]);
        }
        // FIXME: This causes a race condition if messages are added too fast...
        setTimeout(() => {
            setMessages(messages.slice(1));
        }, 5000);
    };

    const generateActions = (proposal, idx) => {
        const options = Object.keys(PROJECT_STATUSES).map((status, idx) => {
            return { key: idx, text: PROJECT_STATUSES[status], value: PROJECT_STATUSES[status] };
        });

        return (
            <div className="proposal-status-action">
                <Dropdown
                    className="button"
                    selection
                    disabled={proposal.loading}
                    options={options}
                    value={proposal.editedStatus || proposal.status}
                    onChange={(event, change) => {
                        const updatedProposals = [...proposalData.proposals];
                        updatedProposals[idx].editedStatus = change.value;
                        setProposalData({ ...proposalData, proposals: updatedProposals });
                    }}
                />
                <Button
                    disabled={proposal.loading}
                    loading={proposal.loading}
                    color={proposal.editedStatus && "yellow"}
                    onClick={(event) => {
                        if (!proposalData.proposals[idx].editedStatus) {
                            return;
                        }
                        const updatedProposals = [...proposalData.proposals];
                        updatedProposals[idx].loading = true;
                        setProposalData({ ...proposalData, proposals: updatedProposals });
                        fetch(config.url.API_PATCH_EDIT_PROPOSAL_STATUS, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                project_id: proposal.project_id,
                                status: proposalData.proposals[idx].editedStatus,
                            }),
                        })
                            .then((response) => {
                                if (response.ok) {
                                    let updatedProposals = [...proposalData.proposals];
                                    updatedProposals[idx].loading = false;
                                    updatedProposals[idx].status = updatedProposals[idx].editedStatus;
                                    updatedProposals[idx].editedStatus = null;
                                    updatedProposals = _.sortBy(updatedProposals, [proposalData.column]);
                                    if (proposalData.direction === ASCENDING) {
                                        updatedProposals.reverse();
                                    }
                                    setProposalData({ ...proposalData, proposals: updatedProposals });
                                    addMessage(true);
                                } else {
                                    throw response;
                                }
                            })
                            .catch((error) => {
                                let undoProposals = [...proposalData.proposals];
                                undoProposals[idx].loading = false;
                                setProposalData({ ...proposalData, proposals: undoProposals });
                                addMessage(false);
                                console.error(error);
                            });
                    }}
                >
                    Submit
                </Button>
            </div>
        );
    };

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
                    <TableCell>No proposals</TableCell>
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
                    <TableCell>{generateActions(proposal, idx)}</TableCell>
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
                        <ProjectEditorModal project={proposal} />
                    </TableCell>
                </TableRow>
            );
        });
    };

    const semesterName = () => {
        if (props.semester === null) {
            return <h4>No semester</h4>;
        }

        return props.semester?.name && <h4>{props.semester.name}</h4>;
    };

    return (
        <>
            {messages.map((message) => {
                return (
                    <Message
                        floating
                        className={message.positive ? "success" : "negative"}
                        header={message.header}
                        content={message.content}
                    />
                );
            })}

            {semesterName()}
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
                            sorted={proposalData.column === COLUMNS.ACTION ? proposalData.direction : null}
                            onClick={() => changeSort(COLUMNS.ACTION)}
                        >
                            Action
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
        </>
    );
}
