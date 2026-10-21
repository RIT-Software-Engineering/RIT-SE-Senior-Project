import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ExemplaryProject from "../shared/ExemplaryProject";
import { Icon, Button, Pagination } from "semantic-ui-react";
import { config } from "../util/functions/constants";
import { SecureFetch } from "../util/functions/secureFetch";
import InnerHTML from "dangerously-set-html-content";
import uiConfig from "../../config/uiConfig";
import ProjectCard from "../shared/ProjectCard.js"
import ProjectModal from "../shared/ProjectModal.js"
import "./../../css/components/pages/Homepage.css";
import "./../../css/components/pages/ProjectsPage.css";
import "../../css/components/shared/projectCard.css"

const PROJECTS_PER_SLIDE = 3;

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [homeHtml, setHomeHtml] = useState("");
  const [secondaryInfoPanelHTML, setSecondaryInfoPanelHTML] = useState("");
  const [currentProjectsHTML, setCurrentProjectsHTML] = useState("");
  const [browseAllProjectsHTML, setBrowseAllProjectsHTML] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);
  const [featuredProjectSlide, setFeaturedProjectSlide] = useState(0);

  const totalCurrentSlides = Math.ceil(currentProjects.length.PROJECTS_PER_SLIDE);
  const visibleCurrentProjects = currentProjects.slice(currentProjectSlide*PROJECTS_PER_SLIDE, (currentProjectSlide+1)*PROJECTS_PER_SLIDE);

  const totalFeaturedSlides = Math.ceil(featuredProjects.length.PROJECTS_PER_SLIDE);
  const visibleFeaturedProjects = featuredProjects.slice(featuredProjectSlide*PROJECTS_PER_SLIDE, (featuredProjectSlide+1)*PROJECTS_PER_SLIDE);

  /*
   * When the page initially loads, fetches random featured archives.
   * The secureFetch after it is for getting the HTML from the database to display above exemplary projects.
   */
  useEffect(() => {
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
        setProjects(data.projects);
      })
      .catch((error) => {
        console.error(error);
      });

    SecureFetch(`${config.url.API_GET_HTML}?name=homePagePanel`)
      .then((response) => response.json())
      .then((htmlData) => {
       setHomeHtml(htmlData[0]?.html);
      });

    SecureFetch(`${config.url.API_GET_HTML}?name=secondaryInfoPanel`)
      .then((response) => response.json())
      .then((htmlData) => {
       setSecondaryInfoPanelHTML(htmlData[0]?.html);
      });

    SecureFetch(`${config.url.API_GET_HTML}?name=currentProjectsPanel`)
      .then((response) => response.json())
      .then((htmlData) => {
       setCurrentProjectsHTML(htmlData[0]?.html);
      });

      SecureFetch(`${config.url.API_GET_HTML}?name=browseAllProjectsButton`)
      .then((response) => response.json())
      .then((htmlData) => {
       setBrowseAllProjectsHTML(htmlData[0]?.html);
      });
  }, []);

  useEffect(() => {
    SecureFetch(
      `${config.url.API_GET_ACTIVE_ARCHIVES}?resultLimit=1000&page=0&featured=${true}`,
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        setFeaturedProjects(data.projects);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [])

  useEffect(() => {
    setCurrentProjects(getCurrentProjects(projects));
  }, [projects]);

  const getCurrentProjects = (projects) => {
    const currentProjects = [];

    projects.forEach((project) => {
      if (!project.end_date || project.end_date == ''){
        currentProjects.push(project);
      } else {
        const today = new Date(`T00:00:00`);
        if (today <= project.end_date){
          currentProjects.push(project);
        }
      }
    })
    return currentProjects;
  }

  return (
    <>
      <div className="content">
        <div className="row" style={{display: "flex", justifyContent: "center", marginTop: "60px", paddingBottom: "30px", gap: "15px"}}>
        <div className="page-title">Welcome to</div><div className="page-title page-title--orange">{uiConfig.app.name}</div>
      </div>
        {homeHtml && (
          <InnerHTML html={homeHtml} className="ui homepage-panel" />
        )}

        <div className="current-projects-carousel">
          <button
            className="pagination-arrow"
            onClick={() => setFeaturedProjectSlide((prev) => prev - 1)}
            disabled={featuredProjectSlide===0}
          >
            <Icon name="arrow alternate circle left"/>
          </button>

          <div className="current-projects-carousel">
            {visibleFeaturedProjects.map((featuredProject, index) => {
              const cardClass = (index === 0) ? "card-exemplary-left" : (index === 2) ? "card-exemplary-right" : "card-exemplary";
              return <ProjectCard key={featuredProject.id} project={featuredProject} onClick={() => setSelectedProject(featuredProject)} cardClass={cardClass}/>;
            })}
          </div>

          <button
            className="pagination-arrow"
            onClick={() => setFeaturedProjectSlide((prev) => prev + 1)}
            disabled={featuredProjectSlide>=totalFeaturedSlides-1}
          >
            <Icon name="arrow alternate circle right"/>
          </button>
        </div>
      </div>
      

      <div className="ui invisible divider"></div>
      {secondaryInfoPanelHTML && (
          <InnerHTML html={secondaryInfoPanelHTML} className="ui homepage-panel" />
        )}
      <div className="ui invisible divider"></div>

      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        {currentProjectsHTML && (
            <InnerHTML html={currentProjectsHTML} className="ui homepage-panel" />
          )}
        <div className="current-projects-carousel">
          <button
            className="pagination-arrow"
            onClick={() => setCurrentProjectSlide((prev) => prev - 1)}
            disabled={currentProjectSlide===0}
          >
            <Icon name="arrow alternate circle left"/>
          </button>

          <div className="current-projects-carousel">
            {visibleCurrentProjects.map((currentProject) => {
              return <ProjectCard key={currentProject.id} project={currentProject} onClick={() => setSelectedProject(currentProject)}/>;
            })}
          </div>

          <button
            className="pagination-arrow"
            onClick={() => setCurrentProjectSlide((prev) => prev + 1)}
            disabled={currentProjectSlide>=totalCurrentSlides-1}
          >
            <Icon name="arrow alternate circle right"/>
          </button>
        </div>
        {browseAllProjectsHTML && (
          <InnerHTML html={browseAllProjectsHTML} className="ui homepage-panel" />
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        open={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}

export default HomePage;