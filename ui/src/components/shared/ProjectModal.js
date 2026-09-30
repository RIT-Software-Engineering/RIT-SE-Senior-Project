import { Modal } from "semantic-ui-react";
import ProfileCircle from "../util/components/ProfileCircle.js"
import { config } from "../util/functions/constants";
import "../../css/components/shared/projectModal.css";

const basePosterURL = `${config.url.API_GET_ARCHIVE_POSTER}?fileName=`;

function ProjectModal({ project, open, onClose }){
    if (!project) return null;

    const listNames = (nameString) => {
        if (!nameString) return "";
        return nameString
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name);
    };

    let generateProfiles = (stringUsers, isStudent = true) => {
        if (!stringUsers) return [];
        return (
          <div className="exemplary-generate-profile">
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

    return(
        <Modal className="project-modal" open={open} onClose={onClose}>
            <Modal.Header style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{project.title}</span>
                <span>{project.start_date} - {project.end_date}</span>
            </Modal.Header>

            <div style={{ display: "flex", justifyContent: "center"}}>
            <img
              src={`${basePosterURL}${project.poster_thumb}`}
              alt="Project Poster"
              width="300px"
            />
            </div>

            <Modal.Content>
                <div>
                <div className="info-row"><span className="ui small header">By {project.team_name}:</span>{generateProfiles(project.members, true)}</div>
                <div className="info-row"><div className="ui small header">Sponsor:</div>{project.sponsor}</div>
                <div className="info-row"><div className="ui small header">Faculty Coach:</div>{generateProfiles(project.coach, false)}</div>
                </div>
            </Modal.Content>

        </Modal>
    );
}

export default ProjectModal;