import React, { useState, useEffect } from "react";
import ExemplaryProject from "../shared/ExemplaryProject";
import { Icon, Pagination } from "semantic-ui-react";
import { config } from "../util/functions/constants";
import { SecureFetch } from "../util/functions/secureFetch";
import InnerHTML from 'dangerously-set-html-content';
import { shuffle } from "../util/functions/utils";

const PROJECTS_PER_PAGE = 5;

function HomePage() {
    const [projectData, setProjectData] = useState({ projects: [], totalProjects: 0 });
    const [html, setHtml] = useState("")

    /*
    * When the page initially loads, getPaginationData gets all the relevant project information so that it can be
    * called again in the return with that proper amount of pages to display for the homepage projects.
    * The secureFetch after it is for getting the html from the database to display above exemplary projects.
    */
    useEffect(() => {
        getPaginationData(0);
        SecureFetch(`${config.url.API_GET_HTML}?name=homePagePanel`)
            .then((response) => response.json())
            .then((htmlData) => {
                setHtml(htmlData[0]?.html)
            })

    }, []);

    const getPaginationData = (page) => {
        fetch(
            `${config.url.API_GET_ACTIVE_ARCHIVES}?resultLimit=${PROJECTS_PER_PAGE}&page=${page}&featured=true`
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw response;
                }
            })
            .then((data) => {
                data.projects = shuffle(data.projects);
                setProjectData(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    /*
    * The Pagination component calls getPaginationData every time the page is
    * changed, and displays a new set of the archived projects
    */
    return (
        <>
            <div className="content">
                <InnerHTML html={html}/>
            </div>
            <div className="ui hidden divider"></div>
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
                        totalPages={Math.ceil(projectData.totalProjects / PROJECTS_PER_PAGE)}
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
