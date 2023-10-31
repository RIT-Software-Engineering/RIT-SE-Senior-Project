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
import ProjectArchivePanel from "./ProjectArchivePanel"
import _ from "lodash";
import { config, PROJECT_STATUSES } from "../../util/functions/constants";
import "../../../css/dashboard-proposal.css";
import ProjectViewerModal from "./ProjectViewerModal";
import { isSemesterActive } from "../../util/functions/utils";
import ArchivePanel from "../AdminTab/ArchiveEditor/ArchivePanel";
import { UserContext } from "../../util/functions/UserContext";

const COLUMNS = {
  SEMESTER: "semester",
  STATUS: "status",
  TITLE: "title",
};

const ASCENDING = "ascending";
const DESCENDING = "descending";

/**
 * This is what is displayed inside the admin tab for projects. It may also be used elsewhere in the website.
 * */
export default function Proposals(props) {
  const [proposalData, setProposalData] = useState({});
  const [active, setActive] = useState(
    isSemesterActive(props.semester?.start_date, props.semester?.end_date)
  );

  let semesterMap = { undefined: "No semester", null: "No semester" };
  props.semesterData?.forEach((semester) => {
    semesterMap[semester.semester_id] = semester.name;
  });

  useEffect(() => {
    const newProposalData = {
      proposals: props.proposalData,
      column: COLUMNS.DATE,
      direction: DESCENDING,
    };
    newProposalData.proposals = _.sortBy(newProposalData.proposals, [
      COLUMNS.DATE,
    ]);
    setProposalData(newProposalData);
  }, [props.proposalData]);

  const changeSort = (column) => {
    if (proposalData.column === column) {
      setProposalData({
        column: column,
        direction:
          proposalData.direction === ASCENDING ? DESCENDING : ASCENDING,
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
          <TableCell>{proposal.display_name || proposal.title}</TableCell>
          <TableCell>{proposal.status}</TableCell>
          <TableCell>
            <div className="accordion-buttons-container">
              {props.viewOnly ? (
                <>
                  <ProjectViewerModal
                    project={proposal}
                    semesterMap={semesterMap}
                  />
                  <ProjectArchivePanel
                    project={proposal}
                    semesterData={props.semesterData}
                    activeCoaches={props.activeCoaches}
                    activeSponsors={props.activeSponsors}
                  />
                </>
              ) : (
                <>
                  <ProjectEditorModal
                    viewOnly={props.viewOnly}
                    project={proposal}
                    semesterData={props.semesterData}
                    activeCoaches={props.activeCoaches}
                    activeSponsors={props.activeSponsors}
                  />
                  {proposal.status === "archive" ? (
                    <></>
                  ) : (
                    <ArchivePanel
                      project={proposal}
                      semesterData={props.semesterData}
                      newArchive
                      activeCoaches={props.activeCoaches}
                      activeSponsors={props.activeSponsors}
                      header={"Archive Project"}
                      buttonIcon={"bullhorn"}
                    />
                  )}
                </>
              )}
              <a
                href={`${config.url.API_GET_PROPOSAL_PDF}?project_id=${proposal.project_id}`}
                className="ui icon button"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="download" />
              </a>
            </div>
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
              sorted={
                proposalData.column === COLUMNS.SEMESTER
                  ? proposalData.direction
                  : null
              }
              onClick={() => changeSort(COLUMNS.SEMESTER)}
            >
              Semester
            </TableHeaderCell>
            <TableHeaderCell
              sorted={
                proposalData.column === COLUMNS.TITLE
                  ? proposalData.direction
                  : null
              }
              onClick={() => changeSort(COLUMNS.TITLE)}
            >
              Name
            </TableHeaderCell>
            <TableHeaderCell
              sorted={
                proposalData.column === COLUMNS.STATUS
                  ? proposalData.direction
                  : null
              }
              onClick={() => changeSort(COLUMNS.STATUS)}
            >
              Status
            </TableHeaderCell>
            <TableHeaderCell>
              {props.viewOnly ? "Current/Original" : "Edit/Original"}
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>{renderProposals()}</TableBody>
      </Table>
    );
  };

  return props.noAccordion ? (
    table()
  ) : (
    <Accordion
      fluid
      styled
      onTitleClick={() => {
        setActive(!active);
      }}
      panels={[
        {
          key: 0,
          title: semesterName(),
          active: active,
          content: { content: table() },
        },
      ]}
    />
  );
}
