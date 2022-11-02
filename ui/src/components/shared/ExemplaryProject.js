import React, {useState} from "react";
import {Button, Modal} from "semantic-ui-react";
import { config } from "../util/functions/constants";
import {useHistory} from "react-router-dom";
import ItemsCarousel from 'react-items-carousel';

const basePosterURL = `${config.url.API_GET_POSTER}?fileName=`;

/**
 * Represents a project component
 */
function ExemplaryProject({ project }) {
    const [initialOpen, setInitialOpen] = useState(false);
    const [imageOpen, setImageOpen] = useState(false);

    const history = useHistory();
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const chevronWidth = 40;

    /**
     * Toggle initial modal with expanded project details
     */
    const toggleInitalModalOpen = () => {
        setInitialOpen(!initialOpen);
    }

    /**
     * Toggle image modal with expanded project details
     */
    const toggleImageModal = () => {
        setImageOpen(!imageOpen);
    }

    /**
     * Sends user to specific project page
     */
    const sendToProjectPage = () => {
        history.push(`/projects/${project.archive_id}`)
    }

    /**
     * Creates array of awards associated with project
     * @returns {*[]} array of awards
     */
    const makeAwards = () => {
        let awards = [];
        if(project.outstanding === 1){
            awards[0] = 'Outstanding'
        }
        if(project.creative === 1){
            awards[1] = 'Creative'
        }
        return awards
    }

    /**
     * Creates array of carousel content to be rendered
     */
    const makeCarouselContent = () => {
        let carouselContent = [];
        if(project.poster_thumb !== null) {
            carouselContent.push({"type": "image", "content": project.poster_thumb});
        }
        if(project.poster_full !== null) {
            carouselContent.push({"type": "image", "content": project.poster_full});
        }
        if(project.video !== null) {
            carouselContent.push({"type": "video", "content": project.video});
        }
        return carouselContent;
    }

    const awards = makeAwards();
    const carouselContent = makeCarouselContent();

    return (
        <div>
            {/* Div containing all project information */}
            <div className="ui segment stackable padded grid" onClick={() => toggleInitalModalOpen()} style={{cursor: "pointer" }}>
                <div className="row">
                    <h3
                        className="ui header"
                        style={{ color: "#C75300", cursor: "pointer" }}
                        onClick={() => sendToProjectPage() }>{project.title}</h3>
                </div>

                <div className="three column row">
                    <div className="column">
                        <img
                            src={`${basePosterURL}${project.poster_thumb}`}
                            style={{ border: "3px solid rgb(221, 221, 221)", }}
                            alt="Project Poster"

                        />
                    </div>
                    <div className="column">
                        <h4>Dates:</h4>
                        <p>{project.start_date} - {project.end_date}</p>
                        <h4>Students:</h4>
                        <p>{project.members}</p>
                        {awards.length !== 0 && <><h4>Awards:</h4>
                            <p>{awards.filter(Boolean).join(", ")}</p>
                        </>}
                    </div>
                    <div className="column">
                        <h4>Sponsor:</h4>
                        <p>{project.sponsor}</p>
                        <h4>Faculty Coach:</h4>
                        <p>{project.coach}</p>
                    </div>
                </div>
            </div>

            {/* Modal with expanded information */}
            <Modal className={"sticky"}  open={initialOpen}>
                <Modal.Header>{project?.title}</Modal.Header>
                <Modal.Content>
                    <div style={{ padding: `0 ${chevronWidth}px`, textAlign: "center"}}>
                        <ItemsCarousel
                            requestToChangeActive={setActiveItemIndex}
                            activeItemIndex={activeItemIndex}
                            numberOfCards={1}
                            gutter={20}
                            infiniteLoop={false}
                            leftChevron={<button>{'<'}</button>}
                            rightChevron={<button>{'>'}</button>}
                            outsideChevron
                            chevronWidth={chevronWidth}>

                            {carouselContent.map(content => {
                                    return <div>
                                        <div style={{height: 200}} onClick={toggleImageModal} className="ui container">
                                            {content.type === "image"
                                                    ? <img src={`${basePosterURL}${content.content}`}/>
                                                    : <video controls><source src={`${basePosterURL}${content.content}`} type="video/mp4"/></video>
                                            }

                                        </div>
                                        {/* Modal with expanded image, opens when carousel content is clicked */}
                                        <Modal className={"sticky"}  open={imageOpen}>
                                            <Modal.Header>{project?.title}</Modal.Header>
                                            <Modal.Content>
                                                {content.type === "image"
                                                    ? <img src={`${basePosterURL}${content.content}`}/>
                                                    : <video controls><source src={`${basePosterURL}${content.content}`} type="video/mp4"/></video>
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
                        <p>{project?.synopsis}</p>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setInitialOpen(false)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
}

export default ExemplaryProject;
