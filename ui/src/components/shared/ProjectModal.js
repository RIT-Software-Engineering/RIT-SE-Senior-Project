import { Modal, Icon, Pagination } from "semantic-ui-react";
import ProfileCircle from "../util/components/ProfileCircle.js"
import { useParams, Link } from "react-router-dom";
import { config } from "../util/functions/constants";
import { getFormattedDate } from "../util/functions/utils"
import { decode } from "html-entities";
import uiConfig from "../../config/uiConfig.js";
import "../../css/components/shared/projectModal.css";
import { act, useState } from "react";

const basePosterURL = `${config.url.API_GET_ARCHIVE_POSTER}?fileName=`;
const baseProjectURL = `${config.url.BASE_URL}/projects/`;
const baseVideoURL = `${config.url.API_GET_ARCHIVE_VIDEO}?fileName=`;

function ProjectModal({ project, open, onClose }){
    const [carouselIndex, setCarouselIndex] = useState(0);

    if (!project) return null;

    const listNames = (nameString) => {
      if (!nameString) return "";
      return nameString
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name);
    };

    const decodeSynopsis = (synopsis) => {
      return decode(synopsis).replace(/\r\n|\r/g, "\n");
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
          <Modal.Header style={{ display: "flex", justifyContent: "space-between", border: "transparent", paddingBottom: "20px" }}>
            <div className="project-modal-title">{project.title}</div>
            <span>{getFormattedDate(project.start_date)} - {getFormattedDate(project.end_date)}
            <button className="close" onClick={onClose}>
              <Icon name="close" />
            </button>
            </span>
          </Modal.Header>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

            <div>
              {carouselIndex === 0 || !project.video ? (
                <img
                  src={project.poster_thumb ? `${basePosterURL}${project.poster_thumb}` : `${uiConfig.logoPath}`}
                  alt="Project Poster"
                  width="300px"
                />
              ) : (
                <video
                  controls
                  width="300px"
                >
                  <source
                    src={`${baseVideoURL}${project.video}`}
                    type="video/mp4"
                  />
                </video>
              )}
            </div>

            {project.video && (
              <Pagination
                className="project-pagination"
                activePage={carouselIndex + 1}
                totalPages={2}
                onPageChange={(e, { activePage }) => {
                  setCarouselIndex(activePage - 1);
                }}
                prevItem={{ content: <Icon name="arrow alternate circle left"/>, className: "pagination-arrow"}}
                nextItem={{ content: <Icon name="arrow alternate circle right"/>, className: "pagination-arrow"}}
                firstItem={null}
                lastItem={null}
              />
            )}

          </div>

          <Modal.Content>
            <div>
              <div className="info-row"><div className="ui small header">By {project.team_name}:</div>{generateProfiles(project.members, true)}</div>
              <div className="info-row"><div className="ui small header">Sponsor:</div>{project.sponsor}</div>
              <div className="info-row"><div className="ui small header">Faculty Coach:</div>{generateProfiles(project.coach, false)}</div>
              <div className="ui small header" style={{marginTop: "5px"}}>{decodeSynopsis(project.synopsis)}</div>
              <div className="ui small header">Keywords</div>
              <div className="info-row">{project?.keywords}</div>
              {
            // display project page link if slug has been defined
            project.url_slug !== null && project?.url_slug !== "" && (
              <div style={{marginTop: "5px"}}>
                <Link to={`/projects/${project.url_slug}`}>
                  {`${baseProjectURL}${project.url_slug}`}
                </Link>
              </div>
            )
          }
            </div>
          </Modal.Content>

        </Modal>
    );
}

export default ProjectModal;