import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import ItemsCarousel from "react-items-carousel";
import {Button, Modal} from "semantic-ui-react";
import {config} from "../util/functions/constants";
import ErrorPage from "../pages/ErrorPage";
import {SecureFetch} from "../util/functions/secureFetch";

const basePosterURL = `${config.url.API_GET_POSTER}?fileName=`;

function UniqueProjectPage({projectData}) {
    const [project, setProject] = useState(projectData);
    const {slug} = useParams();
    const [imageOpen, setImageOpen] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const chevronWidth = 40;

    useEffect(() => {
        if (project === undefined) {
            SecureFetch(`${config.url.API_GET_PROJECT_FROM_SLUG}?slug=${slug}`)
                .then((response) => response.json())
                .then((results) => {
                    setProject(results[0]);
                })
                .catch((error) => {
                    alert("An issue occurred while searching for archive content " + error);
                });
        }
    }, []);


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
                : <div>
                <h1>{project?.title}</h1>
                <div style={{ padding: `0 ${chevronWidth}px`, textAlign: "center"}}>
                    <ItemsCarousel id="string"
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
            </div>}
        </div>
    )
}

export default UniqueProjectPage;
