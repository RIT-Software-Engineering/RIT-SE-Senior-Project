import React, {useState} from "react";
import {Button, Modal} from "semantic-ui-react";
import { config } from "../util/functions/constants";
import {useHistory} from "react-router-dom";
import UniqueProjectPage from "../pages/UniqueProjectPage";
const basePosterURL = `${config.url.API_GET_POSTER}?fileName=`;
/**
 * Represents a project component
 */
function ExemplaryProject({ project }) {
    const [initialOpen, setInitialOpen] = useState(false);
    const history = useHistory();

    /**
     * Toggle initial modal with expanded project details
     */
    const toggleInitialModalOpen = () => {
        setInitialOpen(!initialOpen);
    }

    /**
     * Sends user to specific project page
     */
    const sendToProjectPage = () => {
        history.push(`/projects/${project.slug}`)
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

    const awards = makeAwards();

    return (
        <div>
            {/* Div containing all project information */}
            <div className="ui segment stackable padded grid" onClick={() => toggleInitialModalOpen()} style={{cursor: "pointer" }}>
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
            <Modal className={"sticky"} open={initialOpen}>
                <Modal.Content>
                    <UniqueProjectPage project={project}/>
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
