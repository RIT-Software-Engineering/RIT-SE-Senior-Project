import React, { useState, useEffect } from "react";
import ExemplaryProject from "../shared/ExemplaryProject";
import {Icon, Input, Pagination} from "semantic-ui-react";
import { config } from "../util/functions/constants";
import { SecureFetch } from "../util/functions/secureFetch";
import _ from "lodash";

const PROJECTS_PER_PAGE = 10;

/**
 * Projects page visible on main page of the website without signing in.
 **/
function ProjectsPage(){
    const [projects, setProjects] = useState([])
    const [projectCount, setProjectCount] = useState(PROJECTS_PER_PAGE);
    const [activePage, setActivePage] = useState(0)
    const [pageChange, setPageChange] = useState(0)
    const [searchBarValue, setSearchBarValue] = useState("")
    const [pageNumBeforeSearch, setPageNumBeforeSearch] = useState(0);

    useEffect(() => {
        getPaginationData();
    }, [pageChange]);

    const getPaginationData = () => {
        SecureFetch(
            `${config.url.API_GET_ACTIVE_ARCHIVES}?resultLimit=${PROJECTS_PER_PAGE}&page=${activePage}`
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw response;
                }
            })
            .then((data) => {
                setProjects(data.projects)
                setProjectCount(data.totalProjects)
            })
            .catch((error) => {
                console.error(error);
            });
    };

    let handleSearchChange = (e, { value }) => {
        // Input handling
        const input = value.replace(/[^a-zA-Z\d\s\-]/g, "");
        setSearchBarValue(input);
        if(input.length === 0) return;
        // If this is the first letter entered to value, keep track that a search is being made.
        if(pageNumBeforeSearch === 0){
            setPageNumBeforeSearch(activePage + 1);
        }
        // If the search value is empty, don't do a search for projects, and return to the page originally on.
        if(input === ""){
            setActivePage(pageNumBeforeSearch - 1);
            setPageNumBeforeSearch(0);
            setPageChange(pageChange + 99);
            return;
        }
        SecureFetch(`${config.url.API_GET_SEARCH_FOR_ARCHIVES}/?resultLimit=${PROJECTS_PER_PAGE}&offset=${0}&searchQuery=${input}&inactive=false`)
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
            {projects?.map((project, idx) => {
                return <ExemplaryProject project={project} key={idx} projectsPage/>;
            })}
            <div className="pagination-container">
                <Pagination
                    activePage={activePage + 1}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    prevItem={{ content: <Icon name="angle left" />, icon: true }}
                    nextItem={{ content: <Icon name="angle right" />, icon: true }}
                    totalPages={Math.ceil(projectCount / PROJECTS_PER_PAGE)}
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