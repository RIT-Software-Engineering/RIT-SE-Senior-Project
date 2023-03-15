import React, {useState} from "react";
import {Button, Icon, Modal} from "semantic-ui-react";
import { config } from "../util/functions/constants";
import UniqueProjectPage from "../pages/UniqueProjectPage";
const basePosterURL = `${config.url.API_GET_ARCHIVE_POSTER}?fileName=`;

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
    }

    /**
     * Creates array of awards associated with project
     * @returns {*[]} array of awards
     */
    const makeAwards = () => {
        let awards = [];
        if(project.outstanding >= 1){
            awards[0] = 'Outstanding'
        }
        if(project.creative >= 1){
            awards[1] = 'Creative'
        }
        return awards
    }

    const awards = makeAwards();

    return (
        <div> {/* Div containing all project information */}
            <div className="ui segment stackable padded grid" onClick={() => toggleInitialModalOpen()} style={{cursor: "pointer" }}>
                <div className="two column row" style={{display:"flex"}}>
                    <div className="column">
                        <h3 className="ui header" >{project.title}</h3>
                    </div>
                    <div className="column">
                        {awards.length !== 0 &&
                            <>
                        {awards.map((award, idx) => {
                            return <Icon name="trophy" title={award} style={{float: "right"}}/>;
                        }
                        )}</>}
                    </div>
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
                        <div className="ui small header">Dates</div><p>{project.start_date} - {project.end_date}</p>
                        <div className="ui small header">Students</div><p>{project.members}</p>
                    </div>
                    <div className="column">
                        <div className="ui small header">Sponsor</div><p>{project.sponsor}</p>
                        <div className="ui small header">Faculty Coach</div><p>{project.coach}</p>
                    </div>
                </div>
            </div>
            {/* Modal with expanded information */}
            <Modal className={"sticky"}
                   size={'large'}
                   open={initialOpen}
                   onClose={() => setInitialOpen(false)}
                   onOpen={() => setInitialOpen(true)}>
                <Modal.Content>
                    <UniqueProjectPage projectData={project}/>
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
