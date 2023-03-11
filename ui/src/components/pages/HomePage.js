import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ExemplaryProject from "../shared/ExemplaryProject";
import { Icon, Button } from "semantic-ui-react";
import { config } from "../util/functions/constants";
import { SecureFetch } from "../util/functions/secureFetch";
import InnerHTML from 'dangerously-set-html-content';

const PROJECTS_PER_PAGE = 5;

function HomePage() {
    const history = useHistory();
    const [projects, setProjects] = useState([]);
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
            `${config.url.API_GET_FEATURED_ARCHIVES}?resultLimit=${PROJECTS_PER_PAGE}`
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw response;
                }
            })
            .then((data) => {
                setProjects(data);
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
            <div id="exemplaryProjectsDiv" style={{marginBottom: "75px" }}>

                {/* <!-- Attach exemplary project elements here --> */}
                {projects.map((project, idx) => {
                    return <ExemplaryProject project={project} key={idx} />;
                })}

                <br></br>
                <Button
                    href={"/projects"}
                    className="ui button"
                    onClick={() => {
                        history.push("/projects");
                    }}
                    icon labelPosition='right'
                    style={{float: "right"}}>
                    View More Projects
                    <Icon name='ellipsis horizontal' />
                </Button>
            </div>
        </>
    );
}

export default HomePage;
