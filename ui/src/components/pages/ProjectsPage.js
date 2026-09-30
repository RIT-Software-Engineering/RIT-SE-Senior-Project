import React, { useState, useEffect } from "react";
import ProjectCard from "../shared/ProjectCard.js"
import ProjectModal from "../shared/ProjectModal.js"
import "../../css/components/pages/BrowseAllProjects.css"
import "../../css/components/shared/projectCard.css"
import { Icon, Input, Pagination } from "semantic-ui-react";
import { config } from "../util/functions/constants";
import { SecureFetch } from "../util/functions/secureFetch";
import _ from "lodash";
import uiConfig from "../../config/uiConfig.js";

const PROJECTS_PER_PAGE = 25;

/**
 * Projects page visible on main page of the website without signing in.
 **/
function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [activePage, setActivePage] = useState(0);
  const [pageChange, setPageChange] = useState(0);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [pageNumBeforeSearch, setPageNumBeforeSearch] = useState(0);
  const [projectCount, setProjectCount] = useState(PROJECTS_PER_PAGE);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedAward, setSelectedAward] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    getPaginationData();
  }, [pageChange]);

  const getPaginationData = () => {
    SecureFetch(
      `${config.url.API_GET_ACTIVE_ARCHIVES}?resultLimit=${PROJECTS_PER_PAGE}&page=${activePage}`,
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        setProjects(data.projects);
        setProjectCount(data.totalProjects);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  let handleSearchChange = (e, { value }) => {
    // Input handling
    const input = value.replace(/[^a-zA-Z\d\s\-]/g, "");
    setSearchBarValue(input);
    if (input.length === 0) return;
    // If this is the first letter entered to value, keep track that a search is being made.
    if (pageNumBeforeSearch === 0) {
      setPageNumBeforeSearch(activePage + 1);
    }
    // If the search value is empty, don't do a search for projects, and return to the page originally on.
    if (input === "") {
      setActivePage(pageNumBeforeSearch - 1);
      setPageNumBeforeSearch(0);
      setPageChange(pageChange + 99);
      return;
    }
    SecureFetch(
      `${config.url.API_GET_SEARCH_FOR_ARCHIVES}/?resultLimit=${PROJECTS_PER_PAGE}&offset=${0}&searchQuery=${input}&inactive=false`,
    )
      .then((response) => response.json())
      .then((results) => {
        setProjectCount(results.projectCount);
        setProjects(results.projects);
      })
      .catch((error) => {
        alert("An issue occurred while searching for archive content " + error);
      });
  };

  return (
    <>
      <div className="row" style={{display: "flex", justifyContent: "center", marginTop: "60px", gap: "15px"}}>
        <div className="page-title">Browse All</div><div className="page-title page-title--orange">Projects</div>
      </div>

      <div className="ui invisible divider"></div>

      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "30px"}}>
        <Input
          className="search-bar"
          action="Go"
          placeholder="Search"
          value={searchBarValue}
          onChange={_.debounce(handleSearchChange, 500, {
            leading: true,
          })}
        />

        <div>
          <select className="dropdown" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
            <option value="none">Semester</option>
          </select>
          <select className="dropdown" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="none">Status</option>
          </select>
          <select className="dropdown" value={selectedAward} onChange={(e) => setSelectedAward(e.target.value)}>
            <option value="none">Award</option>
            {Object.values(uiConfig.awards).map((award) => (
              <option key={award.id} value={award.id}>{award.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ui invisible divider"></div>

      <div className="projects-grid">
        {projects?.map((project) => {
          return <ProjectCard key={project.id} project={project} onClick={setSelectedProject}/>;
        })}
      </div>

      <ProjectModal
        project={selectedProject}
        open={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}

export default ProjectsPage;
