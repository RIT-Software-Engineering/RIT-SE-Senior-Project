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
import "../../css/dashboard-proposal.css";
import ProjectViewerModal from "./ProjectViewerModal";

const COLUMNS = {
    SEMESTER: "semester",
    STATUS: "status",
    TITLE: "title",
};

const ASCENDING = "ascending";
const DESCENDING = "descending";

export default function Proposals(props) {
    const [proposalData, setProposalData] = useState({});

    let semesterMap = { undefined: "No semester", null: "No semester" };
    props.semesterData?.forEach(semester => {
        semesterMap[semester.semester_id] = semester.name;
    });

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
                    <TableCell>{semesterMap[proposal.semester]}</TableCell>
                    <TableCell>
                        <a
                            href={`${config.url.API_GET_PROPOSAL_PDF}?project_id=${proposal.project_id}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {proposal.display_name || proposal.title}
                        </a>
                    </TableCell>
                    <TableCell>{proposal.status}</TableCell>
                    <TableCell>
                        {props.viewOnly ?
                            <ProjectViewerModal project={proposal} semesterMap={semesterMap} />
                            : <ProjectEditorModal viewOnly={props.viewOnly} project={proposal} semesterData={props.semesterData} activeCoaches={props.activeCoaches} />
                        }
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
                            sorted={proposalData.column === COLUMNS.SEMESTER ? proposalData.direction : null}
                            onClick={() => changeSort(COLUMNS.SEMESTER)}
                        >
                            Semester
                        </TableHeaderCell>
                        <TableHeaderCell
                            sorted={proposalData.column === COLUMNS.TITLE ? proposalData.direction : null}
                            onClick={() => changeSort(COLUMNS.TITLE)}
                        >
                            Name (pdf)
                        </TableHeaderCell>
                        <TableHeaderCell
                            sorted={proposalData.column === COLUMNS.STATUS ? proposalData.direction : null}
                            onClick={() => changeSort(COLUMNS.STATUS)}
                        >
                            Status
                        </TableHeaderCell>
                        <TableHeaderCell>
                            {props.viewOnly ? "View" : "Edit"}
                        </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>{renderProposals()}</TableBody>
            </Table>
        );
    };

    return (props.noAccordion ?
        table() :
        <Accordion fluid styled panels={[{ key: 0, title: semesterName(), content: { content: table() } }]} />);
}
