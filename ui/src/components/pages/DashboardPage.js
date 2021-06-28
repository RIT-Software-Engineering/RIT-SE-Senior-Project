import React, { useContext, useEffect, useState } from "react";
import { Tab } from "semantic-ui-react";
import TimeLines from "../shared/TimelLinesView";
import SemesterEditor from "../shared/SemesterEditor";
import ActionEditor from "../shared/ActionEditor";
import StudentsTab from "../shared/StudentsTab";
import ProjectsTab from "../shared/ProjectsTab";
import ProjectEditor from "../shared/ProjectEditor";
import ActionsTab from "../shared/ActionsTab";
import CoachesTab from "../shared/CoachesTab";
import AdminView from "../shared/AdminView";
import { UserContext } from "../util/UserContext";
import "./../../css/dashboard.css";
import UserEditor from "../shared/UserEditor";
import { SecureFetch } from "../util/secureFetch";
import { config } from "../util/constants";

export default function DashboardPage() {

    const { user, setUser } = useContext(UserContext);
    const [semesterData, setSemestersData] = useState([]);

    // When dashboard loads, check who is currently signed in
    useEffect(() => {
        SecureFetch(config.url.API_WHO_AM_I)
            .then((response) => response.json())
            .then(responseUser => {
                setUser({
                    user: responseUser.system_id,
                    role: responseUser.type,
                    isMock: responseUser.mock,
                });
            })
        SecureFetch(config.url.API_GET_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
            })
            .catch((error) => {
                alert("Failed to get semestersData data" + error);
            });
    }, [])

    let panes = [];

    switch (user.role) {
        case "admin":
            panes.push(
                {
                    menuItem: "Admin",
                    render: () => (
                        <Tab.Pane>
                            <SemesterEditor />
                            <ActionEditor semesterData={semesterData} />
                            <ProjectEditor semesterData={semesterData} />
                            <UserEditor />
                        </Tab.Pane>
                    ),
                },
                {
                    menuItem: "Sponsors",
                    render: () => <Tab.Pane>Tab 1 Content</Tab.Pane>
                },
            );
        // Break intentionally left out to take advantage of switch flow
        // eslint-disable-next-line
        case "coach":
            panes.push(
                {
                    menuItem: "Coaches",
                    render: () => <Tab.Pane><CoachesTab /></Tab.Pane>
                },
                {
                    menuItem: "Students",
                    render: () => (
                        <Tab.Pane>
                            <StudentsTab />
                        </Tab.Pane>
                    ),
                },
            );
        // Break intentionally left out to take advantage of switch flow
        // eslint-disable-next-line
        case "student":
            panes.push(
                {
                    menuItem: "Projects",
                    render: () => (
                        <Tab.Pane>
                            <ProjectsTab semesterData={semesterData} />
                        </Tab.Pane>
                    ),
                },
                {
                    menuItem: "Actions",
                    render: () => (
                        <Tab.Pane>
                            <ActionsTab />
                        </Tab.Pane>
                    ),
                },
                {
                    menuItem: "Dashboard",
                    render: () => (
                        <Tab.Pane>
                            <TimeLines />
                        </Tab.Pane>
                    ),
                },
            );
            break;
        default:
            panes.push({
                menuItem: "Loading...",
                render: () => (
                    <Tab.Pane>
                        <p>Loading...</p>
                    </Tab.Pane>
                ),
            })
    }

    panes.reverse();

    return <>
        <AdminView user={user} />
        <Tab panes={panes} className="admin-menu" />
    </>;
}
