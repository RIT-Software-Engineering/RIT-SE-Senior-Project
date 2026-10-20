import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ExemplaryProject from "../shared/ExemplaryProject";
import { Icon, Button } from "semantic-ui-react";
import { config } from "../util/functions/constants";
import { SecureFetch } from "../util/functions/secureFetch";
import InnerHTML from "dangerously-set-html-content";
import uiConfig from "../../config/uiConfig";
import "./../../css/components/pages/Homepage.css";

const PROJECTS_PER_PAGE = 5;

function HomePage() {
  const history = useHistory();
  const [projects, setProjects] = useState([]);
  const [homeHtml, setHomeHtml] = useState("");
  const [secondaryInfoPanelHTML, setSecondaryInfoPanelHTML] = useState("");
  const [currentProjectsHTML, setCurrentProjectsHTML] = useState("");

  /*
   * When the page initially loads, fetches random featured archives.
   * The secureFetch after it is for getting the HTML from the database to display above exemplary projects.
   */
  useEffect(() => {
    SecureFetch(
      `${config.url.API_GET_ACTIVE_ARCHIVES}?resultLimit=${PROJECTS_PER_PAGE}&page=${0}&featured=${true}`,
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
  }, []);

  return (
    <>
      <div className="content">
        <div className="row" style={{display: "flex", justifyContent: "center", marginTop: "60px", paddingBottom: "30px", gap: "15px"}}>
        <div className="page-title">Welcome to</div><div className="page-title page-title--orange">{uiConfig.app.name}</div>
      </div>
        {homeHtml && (
          <InnerHTML html={homeHtml} className="ui homepage-panel" />
        )}
      </div>
      (Exemplary Projects Area)
      <div className="ui invisible divider"></div>
      {secondaryInfoPanelHTML && (
          <InnerHTML html={secondaryInfoPanelHTML} className="ui homepage-panel" />
        )}
      <div className="ui invisible divider"></div>
      {currentProjectsHTML && (
          <InnerHTML html={currentProjectsHTML} className="ui homepage-panel" />
        )}
    </>
  );
}

export default HomePage;