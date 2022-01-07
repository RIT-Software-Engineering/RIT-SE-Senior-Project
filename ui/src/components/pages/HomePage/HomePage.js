import React, { useState, useEffect } from "react";
import ExemplaryProject from "./ExemplaryProject";
import { Icon, Pagination } from "semantic-ui-react";
import { config } from "../../util/functions/constants";

const projectsPerPage = 2;

function HomePage() {
    const [projectData, setProjectData] = useState({ projects: [], totalProjects: 0 });

    useEffect(() => {
        getPaginationData(0);
    }, []);

    const getPaginationData = (page) => {
        fetch(
            `${config.url.API_GET_EXEMPLARY_PROJECTS}?resultLimit=${projectsPerPage}&offset=${projectsPerPage * page}`
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw response;
                }
            })
            .then((data) => {
                setProjectData(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <div className="row">
                <h2>Overview</h2>
            </div>
            <div className="row">
                <p className="overviewText">
                    Senior Project is a capstone course completed by every Software Engineering senior. Small teams of
                    students are assigned to solve challenging, real-world software issues for companies and
                    organizations. External corporate and non-profit sponsors submit proposals for projects that teams
                    of 4 or 5 students will work on.
                </p>
                <p className="overviewText">
                    Over the course of two terms, each team works with a project sponsor, applying the software
                    engineering skills that the students learned in class and on co-op. They carry the project from
                    inception through an entire software development lifecycle. The end result is a functional software
                    tool ready for use by the sponsor's organization.
                </p>
            </div>

            <div className="ui divider"></div>

            <div className="row">
                <h2>Exemplary Projects</h2>
            </div>
            <div className="ui hidden divider"></div>

            <div id="exemplaryProjectsDiv">
                {/* <!-- Attach exemplary project elements here --> */}
                {projectData.projects.map((project, idx) => {
                    return <ExemplaryProject project={project} key={idx} />;
                })}
                <div className="pagination-container">
                    <Pagination
                        defaultActivePage={1}
                        ellipsisItem={null}
                        firstItem={null}
                        lastItem={null}
                        prevItem={{ content: <Icon name="angle left" />, icon: true }}
                        nextItem={{ content: <Icon name="angle right" />, icon: true }}
                        totalPages={Math.ceil(projectData.totalProjects / projectsPerPage)}
                        onPageChange={(event, data) => {
                            getPaginationData(data.activePage - 1);
                        }}
                    />
                </div>
            </div>
        </>
    );
}

export default HomePage;
