import { useState, useEffect } from "react";
import ProjectCard from "../shared/ProjectCard.js"
import ProjectModal from "../shared/ProjectModal.js"
import { Checkbox, Dropdown, Icon, Input, Pagination } from "semantic-ui-react";
import { config } from "../util/functions/constants";
import { SecureFetch } from "../util/functions/secureFetch";
import _ from "lodash";
import uiConfig from "../../config/uiConfig.js";
import "../../css/components/pages/ProjectsPage.css"
import "../../css/components/shared/projectCard.css"

const PROJECTS_PER_PAGE = 9;

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
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("any");
  const [selectedAward, setSelectedAward] = useState("any");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    getAllProjects();
  }, []);

  useEffect(() => {
    setSelectedMonths(availableMonths);
  }, [availableMonths]);

  useEffect(() => {
    getPaginationData();
  }, [activePage]);

  const getAllProjects = () => {
    SecureFetch(
      `${config.url.API_GET_ACTIVE_ARCHIVES}?resultLimit=1000&page=0`,
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        const months = getProjectDateRange(data.projects);
        setAvailableMonths(months);
        setSelectedMonths(months);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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

  const getProjectDateRange = (projects) => {
    const months = new Set();

    projects.forEach((project) => {
      let current = new Date(`${project.start_date}T00:00:00`);
      const end = new Date(`${project.end_date}T00:00:00`);

      while (current <= end){
        months.add(
          `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`
        )

        current.setMonth(current.getMonth() + 1)
      }
    });

    return [...months].sort().reverse();

  }


  return (
    <>
      <div className="row" style={{display: "flex", justifyContent: "center", marginTop: "60px", gap: "15px"}}>
        <div className="page-title">Browse All</div><div className="page-title page-title--orange">Projects</div>
      </div>

      <div className="ui invisible divider"></div>

      <div style={{width: "100%", margin: "0 auto"}}>

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
          <Dropdown
            className="dropdown"
            text="Months"
            selection
            closeOnChange={false}
          >
            <Dropdown.Menu>
              {availableMonths.map((month) => (
                <Dropdown.Item
                  key={month}
                  value={month}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMonths((prev) => prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]);}}
                >
                  <Checkbox label={month} checked={selectedMonths.includes(month)} onClick={(e) => e.stopPropagation()} onChange={() => {}} />
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <select className="dropdown" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="any" disabled>Status</option>
            <option value="any">Any Status</option>
            <option value="current">Current</option>
          </select>
          <select className="dropdown" value={selectedAward} onChange={(e) => setSelectedAward(e.target.value)}>
            <option value="any" disabled>Award</option>
            <option value="any">All</option>
            {Object.values(uiConfig.awards).map((award) => (
              <option key={award.id} value={award.id}>{award.name}</option>
            ))}
          </select>
        </div>
        </div>
        

        <div className="ui invisible divider"></div>

        <div style={{display: "flex", flexDirection: "column", justifyContent:"center"}}>
          <div className="projects-grid">
            {projects?.filter((project) => {
              let current = new Date(`${project.start_date}T00:00:00`);
              const end = new Date(`${project.end_date}T00:00:00`);

              while (current <= end){
                const month = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
                if (selectedMonths.includes(month)) {
                  return true;
                }
                current.setMonth(current.getMonth() + 1);
              }
              return false;
            }).map((project) => {
              return <ProjectCard key={project.id} project={project} onClick={setSelectedProject}/>;
            })}
          </div>

        <Pagination
          className="project-pagination"
          activePage={activePage + 1}
          totalPages={Math.ceil(projectCount/PROJECTS_PER_PAGE)}
          onPageChange={(e, { activePage }) => {
            setActivePage(activePage - 1);
            setPageChange(pageChange + 1);
          }}
          prevItem={{ content: <Icon name="arrow alternate circle left"/>, className: "pagination-arrow"}}
          nextItem={{ content: <Icon name="arrow alternate circle right"/>, className: "pagination-arrow"}}
          firstItem={null}
          lastItem={null}
        />
        </div>
      
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