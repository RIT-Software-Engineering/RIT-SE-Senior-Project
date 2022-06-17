import React, { useState, useEffect } from "react";
import ExemplaryProject from "./HomePage/ExemplaryProject";
import {Icon, Input, Pagination} from "semantic-ui-react";
import { config } from "../util/functions/constants";
import { SecureFetch } from "../util/functions/secureFetch";
import _ from "lodash";

const projectsPerPage = 10;

/**
 * Projects page visible on main page of the website without signing in.
 **/

function ProjectsPage(){
    const [projects, setProjects] = useState([])
    const [projectCount, setProjectCount] = useState(projectsPerPage)
    const [activePage, setActivePage] = useState(0)
    const [pageChange, setPageChange] = useState(0)
    const [searchBarValue, setSearchBarValue] = useState("")

    useEffect(() => {
        getPaginationData();
    }, [pageChange]);

    const getPaginationData = () => {
        SecureFetch(
            `${config.url.API_GET_EXEMPLARY_PROJECTS}?resultLimit=${projectsPerPage}&offset=${projectsPerPage * activePage}&featured=false`
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw response;
                }
            })
            .then((data) => {
                console.log(data);
                setProjects(data.projects)
                setProjectCount(data.totalProjects)
            })
            .catch((error) => {
                console.error(error);
            });
    };

    let handleSearchChange = (e, { value }) => {
        setSearchBarValue(value);
        SecureFetch(`${config.url.API_GET_SEARCH_FOR_PROJECTS}/?resultLimit=${projectsPerPage}&offset=${0}&searchQuery=${value}`)
            .then((response) => response.json())
            .then((results) => {
                setProjectCount(results.projectCount);
                setProjects(results.projects);
            })
            .catch((error) => {
                alert("An issue occurred while searching for archive content " + error);
            });
    }

    return (
    <>
        <div className="ui divider"></div>

        <div className="row">
            <h2>Projects</h2>
        </div>

        <div className="ui hidden divider"></div>

        <Input
            icon='search'
            iconPosition='left'
            placeholder='Search...'
            value={searchBarValue}
            onChange={_.debounce(handleSearchChange, 500, {
                leading: true,
            })}
        />

        <div className="ui hidden divider"></div>

        <div id="exemplaryProjectsDiv">
            {/* <!-- Attach exemplary project elements here --> */}
            {projects.map((project, idx) => {
                return <ExemplaryProject project={project} key={idx} />;
            })}
            <div className="pagination-container">
                <Pagination
                    activePage={activePage + 1}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    prevItem={{ content: <Icon name="angle left" />, icon: true }}
                    nextItem={{ content: <Icon name="angle right" />, icon: true }}
                    totalPages={Math.ceil(projectCount / projectsPerPage)}
                    onPageChange={(event, data) => {
                        setActivePage(data.activePage - 1);
                        setPageChange(data.activePage - 1);
                    }}
                />
            </div>
        </div>
    </>
    );
}

export default ProjectsPage;