import React, { useContext, useEffect, useState } from "react";
import { Loader, Tab } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import TimeLinesView from "../Tabs/DashboardTab/TimelinesView/TimeLinesView";
import SemesterEditor from "../Tabs/AdminTab/SemesterEditor/SemesterEditor";
import ActionEditor from "../Tabs/AdminTab/ActionEditor/ActionEditor";
import StudentsTab from "../Tabs/StudentsTab/StudentsTab";
import ProjectsTab from "../Tabs/ProjectsTab/ProjectsTab";
import ProjectEditor from "../Tabs/AdminTab/ProjectEditor";
import ActionLogs from "../Tabs/ActionSubmissionsTab/ActionLogs";
import CoachesTab from "../Tabs/CoachesTab/CoachesTab";
import AdminView from "../util/components/AdminView";
import { UserContext } from "../util/functions/UserContext";
import UserEditor from "../Tabs/AdminTab/UserEditor/UserEditor";
import { SecureFetch } from "../util/functions/secureFetch";
import { config } from "../util/functions/constants";
import FileEditor from "../Tabs/AdminTab/ContentEditor/FileEditor";
import SponsorsTab from "../Tabs/SponsorsTab/SponsorsTab";
import SponsorEditorAccordion from "../Tabs/AdminTab/SponsorEditorAccordion";
import ArchiveEditor from "../Tabs/AdminTab/ArchiveEditor/ArchiveEditor";
import TimeLog from "../Tabs/TimeTrackingTab/TimeLog";
import "./../../css/utils/helpers.css";

export default function DashboardPage() {
  const { user, setUser } = useContext(UserContext);
  const [semesterData, setSemestersData] = useState([]);
  const [authError, setAuthError] = useState(false);
  const history = useHistory();

  // When dashboard loads, check who is currently signed in
  useEffect(() => {
    SecureFetch(config.url.API_WHO_AM_I)
      .then((response) => {
        if (!response.ok) {
          // Handle authentication errors (401, 403)
          if (response.status === 401 || response.status === 403) {
            setAuthError(true);
            history.push("/auth-error");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseUser) => {
        if (!responseUser) return; // Exit if response was null (auth error case)

        // Handle cases where profile_info might be null or empty
        let parsedProfileInfo;
        try {
          parsedProfileInfo = responseUser.profile_info
            ? JSON.parse(responseUser.profile_info.toString())
            : { additional_info: "", dark_mode: false, gantt_view: true };
        } catch (error) {
          console.error("Error parsing profile_info:", error);
          parsedProfileInfo = {
            additional_info: "",
            dark_mode: false,
            gantt_view: true,
          };
        }
        setUser({
          user: responseUser.system_id,
          role: responseUser.type,
          fname: responseUser.fname,
          lname: responseUser.lname,
          semester_group: responseUser.semester_group,
          project: responseUser.project,
          isMock: Object.keys(responseUser.mock).length !== 0,
          mockUser: responseUser.mock,
          last_login: responseUser.last_login,
          prev_login: responseUser.prev_login,
          view_only: responseUser.view_only === "TRUE" ? true : false,
          profile_info: parsedProfileInfo,
        });
        if (responseUser.system_id) {
          const darkPref = ["1", "true"].includes(
            parsedProfileInfo.dark_mode.toString().trim().toLowerCase(),
          );
          document.body.classList.toggle("dark-mode", darkPref);
        }
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        setAuthError(true);
        history.push("/auth-error");
      });

    SecureFetch(config.url.API_GET_SEMESTERS)
      .then((response) => response.json())
      .then((semestersData) => {
        setSemestersData(semestersData);
      })
      .catch((error) => {
        console.error("Failed to get semestersData data" + error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let panes = [];
  switch (user.role) {
    case "admin":
      if (!user.view_only && !user.mockUser.view_only) {
        panes.push({
          menuItem: {
            key: "Admin-Tab",
            content: (
              <>
                <i className="cog icon" style={{ marginRight: 5 }} />
                Admin
              </>
            ),
            href: "#",
          },
          render: () => (
            <Tab.Pane>
              <SemesterEditor />
              <ActionEditor semesterData={semesterData} />
              <ProjectEditor semesterData={semesterData} />
              <ArchiveEditor />
              <UserEditor />
              <SponsorEditorAccordion />
              <FileEditor />
            </Tab.Pane>
          ),
        });
      }
    // Break intentionally left out to take advantage of switch flow
    // eslint-disable-next-line
    case "coach":
      panes.push(
        {
          menuItem: {
            key: "Sponsors-Tab",
            content: (
              <>
                <i className="handshake icon" style={{ marginRight: 5 }} />
                Sponsors
              </>
            ),
            href: "#",
          },
          render: () => (
            <Tab.Pane>
              <SponsorsTab
                viewOnly={user.view_only || user.mockUser.view_only}
              />
            </Tab.Pane>
          ),
        },
        {
          menuItem: {
            key: "Coaches-Tab",
            content: (
              <>
                <i className="graduation cap icon" style={{ marginRight: 5 }} />
                Coaches
              </>
            ),
            href: "#",
          },
          render: () => (
            <Tab.Pane>
              <CoachesTab />
            </Tab.Pane>
          ),
        },
      );
    // Break intentionally left out to take advantage of switch flow
    // eslint-disable-next-line
    case "student":
      panes.push(
        {
          menuItem: {
            key: "Students-Tab",
            content: (
              <>
                <i className="users icon" style={{ marginRight: 5 }} />
                Students
              </>
            ),
            href: "#",
          },
          render: () => (
            <Tab.Pane>
              <StudentsTab project_id={user.project} />
            </Tab.Pane>
          ),
        },
        {
          menuItem: {
            key: "Projects-Tab",
            content: (
              <>
                <i className="folder open icon" style={{ marginRight: 5 }} />
                Projects
              </>
            ),
            href: "#",
          },
          render: () => (
            <Tab.Pane>
              <ProjectsTab
                semesterData={semesterData}
                viewOnly={user.view_only || user.mockUser.view_only}
              />
            </Tab.Pane>
          ),
        },
        {
          menuItem: {
            key: "Logging-Tab",
            content: (
              <>
                <i className="clock outline icon" style={{ marginRight: 5 }} />
                Logging
              </>
            ),
            href: "#",
          },
          render: () => (
            <Tab.Pane>
              <TimeLog
                semesterData={semesterData}
                viewOnly={user.view_only || user.mockUser.view_only}
              />
              <ActionLogs semesterData={semesterData} />
            </Tab.Pane>
          ),
        },
        {
          menuItem: {
            key: "Dashboard-Tab",
            content: (
              <>
                <i className="dashboard icon" style={{ marginRight: 5 }} />
                Dashboard
              </>
            ),
            href: "#",
          },
          render: () => (
            <Tab.Pane>
              <TimeLinesView semesterData={semesterData} />
            </Tab.Pane>
          ),
        },
      );
      break;
    default:
      panes.push({
        menuItem: {
          key: "Loading-Placeholder-Tab",
          content: "Loading...",
          href: "#",
        },
        render: () => (
          <Tab.Pane>
            <Loader active inline="centered" />
          </Tab.Pane>
        ),
      });
  }

  panes.reverse();

  // Don't render dashboard if there's an authentication error
  if (authError) {
    return null; // The useEffect will handle redirecting to auth-error page
  }

  return (
    <>
      <AdminView />
      {/*This is for the tabs inside of the dashboard tab*/}
      <Tab panes={panes} className="admin-menu" />
    </>
  );
}
