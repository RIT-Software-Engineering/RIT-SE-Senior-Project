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

//based on zero-indexing
const SPRING_SEMESTER_START_MONTH = 0;
const SUMMER_SEMESTER_START_MONTH = 4;
const FALL_SEMESTER_START_MONTH = 7;

const SPRING_SEMESTER_END_MONTH = 4;
const SUMMER_SEMESTER_END_MONTH = 7;
const FALL_SEMESTER_END_MONTH = 11;

/**
 * Projects page visible on main page of the website without signing in.
 **/
function ProjectsPage() {
  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activePage, setActivePage] = useState(0);
  const [pageChange, setPageChange] = useState(0);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [pageNumBeforeSearch, setPageNumBeforeSearch] = useState(0);
  const [projectCount, setProjectCount] = useState(PROJECTS_PER_PAGE);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAward, setSelectedAward] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    getAllProjects();
  }, []);

  useEffect(() => {
    setSelectedSemesters(availableSemesters);
  }, [availableSemesters]);

  useEffect(() => {
    setActivePage(0);
  }, [selectedSemesters, selectedStatus, selectedAward]);

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
        setAllProjects(data.projects);
        const semesters = getProjectDateRange(data.projects);
        setAvailableSemesters(semesters);
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
    const semesters = new Set();

    projects.forEach((project) => {
      const start = new Date(`${project.start_date}T00:00:00`);
      const startMonth = start.getMonth();

      let end;
      let endMonth;

      if (!project.end_date || project.end_date == ''){
        end = new Date();
        const todayMonth = end.getMonth();

        if (todayMonth <= SPRING_SEMESTER_END_MONTH){
          endMonth = SPRING_SEMESTER_END_MONTH;
        } else if (todayMonth <= SUMMER_SEMESTER_END_MONTH){
          endMonth = SUMMER_SEMESTER_END_MONTH;
        } else {
          endMonth = FALL_SEMESTER_END_MONTH;
        }
        end.setMonth(endMonth);
      } else {
        end = new Date(`${project.end_date}T00:00:00`);
        endMonth = end.getMonth();
      }

      if (startMonth === SPRING_SEMESTER_START_MONTH) {
        semesters.add(
          `Spring ${start.getFullYear()}`
        )
      } else if (startMonth === SUMMER_SEMESTER_START_MONTH) {
        semesters.add(
          `Summer ${start.getFullYear()}`
        )
      } else if (startMonth === FALL_SEMESTER_START_MONTH){
        semesters.add(
          `Fall ${start.getFullYear()}`
        )
      }

      if (endMonth === SPRING_SEMESTER_END_MONTH) {
        semesters.add(
          `Spring ${end.getFullYear()}`
        )
      } else if (endMonth === SUMMER_SEMESTER_END_MONTH) {
        semesters.add(
          `Summer ${end.getFullYear()}`
        )
      } else if (endMonth === FALL_SEMESTER_END_MONTH){
        semesters.add(
          `Fall ${end.getFullYear()}`
        )
      }
      }
    );

    return [...semesters].sort().reverse();

  }

  const filteredProjects = allProjects.filter((project) => {
    const start = new Date(`${project.start_date}T00:00:00`);
    const end = new Date(`${project.end_date}T00:00:00`);
    const startMonth = start.getMonth();
    const endMonth = end.getMonth();

    let matchesSemester = false;
    
    if (startMonth === SPRING_SEMESTER_START_MONTH){
      if (selectedSemesters.includes(`Spring ${start.getFullYear()}`)){
        matchesSemester = true;
      }
    } else if (startMonth === SUMMER_SEMESTER_START_MONTH){
      if (selectedSemesters.includes(`Summer ${start.getFullYear()}`)){
        matchesSemester = true;
      }
    } else if (startMonth === FALL_SEMESTER_START_MONTH){
      if (selectedSemesters.includes(`Fall ${start.getFullYear()}`)){
        matchesSemester = true;
      }
    }

    if (endMonth === SPRING_SEMESTER_END_MONTH){
      if (selectedSemesters.includes(`Spring ${end.getFullYear()}`)){
        matchesSemester = true;
      }
    } else if (endMonth === SUMMER_SEMESTER_END_MONTH){
      if (selectedSemesters.includes(`Summer ${end.getFullYear()}`)){
        matchesSemester = true;
      }
    } else if (endMonth === FALL_SEMESTER_END_MONTH){
      if (selectedSemesters.includes(`Fall ${end.getFullYear()}`)){
        matchesSemester = true;
      }
    }

    const matchesAward = selectedAward === "any" || selectedAward === "" || project[uiConfig.awards[selectedAward]?.sqlName] === 1;
    const matchesStatus = selectedStatus === "any" || selectedStatus === "" || project.end_date == '' || new Date(`${project.end_date}T00:00:00`) > new Date().setHours(0,0,0,0);

    return matchesSemester && matchesAward && matchesStatus;
  })

  const totalPages = Math.ceil(filteredProjects.length/PROJECTS_PER_PAGE);

  const paginatedProjects = filteredProjects.slice(activePage * PROJECTS_PER_PAGE, (activePage + 1) * PROJECTS_PER_PAGE);

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
            text="Semesters"
            selection
            closeOnChange={false}
          >
            <Dropdown.Menu>
              {availableSemesters.map((semester) => (
                <Dropdown.Item
                  key={semester}
                  value={semester}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSemesters((prev) => prev.includes(semester) ? prev.filter((s) => s !== semester) : [...prev, semester]);}}
                >
                  <Checkbox label={semester} checked={selectedSemesters.includes(semester)} onClick={(e) => e.stopPropagation()} onChange={() => {}} />
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <select className="dropdown" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="" disabled>Status</option>
            <option value="any">Any Status</option>
            <option value="current">Current</option>
          </select>
          <select className="dropdown" value={selectedAward} onChange={(e) => setSelectedAward(e.target.value)}>
            <option value="" disabled>Award</option>
            <option value="any">Any or None</option>
            {Object.values(uiConfig.awards).map((award) => (
              <option key={award.id} value={award.id}>{award.name}</option>
            ))}
          </select>
        </div>
        </div>
        

        <div className="ui invisible divider"></div>

        <div style={{display: "flex", flexDirection: "column", justifyContent:"center"}}>
          <div className="projects-grid">
            {paginatedProjects.map((project) => {
              return <ProjectCard key={project.id} project={project} onClick={setSelectedProject}/>;
            })}
          </div>

        <Pagination
          className="project-pagination"
          activePage={activePage + 1}
          totalPages={totalPages}
          boundaryRange={1}
          siblingRange={1}
          onPageChange={(e, { activePage }) => {
            setActivePage(activePage - 1);
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