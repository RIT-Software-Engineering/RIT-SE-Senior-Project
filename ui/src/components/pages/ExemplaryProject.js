import React from "react";

const basePosterURL = "http://localhost:3001/db/getPoster?fileName=";

function ExemplaryProject({ project }) {
    console.log(project);
    return (
        <div className="ui segment stackable padded grid">
            <div className="row">
                <h3 className="ui header projectTitle">{project.title}</h3>
            </div>

            <div className="three column row">
                <div className="column">
                    <img
                        src={`${basePosterURL}${project.poster_thumb}`}
                        style={{ border: "3px solid rgb(221, 221, 221)" }}
                    />
                </div>
                <div className="column">
                    <h4>Team:</h4>
                    <p>{project.team_name}</p>
                    <h4>Students:</h4>
                    <p>{project.members}</p>
                </div>
                <div className="column">
                    <h4>Sponsor:</h4>
                    <p>{project.sponsor}</p>
                    <h4>Faculty Coach:</h4>
                    <p>{project.coach}</p>
                </div>
            </div>
            <div className="row">
                <div className="ui accordion">
                    <div className="title">
                        <i className="dropdown icon"></i>Project Synopsis
                    </div>
                    <div className="content">
                        <p className="transition hidden">{project.synopsis}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExemplaryProject;
