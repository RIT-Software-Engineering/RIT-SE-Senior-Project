import React, { useState, useEffect } from "react";
import { Icon, Container } from "semantic-ui-react";
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

  const [projectsPerSlide, setProjectsPerSlide] = useState(window.innerWidth <= 1200 ? 1 : PROJECTS_PER_SLIDE);

  useEffect(() => {
    const handleResize = () => {
      setProjectsPerSlide(
        window.innerWidth <= 1200 ? 1 : PROJECTS_PER_SLIDE
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalCurrentSlides = Math.ceil(currentProjects.length/projectsPerSlide);
  const visibleCurrentProjects = currentProjects.length > 0 ? Array.from( { length: Math.min(projectsPerSlide, currentProjects.length) }, (_, i) => currentProjects[(currentProjectSlide * projectsPerSlide + i) % currentProjects.length]): [];

  const totalFeaturedSlides = Math.ceil(featuredProjects.length/projectsPerSlide);
  const visibleFeaturedProjects = featuredProjects.length > 0 ? Array.from( { length: Math.min(projectsPerSlide, featuredProjects.length) }, (_, i) => featuredProjects[(featuredProjectSlide * projectsPerSlide + i) % featuredProjects.length]): [];

  

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
      if (!project.end_date || project.end_date === ''){
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

  console.log({
  featuredProjectSlide,
  totalFeaturedSlides,
  isLastSlide: featuredProjectSlide >= totalFeaturedSlides - 1,
});

  return (
    <>
    <div className="homepage">
      <Container>
      <div className="content">
        <p className="page-title">Welcome to <span class="orange">{uiConfig.app.name}</span></p>
        {homeHtml && (
          <InnerHTML html={homeHtml} className="ui homepage-panel" />
        )}

        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        
          <div className="projects-carousel-wrapper">
            <button
              className="pagination-arrow-left"
              onClick={() => setFeaturedProjectSlide((prev) => (prev - 1 + totalFeaturedSlides) % totalFeaturedSlides)}
            >
              <Icon name="arrow alternate circle left outline"/>
            </button>

            <div className="projects-carousel">
              {visibleFeaturedProjects.map((featuredProject, index) => {
                let cardClass;
                if (projectsPerSlide===1){
                  cardClass = "card-exemplary";
                }else{
                  cardClass = (index === 0) ? "card-exemplary-left" : (index === 2) ? "card-exemplary-right" : "card-exemplary";
                }
                return <ProjectCard key={featuredProject.id} project={featuredProject} onClick={() => setSelectedProject(featuredProject)} cardClass={cardClass}/>;
              })}
            </div>

            <button
              className="pagination-arrow-right"
              onClick={() => setFeaturedProjectSlide((prev) => (prev + 1) % totalFeaturedSlides)}
            >
              <Icon name="arrow alternate circle right outline"/>
            </button>
            <div className="gradient-overlay-left"></div>
            <div className="gradient-overlay-right"></div>
          </div>
        
      </div>
      </div>

      </Container>

      <div className="ui invisible divider"></div>
      {secondaryInfoPanelHTML && (
          <InnerHTML html={secondaryInfoPanelHTML} className="ui homepage-panel" />
        )}
      <div className="ui invisible divider"></div>

      <Container>

      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        {currentProjectsHTML && (
            <InnerHTML html={currentProjectsHTML} className="ui homepage-panel" />
          )}
        <div className="projects-carousel-wrapper">
        <div className="projects-carousel">
          <button
            className="pagination-arrow-left-secondary"
            onClick={() => setCurrentProjectSlide((prev) => (prev - 1 + totalCurrentSlides) % totalCurrentSlides)}
          >
            <Icon name="arrow alternate circle left outline"/>
          </button>


          <div key={currentProjectSlide} className="projects-carousel carousel-slide">
            {visibleCurrentProjects.map((currentProject) => {
              return <ProjectCard key={currentProject.id} project={currentProject} onClick={() => setSelectedProject(currentProject)}/>;
            })}
          </div>

          <button
            className="pagination-arrow-right-secondary"
            onClick={() => setCurrentProjectSlide((prev) => (prev + 1) % totalCurrentSlides)}
          >
            <Icon name="arrow alternate circle right outline"/>
          </button>
        </div>
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
      </Container>
    </div>
    </>
  );
}

export default HomePage;