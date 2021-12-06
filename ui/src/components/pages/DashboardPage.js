import React, { useContext, useEffect, useState } from "react";
import { Tab } from "semantic-ui-react";
import TimeLinesView from "../shared/TimeLinesView";
import SemesterEditor from "../shared/SemesterEditor";
import ActionEditor from "../shared/ActionEditor";
import StudentsTab from "../shared/StudentsTab";
import ProjectsTab from "../shared/ProjectsTab";
import ProjectEditor from "../shared/ProjectEditor";
import ActionLogs from "../shared/ActionLogs";
import CoachesTab from "../shared/CoachesTab";
import AdminView from "../shared/AdminView";
import { UserContext } from "../util/UserContext";
import "./../../css/dashboard.css";
import UserEditor from "../shared/UserEditor";
import { SecureFetch } from "../util/secureFetch";
import { config } from "../util/constants";
import FileEditor from "../shared/FileEditor";
import SponsorsTab from "../shared/SponsorsTab";
import SponsorEditorAccordion from "../shared/SponsorEditorAccordion";

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
                        content:"Admin",
                        href: "#"
                    },
                    render: () => (
                        <Tab.Pane>
                            <SemesterEditor />
                            <ActionEditor semesterData={semesterData} />
                            <ProjectEditor semesterData={semesterData} />
                            <UserEditor />
                            <SponsorEditorAccordion />
                            <FileEditor />
                        </Tab.Pane>
                    ),
                },
                {
                    menuItem: {
                        content:"Sponsors",
                        href: "#"
                    },
                    render: () => (
                        <Tab.Pane>
                            <SponsorsTab />
                        </Tab.Pane>
                    )
                },
            );
        // Break intentionally left out to take advantage of switch flow
        // eslint-disable-next-line
        case "coach":
            panes.push(
                {
                    menuItem: {
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
                        content:"Action Submissions",
                        href: "#"
                    },
                    render: () => (
                        <Tab.Pane>
                            <ActionLogs semesterData={semesterData} />
                        </Tab.Pane>
                    ),
                },
                {
                    menuItem: {
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

    return <>
        <AdminView />
        <Tab panes={panes} className="admin-menu" />
    </>;
}
