import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ExemplaryProject from "../shared/ExemplaryProject";
import { Icon, Button } from "semantic-ui-react";
import { config } from "../util/functions/constants";
import { SecureFetch } from "../util/functions/secureFetch";
import InnerHTML from "dangerously-set-html-content";
import "./../../css/components/pages/Homepage.css";

const PROJECTS_PER_PAGE = 5;

function HomePage() {
  const history = useHistory();
  const [projects, setProjects] = useState([]);
  const [homeHtml, setHomeHtml] = useState("");

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
  }, []);

  return (
    <>
      <div className="content">
        {homeHtml && (
          <InnerHTML html={homeHtml} className="ui segment homepage-panel" />
        )}
      </div>
      <div className="ui invisible divider"></div>
      <div className="ui divider"></div>

      <div className="row">
        <h2>Exemplary Projects</h2>
      </div>
      <div className="ui invisible divider"></div>
      <div id="exemplaryProjectsDiv" className="homepage-exemplary">
        {/* <!-- Attach exemplary project elements here --> */}
        {projects.map((project, idx) => {
          return <ExemplaryProject project={project} key={idx} />;
        })}

        <br></br>
        <Button
          href={"/projects"}
          className="ui button homepage-view-more-btn"
          onClick={() => {
            history.push("/projects");
          }}
          icon
          labelPosition="right"
        >
          View More Projects
          <Icon name="ellipsis horizontal" />
        </Button>
      </div>
    </>
  );
}

export default HomePage;
