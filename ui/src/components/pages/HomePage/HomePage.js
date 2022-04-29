import React, { useState, useEffect } from "react";
import ExemplaryProject from "./ExemplaryProject";
import { Icon, Pagination } from "semantic-ui-react";
import { config } from "../../util/functions/constants";
import {SecureFetch} from "../../util/functions/secureFetch";

const projectsPerPage = 2;

function HomePage() {
    const [projectData, setProjectData] = useState({ projects: [], totalProjects: 0 });
    const [html, setHtml] = useState("")

    useEffect(() => {
        getPaginationData(0);
        SecureFetch(`${config.url.API_GET_HTML}?name=overview`)
            .then((response) => response.json())
            .then((htmlData) => {
                console.log(typeof htmlData[0].html)
                setHtml(htmlData[0].html)
            })

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
            <div className="content" dangerouslySetInnerHTML={{ __html: html }} />

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
