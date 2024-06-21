import React, { useContext, useEffect, useState } from "react";
import { Tab } from "semantic-ui-react";
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
import "./../../css/dashboard.css";
import UserEditor from "../Tabs/AdminTab/UserEditor/UserEditor";
import { SecureFetch } from "../util/functions/secureFetch";
import { config } from "../util/functions/constants";
import FileEditor from "../Tabs/AdminTab/ContentEditor/FileEditor";
import SponsorsTab from "../Tabs/SponsorsTab/SponsorsTab";
import SponsorEditorAccordion from "../Tabs/AdminTab/SponsorEditorAccordion";
import ArchiveEditor from "../Tabs/AdminTab/ArchiveEditor/ArchiveEditor";
import TimeLog from "../Tabs/TimeTrackingTab/TimeLog";

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
                    fname: responseUser.fname,
                    lname: responseUser.lname,
                    semester_group: responseUser.semester_group,
                    isMock: Object.keys(responseUser.mock).length !== 0,
                    mockUser: responseUser.mock,
                    last_login: responseUser.last_login,
                    prev_login: responseUser.prev_login,
                });
            })
        SecureFetch(config.url.API_GET_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
            })
            .catch((error) => {
                console.error("Failed to get semestersData data" + error);
            });
    }, [])

    let panes = [];

    switch (user.role) {
        case "admin":
            panes.push(
                {
                    menuItem: {
                        key: "Admin-Tab",
                        content:"Admin",
                        href: "#"
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
                },
            );
        // Break intentionally left out to take advantage of switch flow
        // eslint-disable-next-line
        case "coach":
            panes.push(
                {
                    menuItem: {
                        key: "Sponsors-Tab",
                        content:"Sponsors",
                        href: "#"
                    },
                    render: () => (
                        <Tab.Pane>
                            <SponsorsTab />
                        </Tab.Pane>
                    )
                },
                {
                    menuItem: {
                        key: "Coaches-Tab",
                        content:"Coaches",
                        href: "#"
                    },
                    render: () => <Tab.Pane><CoachesTab /></Tab.Pane>
                }
            );
        // Break intentionally left out to take advantage of switch flow
        // eslint-disable-next-line
        case "student":
            panes.push(
                {
                    menuItem: {
                        key: "Students-Tab",
                        content:"Students",
                        href: "#"
                    },
                    render: () => (
                        <Tab.Pane>
                            <StudentsTab />
                        </Tab.Pane>
                    ),
                },
                {
                    menuItem: {
                        key: "Projects-Tab",
                        content:"Projects",
                        href: "#"
                    },
                    render: () => (
                        <Tab.Pane>
                            <ProjectsTab semesterData={semesterData} />
                        </Tab.Pane>
                    ),
                },
                {
                    menuItem: {
                        key: "Logging-Tab",
                        content:"Logging",
                        href: "#"
                    },
                    render: () => (
                        <Tab.Pane>
                            <TimeLog semesterData={semesterData} />
                            <ActionLogs semesterData={semesterData} />
                        </Tab.Pane>
                    ),
                },
                {
                    menuItem: {
                        key: "Dashboard-Tab",
                        content:"Dashboard",
                        href: "#"
                    },
                    render: () => (
                        <Tab.Pane>
                            <TimeLinesView />
                        </Tab.Pane>
                    ),
                },

            );
            break;
        default:
            panes.push({
                menuItem: {
                    key: "Loading-Placeholder-Tab",
                    content:"Loading...",
                    href: "#"
                },
                render: () => (
                    <Tab.Pane>
                        <p>Loading...</p>
                    </Tab.Pane>
                ),
            })
    }

    panes.reverse();

    return (
        <>
            <AdminView />
            {/*This is for the tabs inside of the dashboard tab*/}
            <Tab panes={panes} className="admin-menu" />
        </>
    );
}
