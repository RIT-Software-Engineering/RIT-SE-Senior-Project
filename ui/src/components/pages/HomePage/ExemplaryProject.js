import React, {useState} from "react";
import {Button, Modal} from "semantic-ui-react";
import { config } from "../../util/functions/constants";
import {useHistory} from "react-router-dom";
import ItemsCarousel from 'react-items-carousel';


const basePosterURL = `${config.url.API_GET_POSTER}?fileName=`;

function ExemplaryProject({ project }) {
    const [open, setOpen] = useState(false);
    const history = useHistory();
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const chevronWidth = 40;

    const toggleOpen = () => {
        setOpen(!open);
    }
    const sendToProjectPage = () => {
        history.push(`/projects/${project.archive_id}`)
    }
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
    let awards = makeAwards()
    return (
    <div className="ui segment stackable padded grid">
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
                        style={{ border: "3px solid rgb(221, 221, 221)", cursor: "pointer" }}
                        alt="Project Poster"
                        onClick={() => toggleOpen()}
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
        <Modal className={"sticky"}  open={open}>
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
                        chevronWidth={chevronWidth}
                    >
                        <div style={{ height: 200 }}><img src={`${basePosterURL}${project.poster_thumb}`}/></div>
                        <div style={{ height: 200}}>Second card</div>
                    </ItemsCarousel>
                    <p>{project?.synopsis}</p>
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen(false)}>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
        </div>
    );
}

export default ExemplaryProject;
