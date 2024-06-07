import React, { useEffect, useState } from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';
import { config } from '../../util/functions/constants';
import { SecureFetch } from '../../util/functions/secureFetch';
import ErrorPage from "../../pages/ErrorPage";
import {decode} from 'he';

const basePosterURL = `${config.url.API_GET_ARCHIVE_POSTER}?fileName=`;
const baseVideoURL = `${config.url.API_GET_ARCHIVE_VIDEO}?fileName=`;
const baseImageURL = `${config.url.API_GET_ARCHIVE_IMAGE}?fileName=`;
const baseProjectURL = `${config.url.BASE_URL}/projects/`;

const CONTENT_HEIGHT = 250;

export default function WebsiteViewerModal(props) {

    const [archive, setArchive] = useState();
    const nodeRef = React.useRef(null);
    const [posterOpen, setPosterOpen] = useState(false);
    const [imageOpen, setImageOpen] = useState(false);

    /**
     * Decodes sanitized text so that it is readable without ugly letters
     * @param synopsis archive synopsis
     * @returns {string} sanitized synopsis
     */
    const decodeSynopsis = (synopsis) => {
        return decode(synopsis).replace(/\r\n|\r/g, '\n');
    };

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_ARCHIVE_FROM_PROJECT}?project_id=${props.project?.project_id}`)
            .then(response => response.json())
            .then(archives => {
                if (archives.length > 0) {
                    setArchive(archives[0]);
                }
            });
    }, [props.project?.project_id])

    const generateModalContent = () => {
        return <>
            {archive === undefined
                ? <ErrorPage/>
                :
                <div ref={nodeRef}>
                    <h1 className="ui header">{archive.title} </h1>
                    {archive?.outstanding === 1 &&
                        <Icon name="trophy" title={"Outstanding"} size="large" style={{float: "right"}}/>
                    }
                    {archive?.creative === 1 &&
                        <Icon name="trophy" title={"Creative"} size="large" style={{float: "right"}}/>
                    }
                    {   // display project page link if slug has been defined
                        (archive.url_slug !== null && archive?.url_slug !== "") && <div>
                            <Icon name="linkify"/> <a href={`${baseProjectURL}${archive.url_slug}`}
                                                      target="_blank" rel="noreferrer">
                            {`${baseProjectURL}${archive.url_slug}`}</a>
                        </div>
                    }
                    <div className="ui hidden divider"></div>
                    <div className="ui relaxed centered grid">
                        { archive?.poster_thumb &&
                            <img src={`${basePosterURL}${archive?.poster_thumb}`} height={CONTENT_HEIGHT}
                                 style={{cursor: "zoom-in", padding: "5px" }}
                                 onClick={() => setPosterOpen(true)}
                                 alt={archive?.title + " Senior Project Thumbnail Poster"}/>
                        }
                        <Modal className={"sticky"}
                               size={'large'}
                               open={posterOpen}
                               onClose={() => setPosterOpen(false)}
                               onOpen={() => setPosterOpen(true)}>
                            <Modal.Content>
                                { archive?.poster_full === null || archive?.poster_full === ""
                                    ? <img className="ui fluid image" src={`${basePosterURL}${archive?.poster_thumb}`}
                                         alt={archive?.title + " Senior Project Full Size Poster"}/>
                                    : <img className="ui fluid image" src={`${basePosterURL}${archive?.poster_full}`}
                                           alt={archive?.title + " Senior Project Thumbnail Poster"}/>
                                }
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={() => setPosterOpen(false)}>Close</Button>
                            </Modal.Actions>
                        </Modal>
                        { archive?.video &&
                            <video controls height={CONTENT_HEIGHT}>
                                <source src={`${baseVideoURL}${archive?.video}`} type="video/mp4"/>
                            </video>
                        }
                        { archive?.archive_image &&
                             <img src={`${baseImageURL}${archive?.archive_image}`} height={CONTENT_HEIGHT}
                                  style={{cursor: "zoom-in", padding: "5px" }}
                                  onClick={() => setImageOpen(true)}
                                  alt={archive?.title + " Senior Project Image"}/>
                        }
                        <Modal className={"sticky"}
                               size={'large'}
                               open={imageOpen}
                               onClose={() => setImageOpen(false)}
                               onOpen={() => setImageOpen(true)}>
                            <Modal.Content>
                                <img className="ui fluid image" src={`${baseImageURL}${archive?.archive_image}`}
                                     alt={archive?.title + " Senior Project Image"}/>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={() => setImageOpen(false)}>Close</Button>
                            </Modal.Actions>
                        </Modal>
                    </div>
                    <div className="ui hidden divider"></div>
                    <div className="ui attached stackable padded grid">
                        <div className="two column row">
                            <div className="column">
                                <div className="ui small header">Dates</div>
                                <p>{archive?.start_date} - {archive?.end_date}</p>
                                <div className="ui small header">Students</div>
                                <p>{archive?.members}</p>
                            </div>
                            <div className="column">
                                <div className="ui small header">Sponsor</div>
                                <p>{archive?.sponsor}</p>
                                <div className="ui small header">Faculty Coach</div>
                                <p>{archive?.coach}</p>
                            </div>
                        </div>
                    </div>
                    <div className="ui hidden divider"></div>
                    <div className="ui attached stackable padded grid">
                        <div className="column">
                            <div className="ui small header">Synopsis</div>
                        <p style={{whiteSpace: "pre-line"}}>{decodeSynopsis(archive?.synopsis)}</p>
                        </div>
                    </div>
                </div>}
        </>
    }

    return (
        <Modal className={"sticky"}
            trigger={<Button icon="archive" />}
            header={`Viewing "${props.project.display_name || props.project.title}"`}
            content={{ content: generateModalContent() }}
            actions={[{ key: "Close", content: "Close" }]}
        />
    )
}