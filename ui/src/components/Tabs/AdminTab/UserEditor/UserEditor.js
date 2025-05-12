import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../../../util/functions/constants";
import UserEditorUserGroups from "./UserEditorUserGroups";
import UserPanel from "./UserPanel";
import { SecureFetch } from "../../../util/functions/secureFetch";
import BatchUserPanel from "./BatchUserPanel";

/**
 * This is the shell for the Users accordion
 * Adds a plus button for user creation
 *
 * This currently "works". You can add a user but all fields must be filled out.
 * The workaround for this is editing, a lot of work needs to be done on both fronts though
 * @param {*} props
 * @returns
 */
export default function UserEditor(props) {
  const [students, setStudentsData] = useState([]);
  const [semesters, setSemestersData] = useState();
  const [projects, setProjectsData] = useState([]);
  const [users, setUserData] = useState([]);

  //user upload wont refresh bc no new user data is given
  const getSemesters = () => {
    SecureFetch(config.url.API_GET_STUDENT_INFO)
      .then((response) => response.json())
      .then((studentsData) => {
        setStudentsData(studentsData);
      })
      .catch((error) => {
        alert("Failed to get students data" + error);
      });
    SecureFetch(config.url.API_GET_NON_STUDENT_INFO)
      .then((response) => response.json())
      .then((userData) => {
        setUserData(userData);
      })
      .catch((error) => {
        alert("Failed to get non student data" + error);
      });
    SecureFetch(config.url.API_GET_SEMESTERS)
      .then((response) => response.json())
      .then((semestersData) => {
        setSemestersData(semestersData);
      })
      .catch((error) => {
        alert("Failed to get semestersData data" + error);
      });
    SecureFetch(config.url.API_GET_ACTIVE_PROJECTS)
      .then((response) => response.json())
      .then((projectsData) => {
        setProjectsData(projectsData);
      })
      .catch((error) => {
        alert("Failed to get projectsData" + error);
      });
  };

  useEffect(() => {
    getSemesters();
  }, []);

  if (!students || !semesters || !Object.keys(projects).length) {
    return <>loading...</>;
  }

  //the empty user panel should trigger user creation
  return (
    <div className="accordion-button-group">
      <Accordion
        fluid
        styled
        panels={[
          {
            key: "userEditor",
            title: "Users",
            content: {
              content: (
                <UserEditorUserGroups
                  studentData={students}
                  userData={users}
                  projectData={projects}
                  semesterData={semesters}
                  callback={getSemesters}
                />
              ),
            },
          },
        ]}
      />
      <div className="accordion-buttons-container">
        <UserPanel
          studentData={students}
          userData={users}
          semesterData={semesters}
          header={`Create user`}
          callback={getSemesters}
        />
        <BatchUserPanel callback={getSemesters} />
      </div>
    </div>
  );
}
