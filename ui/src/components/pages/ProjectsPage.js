import React, { useState, useEffect } from "react";
import ExemplaryProject from "../shared/ExemplaryProject";
import {Button, Header, Icon, Image, Input, Pagination} from "semantic-ui-react";
import { config } from "../util/functions/constants";
import { SecureFetch } from "../util/functions/secureFetch";
import { Modal } from "semantic-ui-react";
import _ from "lodash";
import {useLocation, useHistory} from "react-router-dom";

const projectsPerPage = 10;
const basePosterURL = `${config.url.API_GET_POSTER}?fileName=`;

/**
 * Projects page visible on main page of the website without signing in.
 **/

function ProjectsPage(){
    const [projects, setProjects] = useState([])
    const [projectCount, setProjectCount] = useState(projectsPerPage)
    const [activePage, setActivePage] = useState(0)
    const [pageChange, setPageChange] = useState(0)
    const [searchBarValue, setSearchBarValue] = useState("")
    const [pageNumBeforeSearch, setPageNumBeforeSearch] = useState(0)
    const [selectedProject, setSelectedProject] = useState(null)
    const [open, setOpen] = useState(false)
    const [activeArchiveId, setActiveArchiveId] = useState(null)

    //React router url helpers
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        getPaginationData();
    }, [pageChange]);

    //This handles opening specific project page if a unique url is input
    useEffect(() => {
        if(location.search){
            setActiveArchiveId(Number(location.search.split("=")[1]))
            setOpen(true);
        }
    }, [location.pathname])

    //This grabs the selected project from the props that is supposed to display a uniquely identified page.
    useEffect(() => {
        if(activeArchiveId !== null){
            setSelectedProject(projects.find(project => project.archive_id === activeArchiveId))
        }
    }, [location, activeArchiveId, projects])

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
                setProjects(data.projects)
                setProjectCount(data.totalProjects)
            })
            .catch((error) => {
                console.error(error);
            });
    };

    let handleSearchChange = (e, { value }) => {
        setSearchBarValue(value);
        //If this is the first letter entered to value, keep track that a search is being made.
        if(pageNumBeforeSearch === 0){
            setPageNumBeforeSearch(activePage + 1);
        }
        //If the search value is empty, don't do a search for projects, and return back to the page originally on.
        if(value === ""){
            setActivePage(pageNumBeforeSearch - 1);
            setPageNumBeforeSearch(0);
            setPageChange(pageChange + 99);
            return;
        }
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