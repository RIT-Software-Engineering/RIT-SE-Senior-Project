import React, { useState } from "react";
import { Button, Icon, Modal } from "semantic-ui-react";
import { config } from "../util/functions/constants";
import UniqueProjectPage from "../pages/UniqueProjectPage";
import ProfileCircle from "../util/components/ProfileCircle";
const basePosterURL = `${config.url.API_GET_ARCHIVE_POSTER}?fileName=`;

// Helper function to format comma-separated name lists with proper spacing
const listNames = (nameString) => {
  if (!nameString) return "";
  return nameString
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name);
};

/**
 * Represents a project component
 */
function ExemplaryProject({ project }) {
  const [initialOpen, setInitialOpen] = useState(false);

  /**
   * Toggle initial modal with expanded project details
   */
  const toggleInitialModalOpen = () => {
    setInitialOpen(!initialOpen);
  };

  /**
   * Creates array of awards associated with project
   * @returns {*[]} array of awards
   */
  const makeAwards = () => {
    let awards = [];
    if (project.outstanding >= 1) {
      awards[0] = "Outstanding";
    }
    if (project.creative >= 1) {
      awards[1] = "Creative";
    }
    return awards;
  };

  const awards = makeAwards();

  let generateProfiles = (stringUsers, isStudent = true) => {
    if (!stringUsers) return [];
    return (
      <div
        style={{
          display: "flex",
          gap: "0.5em",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {listNames(stringUsers).map((user, idx) => (
          <ProfileCircle
            key={idx}
            name={user}
            showFullName
            size="tiny"
            isStudent={isStudent}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {" "}
      {/* Div containing all project information */}
      <button
        className="ui segment stackable padded grid"
        onClick={() => toggleInitialModalOpen()}
        style={{ cursor: "pointer",  textAlign: "start", lineHeight: "1.4285em" }}
      >
        <div className="two column row" style={{ display: "flex" }}>
          <div className="column">
            <h3 className="ui header">
              {project.display_name || project.title}
            </h3>
          </div>
          <div className="column">
            {awards.length !== 0 && (
              <>
                {awards.map((award, idx) => {
                  return (
                    <Icon
                      name="trophy"
                      title={award}
                      style={{ float: "right" }}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>

        <div className="three column row">
          <div className="column">
            <img
              src={`${basePosterURL}${project.poster_thumb}`}
              style={{ border: "3px solid rgb(221, 221, 221)" }}
              alt="Project Poster"
            />
          </div>
          <div className="column">
            <div className="ui small header">Dates</div>
            <div>
              {project.start_date} - {project.end_date}
            </div>
            {project?.team_name &&
              project?.team_name !== "null" &&
              project?.team_name.trim() !== "" && (
                <>
                  <div className="ui small header">Team Name</div>
                  <div>{project.team_name}</div>
                </>
              )}
            <div className="ui small header">Students</div>
            {generateProfiles(project.members, true)}
          </div>
          <div className="column">
            <div className="ui small header">Sponsor</div>
            <div>{project.sponsor}</div>
            <div className="ui small header">Faculty Coach</div>
            {generateProfiles(project.coach, false)}
          </div>
        </div>
      </button>
      {/* Modal with expanded information */}
      <Modal
        closeOnDimmerClick={false}
        className={"sticky"}
        size={"large"}
        open={initialOpen}
        onClose={() => setInitialOpen(false)}
        onOpen={() => setInitialOpen(true)}
      >
        <Modal.Content>
          <UniqueProjectPage projectData={project} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setInitialOpen(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default ExemplaryProject;
