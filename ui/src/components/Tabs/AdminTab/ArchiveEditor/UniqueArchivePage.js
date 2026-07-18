import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Modal, Icon } from "semantic-ui-react";
import { config } from "../util/functions/constants";
import ErrorPage from "../pages/ErrorPage";
import { SecureFetch } from "../util/functions/secureFetch";
import { decode } from "html-entities";

const basePosterURL = `${config.url.API_GET_ARCHIVE_POSTER}?fileName=`;
const baseVideoURL = `${config.url.API_GET_ARCHIVE_VIDEO}?fileName=`;
const baseImageURL = `${config.url.API_GET_ARCHIVE_IMAGE}?fileName=`;
const baseProjectURL = `${config.url.BASE_URL}/projects/`;

const CONTENT_HEIGHT = 250;

function UniqueProjectPage({ projectData }) {
  const [project, setProject] = useState(projectData);
  const { url_slug } = useParams();
  const [posterOpen, setPosterOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const nodeRef = React.useRef(null);

  /**
   * Formats a comma-separated list of names to ensure consistent spacing
   * @param {string} nameList - The comma-separated list of names
   * @returns {string} Formatted name list with consistent spacing
   */
  const formatNameList = (nameList) => {
    if (!nameList) return "";
    return nameList
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .join(", ");
  };

  useEffect(() => {
    /* Renders the project page client side */
    if (project === undefined) {
      const userInput = { url_slug };
      /* Input Handling */
      const sanitizedInput = userInput.url_slug
        .replace(/[^a-zA-Z\d\s:\-]/g, "")
        .toLowerCase();
      SecureFetch(
        `${config.url.API_GET_ARCHIVE_FROM_SLUG}?url_slug=${sanitizedInput}`,
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw response;
          }
        })
        .then((data) => {
          setProject(data[0]);
        })
        .catch((error) => {
          alert(
            "An issue occurred while searching for archive content " + error,
          );
        });
    }
  }, [url_slug, project]);

  /**
   * Decodes sanitized text so that it is readable without ugly letters
   * @param synopsis archive synopsis
   * @returns {string} sanitized synopsis
   */
  const decodeSynopsis = (synopsis) => {
    return decode(synopsis).replace(/\r\n|\r/g, "\n");
  };

  return (
    <div>
      {project === undefined ? (
        <ErrorPage />
      ) : (
        <div ref={nodeRef}>
          <h1 className="ui header">
            {project.display_name || project.title}{" "}
          </h1>
          {project?.outstanding === 1 && (
            <Icon
              name="trophy"
              title={"Outstanding"}
              size="large"
              style={{ float: "right" }}
            />
          )}
          {project?.creative === 1 && (
            <Icon
              name="trophy"
              title={"Creative"}
              size="large"
              style={{ float: "right" }}
            />
          )}
          {
            // display project page link if slug has been defined
            project.url_slug !== null && project?.url_slug !== "" && (
              <div>
                <Icon name="linkify" />{" "}
                <Link to={`/projects/${project.url_slug}`}>
                  {`${baseProjectURL}${project.url_slug}`}
                </Link>
              </div>
            )
          }
          <div className="ui invisible divider"></div>
          <div className="ui relaxed centered grid">
            {project?.poster_thumb && (
              <img
                src={`${basePosterURL}${project?.poster_thumb}`}
                height={CONTENT_HEIGHT}
                style={{ cursor: "zoom-in", padding: "5px" }}
                onClick={() => setPosterOpen(true)}
                alt={project?.title + " Senior Project Thumbnail Poster"}
              />
            )}
            <Modal
              closeOnDocumentClick={false}
              className={"sticky"}
              closeIcon={true}
              size={"large"}
              open={posterOpen}
              onClose={() => setPosterOpen(false)}
              onOpen={() => setPosterOpen(true)}
            >
              <Modal.Content>
                {project?.poster_full === null ||
                project?.poster_full === "" ? (
                  <img
                    className="ui fluid image"
                    src={`${basePosterURL}${project?.poster_thumb}`}
                    alt={project?.title + " Senior Project Full Size Poster"}
                  />
                ) : (
                  <img
                    className="ui fluid image"
                    src={`${basePosterURL}${project?.poster_full}`}
                    alt={project?.title + " Senior Project Thumbnail Poster"}
                  />
                )}
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => setPosterOpen(false)}>Close</Button>
              </Modal.Actions>
            </Modal>
            {project?.video && (
              <video controls height={CONTENT_HEIGHT}>
                <source
                  src={`${baseVideoURL}${project?.video}`}
                  type="video/mp4"
                />
              </video>
            )}
            {project?.archive_image && (
              <img
                src={`${baseImageURL}${project?.archive_image}`}
                height={CONTENT_HEIGHT}
                style={{ cursor: "zoom-in", padding: "5px" }}
                onClick={() => setImageOpen(true)}
                alt={project?.title + " Senior Project Image"}
              />
            )}
            <Modal
              closeOnDimmerClick={false}
              className={"sticky"}
              closeIcon={true}
              size={"large"}
              open={imageOpen}
              onClose={() => setImageOpen(false)}
              onOpen={() => setImageOpen(true)}
            >
              <Modal.Content>
                <img
                  className="ui fluid image"
                  src={`${baseImageURL}${project?.archive_image}`}
                  alt={project?.title + " Senior Project Image"}
                />
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => setImageOpen(false)}>Close</Button>
              </Modal.Actions>
            </Modal>
          </div>
          <div className="ui invisible divider"></div>
          <div className="ui attached stackable padded grid">
            <div className="two column row">
              <div className="column">
                <div className="ui small header">Dates</div>
                <p>
                  {project?.start_date} - {project?.end_date}
                </p>
                {project?.team_name &&
                  project?.team_name !== "null" &&
                  project?.team_name.trim() !== "" && (
                    <>
                      <div className="ui small header">Team Name</div>
                      <p>{project?.team_name}</p>
                    </>
                  )}
                <div className="ui small header">Students</div>
                <p>{formatNameList(project?.members)}</p>
              </div>
              <div className="column">
                <div className="ui small header">Sponsor</div>
                <p>{project?.sponsor}</p>
                <div className="ui small header">Faculty Coach</div>
                <p>{formatNameList(project?.coach)}</p>
              </div>
            </div>
          </div>
          <div className="ui invisible divider"></div>
          <div className="ui attached stackable padded grid">
            <div className="column">
              <div className="ui small header">Synopsis</div>
              <p style={{ whiteSpace: "pre-line" }}>
                {decodeSynopsis(project?.synopsis)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UniqueProjectPage;
