import React from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../../util/functions/constants";

const basePosterURL = `${config.url.API_GET_POSTER}?fileName=`;

function ExemplaryProject({ project, onClick}) {
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
        <div onClick={onClick} className="ui segment stackable padded grid">
            <div className="row">
                <h3 className="ui header">{project.title}</h3>
            </div>

            <div className="three column row">
                <div className="column">
                    <img
                        src={`${basePosterURL}${project.poster_thumb}`}
                        style={{ border: "3px solid rgb(221, 221, 221)" }}
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
            <div className="row">
                <Accordion
                    panels={[
                        {
                            key: 0,
                            title: project.title,
                            content: { content: <p>{project.synopsis}</p> },
                        },
                    ]}
                />
            </div>
        </div>
    );
}

export default ExemplaryProject;
