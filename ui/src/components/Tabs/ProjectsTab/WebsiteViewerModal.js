import React, { useEffect, useState } from "react";
import { Button, Modal, Icon, Message, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { config } from "../../util/functions/constants";
import { SecureFetch } from "../../util/functions/secureFetch";
import ErrorPage from "../../pages/ErrorPage";
import { decode } from "he";
import "./../../../css/components/tabs/website.css";

const basePosterURL = `${config.url.API_GET_ARCHIVE_POSTER}?fileName=`;
const baseVideoURL = `${config.url.API_GET_ARCHIVE_VIDEO}?fileName=`;
const baseImageURL = `${config.url.API_GET_ARCHIVE_IMAGE}?fileName=`;
const baseProjectURL = `${config.url.BASE_URL}/projects/`;

const CONTENT_HEIGHT = 250;

export default function WebsiteViewerModal(props) {
  const [archive, setArchive] = useState();
  const [loading, setLoading] = useState(false);
  const [noArchiveFound, setNoArchiveFound] = useState(false);
  const [hasError, setHasError] = useState(false);
  const nodeRef = React.useRef(null);
  const [posterOpen, setPosterOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

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

  /**
   * Decodes sanitized text so that it is readable without ugly letters
   * @param synopsis archive synopsis
   * @returns {string} sanitized synopsis
   */
  const decodeSynopsis = (synopsis) => {
    return decode(synopsis).replace(/\r\n|\r/g, "\n");
  };

  useEffect(() => {
    updateData();
  }, [props.project?.project_id]);

  const updateData = () => {
    setLoading(true);
    setNoArchiveFound(false);
    setHasError(false);
    setArchive(undefined);

    SecureFetch(
      `${config.url.API_GET_ARCHIVE_FROM_PROJECT}?project_id=${props.project?.project_id}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((archives) => {
        setLoading(false);
        if (archives && archives.length > 0) {
          setArchive(archives[0]);
          setNoArchiveFound(false);
        } else {
          setNoArchiveFound(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setHasError(true);
        setNoArchiveFound(false);
        console.error("Error fetching archive:", error);
      });
  };

  /**
   * Component to display when no archive is found for the project
   */
  const NoArchiveFoundMessage = () => {
    return (
      <div className="website-archive-notfound">
        <div className="website-archive">
          <Icon
            name="bullhorn"
            size="huge"
            color="grey"
            className="website-archive-icon"
          />
          <Header as="h2" color="grey" className="website-archive-">
            No Archive Available
          </Header>
        </div>

        <Message info className="website-message-info">
          <Message.Header className="website-message-header">
            Archive Not Found
          </Message.Header>
          <div className="website-archive-message">
            <p className="website-archive-icon">
              This project doesn't have an archive or showcase materials
              available yet. Archives typically include project posters, videos,
              images, and detailed information about the project's scope, team,
              and outcomes.
            </p>
            <p className="website-message-description">
              Archives are usually created after project completion. If you wish
              to add an archive to this project, and are a member of the project
              team press the "+" button. If you are not a member of the project
              team, please contact the project coach to request an archive.
            </p>
          </div>
        </Message>
      </div>
    );
  };

  /**
   * Component to display while loading archive data
   */
  const LoadingMessage = () => {
    return (
      <div className="website-loading">
        <Icon
          loading
          name="spinner"
          size="huge"
          className="website-loading-icon"
        />
        <Header as="h3" color="grey" className="website-loading-header">
          Loading project archive...
        </Header>
        <p className="website-loading-wait">
          Please wait while we fetch the project details.
        </p>
      </div>
    );
  };

  const generateModalContent = () => {
    return (
      <>
        {loading ? (
          <LoadingMessage />
        ) : hasError ? (
          <ErrorPage />
        ) : noArchiveFound ? (
          <NoArchiveFoundMessage />
        ) : archive ? (
          <div ref={nodeRef}>
            <h1 className="ui header">{archive.title} </h1>
            {archive?.outstanding === 1 && (
              <Icon
                name="trophy"
                title={"Outstanding"}
                size="large"
                className="website-generate-icon"
              />
            )}
            {archive?.creative === 1 && (
              <Icon
                name="trophy"
                title={"Creative"}
                size="large"
                className="website-generate-icon"
              />
            )}
            {
              // display project page link if slug has been defined
              archive.url_slug !== null && archive?.url_slug !== "" && (
                <div>
                  <Icon name="linkify" />{" "}
                  <Link to={`/projects/${archive.url_slug}`}>
                    {`${baseProjectURL}${archive.url_slug}`}
                  </Link>
                </div>
              )
            }
            <div className="ui invisible divider"></div>
            <div className="ui relaxed centered grid">
              {archive?.poster_thumb && (
                <img
                  src={`${basePosterURL}${archive?.poster_thumb}`}
                  height={CONTENT_HEIGHT}
                  className="website-generate-content"
                  onClick={() => setPosterOpen(true)}
                  alt={archive?.title + " Senior Project Thumbnail Poster"}
                />
              )}
              <Modal
                closeOnDimmerClick={false}
                className={"sticky"}
                closeIcon={true}
                size={"large"}
                open={posterOpen}
                onClose={() => setPosterOpen(false)}
                onOpen={() => setPosterOpen(true)}
              >
                <Modal.Content>
                  {archive?.poster_full === null ||
                  archive?.poster_full === "" ? (
                    <img
                      className="ui fluid image"
                      src={`${basePosterURL}${archive?.poster_thumb}`}
                      alt={archive?.title + " Senior Project Full Size Poster"}
                    />
                  ) : (
                    <img
                      className="ui fluid image"
                      src={`${basePosterURL}${archive?.poster_full}`}
                      alt={archive?.title + " Senior Project Thumbnail Poster"}
                    />
                  )}
                </Modal.Content>
                <Modal.Actions>
                  <Button onClick={() => setPosterOpen(false)}>Close</Button>
                </Modal.Actions>
              </Modal>
              {archive?.video && (
                <video controls height={CONTENT_HEIGHT}>
                  <source
                    src={`${baseVideoURL}${archive?.video}`}
                    type="video/mp4"
                  />
                </video>
              )}
              {archive?.archive_image && (
                <img
                  src={`${baseImageURL}${archive?.archive_image}`}
                  height={CONTENT_HEIGHT}
                  className="website-generate-content"
                  onClick={() => setImageOpen(true)}
                  alt={archive?.title + " Senior Project Image"}
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
                    src={`${baseImageURL}${archive?.archive_image}`}
                    alt={archive?.title + " Senior Project Image"}
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
                    {archive?.start_date} - {archive?.end_date}
                  </p>
                  {archive?.team_name &&
                    archive?.team_name !== "null" &&
                    archive?.team_name.trim() !== "" && (
                      <>
                        <div className="ui small header">Team Name</div>
                        <p>{archive?.team_name}</p>
                      </>
                    )}
                  <div className="ui small header">Students</div>
                  <p>{formatNameList(archive?.members)}</p>
                </div>
                <div className="column">
                  <div className="ui small header">Sponsor</div>
                  <p>{archive?.sponsor}</p>
                  <div className="ui small header">Faculty Coach</div>
                  <p>{formatNameList(archive?.coach)}</p>
                </div>
              </div>
            </div>
            <div className="ui invisible divider"></div>
            <div className="ui attached stackable padded grid">
              <div className="column">
                <div className="ui small header">Synopsis</div>
                <p className="website-whitespace">
                  {decodeSynopsis(archive?.synopsis)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <LoadingMessage />
        )}
      </>
    );
  };

  return (
    <Modal
      closeOnDimmerClick={false}
      className={"sticky"}
      closeIcon={true}
      trigger={<Button icon="bullhorn" />}
      header={`Viewing "${props.project.display_name || props.project.title}"`}
      onOpen={updateData}
      content={{ content: generateModalContent() }}
      actions={[{ key: "Close", content: "Close" }]}
    />
  );
}
