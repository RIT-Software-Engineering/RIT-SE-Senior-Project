import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import ItemsCarousel from "react-items-carousel";
import {Button, Modal, Icon} from "semantic-ui-react";
import {config} from "../util/functions/constants";
import ErrorPage from "../pages/ErrorPage";
import {SecureFetch} from "../util/functions/secureFetch";

const basePosterURL =`${config.url.API_GET_POSTER}?fileName=`;
const baseProjectURL = `${config.url.BASE_URL}/projects/`;

function UniqueProjectPage({projectData}) {
    const [project, setProject] = useState(projectData);
    const { url_slug } = useParams();
    const [imageOpen, setImageOpen] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const chevronWidth = 40;
    const nodeRef = React.useRef(null);

    useEffect(() => {
        /* Renders the project page client side */
        if (project === undefined) {
            const userInput = {url_slug};
            /* Input Handling */
            const sanitizedInput = userInput.url_slug.replace(/[^a-zA-Z\d\s:\-]/g, "").toLowerCase();
            SecureFetch(`${config.url.API_GET_ARCHIVE_FROM_SLUG}?url_slug=${sanitizedInput}`)
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
                    alert("An issue occurred while searching for archive content " + error);
                });
        }
    }, [url_slug, project]);

    /**
     * Toggle image modal with expanded project details
     */
    const toggleImageModal = () => {
        setImageOpen(!imageOpen);
    }

    /**
     * Creates array of carousel content to be rendered
     */
    const makeCarouselContent = () => {
        let carouselContent = [];
        if(project?.poster_thumb !== null) {
            carouselContent.push({"type": "image", "content": project?.poster_thumb});
        }
        if(project?.poster_full !== null) {
            carouselContent.push({"type": "image", "content": project?.poster_full});
        }
        if(project?.video !== null) {
            carouselContent.push({"type": "video", "content": project?.video});
        }
        return carouselContent;
    }

    const carouselContent = makeCarouselContent();

    return (
        <div>
        {project === undefined
                ? <ErrorPage />
                :
                <div ref={nodeRef}>
                    <h1 className="ui header" >{project.title} </h1>
                            { project?.outstanding === 1 &&
                                    <Icon name="trophy" title={"Outstanding"} size="large" style={{float: "right"}}/>
                            }
                            { project?.creative === 1 &&
                                <Icon name="trophy" title={"Creative"} size="large" style={{float: "right"}}/>
                            }
                    {   // display project page link if slug has been defined
                        project.url_slug !== null && <div>
                        <Icon name="linkify"/> <a href={`${baseProjectURL}${project.url_slug}`}
                                                  target="_blank" rel="noreferrer">
                        {`${baseProjectURL}${project.url_slug}`}</a>
                    </div>
                    }
                <div className="ui attached stackable padded grid">
                    <div className="two column row">
                        <div className="column">
                            <div className="ui small header">Dates</div><p>{project?.start_date} - {project?.end_date}</p>
                            <div className="ui small header">Students</div><p>{project?.members}</p>
                        </div>
                        <div className="column">
                            <div className="ui small header">Sponsor</div><p>{project?.sponsor}</p>
                            <div className="ui small header">Faculty Coach</div><p>{project?.coach}</p>
                        </div>
                    </div>
                </div>
                    <div className="ui hidden divider"></div>
                <div style={{ padding: `0 ${chevronWidth}px`, textAlign: "center"}}>
                    <ItemsCarousel
                        requestToChangeActive={setActiveItemIndex}
                        activeItemIndex={activeItemIndex}
                        numberOfCards={1}
                        gutter={20}
                        infiniteLoop={false}
                        leftChevron={
                            <button className="circular ui icon button">
                                <i className="angle left icon"></i>
                            </button>
                        }
                        rightChevron={
                            <button className="circular ui icon button">
                                <i className="angle right icon"></i>
                            </button>
                        }
                        outsideChevron
                        chevronWidth={chevronWidth}>
                        {carouselContent.map((content, idx) => {
                                return <div key={idx}>
                                    <div style={{height: 200}} onClick={toggleImageModal} className="ui container">
                                        {content.type === "image"
                                            ? <img src={`${basePosterURL}${content.content}`}
                                                   alt={project?.title + " Senior Project Poster"}/>
                                            : <video controls>
                                                <source src={`${basePosterURL}${content.content}`} type="video/mp4"/>
                                            </video>
                                        }
                                    </div>
                                    {/* Modal with expanded image, opens when carousel content is clicked */}
                                    <Modal className={"sticky"}  open={imageOpen}
                                           onClose={() => setImageOpen(false)}
                                           onOpen={() => setImageOpen(true)}>
                                        <Modal.Content>
                                            {content.type === "image"
                                                ? <img class="ui fluid image" src={`${basePosterURL}${content.content}`}
                                                       alt={project?.title + " Senior Project Poster"}/>
                                                : <video controls>
                                                    <source src={`${basePosterURL}${content.content}`} type="video/mp4"/>
                                                </video>
                                            }
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button onClick={() => setImageOpen(false)}>
                                                Close
                                            </Button>
                                        </Modal.Actions>
                                    </Modal>
                                </div>
                            }
                        )
                        }
                    </ItemsCarousel>
                </div>
                    <div className="ui small header">Synopsis</div>
                    <p>{project?.synopsis}</p>
            </div>}
        </div>
    )
}

export default UniqueProjectPage;
