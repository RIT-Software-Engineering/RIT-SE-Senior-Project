import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Icon, Container } from "semantic-ui-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [additionalInfoPanelHTML, setAdditionalInfoPanelHTML] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);
  const [featuredProjectSlide, setFeaturedProjectSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  const history = useHistory();
  const { url } = useRouteMatch();

  const handleBrowseAllProjectsClick = () => {
    history.push(`${url}projects`);
    window.scrollTo(0,0);
  }

  const currentSlideAnimations = {
    enter: (direction) => ({
      x: direction > 0 ? 150 : -150,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -150 : 150,
      opacity: 0
    }),
  };

  const featuredSlideAnimations = {
    enter: (direction) => ({
      opacity: 1,
      rotateY: direction === 1 ? 50 : -50,
      scale: 0.9,
      x: direction === 1 ? 220: -220
    }),
    center: (index) => ({
      opacity: 1,
      rotateY: 0,
      scale: index === 1 ? 1 : 0.9,
      x: 0,
    }),
    exit: (direction, index) => ({
      x: direction === 1 ? -220 : 220,
      rotateY: -60,
      scale: index === 0 ? 1.2 : 1,
      opacity: 1
    }),
  }

  const [featuredProjectsPerSlide, setFeaturedProjectsPerSlide] = useState(window.innerWidth <= 1200 ? 1 : PROJECTS_PER_SLIDE);
  const [currentProjectsPerSlide, setCurrentProjectsPerSlide] = useState(window.innerWidth <= 750 ? 1 : window.innerWidth <= 1200 ? 1 : PROJECTS_PER_SLIDE);

  useEffect(() => {
    const handleResize = () => {
      const newFeaturedProjectsPerSlide = (
        window.innerWidth <= 1200 ? 1 : PROJECTS_PER_SLIDE
      );

      setFeaturedProjectsPerSlide(newFeaturedProjectsPerSlide);

      setFeaturedProjectSlide((prev) => {
        return Math.floor(( prev * featuredProjectsPerSlide )/newFeaturedProjectsPerSlide)
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [featuredProjectsPerSlide]);

  useEffect(() => {
    const handleResize = () => {
      const newCurrentProjectsPerSlide = (
        window.innerWidth <= 850 ? 1 : window.innerWidth <= 1200 ? 2 : PROJECTS_PER_SLIDE
      );

      setCurrentProjectsPerSlide(newCurrentProjectsPerSlide);

      setCurrentProjectSlide((prev) => {
        return Math.floor(( prev * currentProjectsPerSlide )/newCurrentProjectsPerSlide);
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentProjectsPerSlide]);

  const totalCurrentSlides = Math.ceil(currentProjects.length/currentProjectsPerSlide);
  const visibleCurrentProjects = currentProjects.slice(currentProjectSlide * currentProjectsPerSlide, (currentProjectSlide + 1) * currentProjectsPerSlide);
  const totalFeaturedSlides = Math.ceil(featuredProjects.length/featuredProjectsPerSlide);
  const visibleFeaturedProjects = featuredProjects.length > 0 ? Array.from( { length: Math.min(featuredProjectsPerSlide, featuredProjects.length) }, (_, i) => featuredProjects[(featuredProjectSlide * featuredProjectsPerSlide + i) % featuredProjects.length]): [];
  

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

    SecureFetch(`${config.url.API_GET_HTML}?name=secondaryInfoPanel`

    )
      .then((response) => response.json())
      .then((htmlData) => {
       setSecondaryInfoPanelHTML(htmlData[0]?.html);
      });

    SecureFetch(`${config.url.API_GET_HTML}?name=currentProjectsPanel`)
      .then((response) => response.json())
      .then((htmlData) => {
       setCurrentProjectsHTML(htmlData[0]?.html);
      });

    SecureFetch(`${config.url.API_GET_HTML}?name=additionalInfoPanel`)
      .then((response) => response.json())
      .then((htmlData) => {
       setAdditionalInfoPanelHTML(htmlData[0]?.html);
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

  return (
    <>
    <div className="homepage">
      <div className="content">
        <p className="page-title">Welcome to <span class="orange">{uiConfig.app.name}</span></p>
        {homeHtml && (
          <InnerHTML html={homeHtml} className="ui homepage-panel" />
        )}

        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        
          <div className="projects-carousel-wrapper">
            <div className="projects-carousel-content">
              <button
              className="pagination-arrow-left"
              onClick={() => {
                setSlideDirection(-1);
                setFeaturedProjectSlide((prev) => (prev - 1 + totalFeaturedSlides) % totalFeaturedSlides)}}
              >
              <Icon name="arrow alternate circle left outline"/>
            </button>

            <div className="exemplary-projects-carousel">
            <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={featuredProjectSlide}
              custom={slideDirection}
              variants={featuredSlideAnimations}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: "easeInOut", opacity: { duration: 0.9, ease: "easeInOut" } }}
              className="exemplary-projects-carousel"
              style={{ display: "flex", flexDirection: "row", gap: "20px" }}
            >
              {visibleFeaturedProjects.map((featuredProject, index) => {
                let cardClass;
                if (featuredProjectsPerSlide===1){
                  cardClass = "card-exemplary";
                }else{
                  cardClass = (index === 0) ? "card-exemplary-left" : (index === 2) ? "card-exemplary-right" : "card-exemplary";
                }
                return(
                <motion.div
                  key={featuredProject.id}
                  custom={index}
                  variants={featuredSlideAnimations}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut", delay: index * 0.1 }}
                  style={{ transformStyle: "preserve-3d", perspective: "1000" }}
                >
                  <ProjectCard key={featuredProject.id} project={featuredProject} onClick={() => setSelectedProject(featuredProject)} cardClass={cardClass}/>
                </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
          </div>

            <button
              className="pagination-arrow-right"
              onClick={() => {
                setSlideDirection(1);
                setFeaturedProjectSlide((prev) => (prev + 1) % totalFeaturedSlides)}}
            >
              <Icon name="arrow alternate circle right outline"/>
            </button>
            </div>
            <div className="gradient-overlay-left"></div>
            <div className="gradient-overlay-right"></div>
          </div>
          <div className="ui header" style={{ margin: "0" }}>{featuredProjectSlide + 1} of {totalFeaturedSlides}</div>
      </div>
      </div>

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
        <div className="current-projects-carousel">
          <button
            className="pagination-arrow-left-secondary"
            onClick={() => {
              setSlideDirection(-1);
              setCurrentProjectSlide((prev) => Math.max(0, prev - 1))}}
          >
            <Icon name="arrow alternate circle left outline"/>
          </button>

          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              className="current-projects-carousel"
              key={currentProjectSlide}
              >
              {visibleCurrentProjects.map((currentProject, index) => (
                <motion.div
                  key={currentProject.id}
                  custom={slideDirection}
                  variants={currentSlideAnimations}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut", delay: index * 0.1 }}
                >
                  <ProjectCard
                    project={currentProject}
                    onClick={() => setSelectedProject(currentProject)}
                 />
                </motion.div>
              ))}
              </motion.div>
            </AnimatePresence>
          

          <button
            className="pagination-arrow-right-secondary"
            onClick={() => {
              setSlideDirection(1);
              setCurrentProjectSlide((prev) => (prev + 1) % totalCurrentSlides)}}
          >
            <Icon name="arrow alternate circle right outline"/>
          </button>
        </div>
        </div>
        <div className="ui header" style={{ marginTop: 15, marginBottom: 20 }}>{currentProjectSlide + 1} of {totalCurrentSlides}</div>
        <div class="row">
          <button id="allProjectsBtn" class="button homepage-button" onClick={handleBrowseAllProjectsClick}>
            Browse All Projects
          </button>
        </div>
      </div>

      {additionalInfoPanelHTML && (
          <InnerHTML html={additionalInfoPanelHTML} className="ui homepage-panel" /> //empty additional panel
        )}

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