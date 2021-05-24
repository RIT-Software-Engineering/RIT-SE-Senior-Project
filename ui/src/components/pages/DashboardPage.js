import React, { useContext, useEffect, useState } from "react";
import { Tab } from "semantic-ui-react";
import Proposals from "../shared/Proposals";
import TimeLines from "../shared/TimeLines";
import SemesterEditor from "../shared/SemesterEditor";
import ActionEditor from "../shared/ActionEditor";
import StudentsTab from "../shared/StudentsTab";
import ProposalTable from "../shared/ProposalTable";
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
                    role: responseUser.type
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

    if (user.role === "admin") {
        panes = [
            {
                menuItem: "Dashboard",
                render: () => (
                    <Tab.Pane>
                        <TimeLines />
                    </Tab.Pane>
                ),
            },
            {
                menuItem: "Proposals",
                render: () => (
                    <Tab.Pane>
                        <ProposalTable semesterData={semesterData} />
                    </Tab.Pane>
                ),
            },
            { menuItem: "Sponsor Info", render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
            {
                menuItem: "Students",
                render: () => (
                    <Tab.Pane>
                        <StudentsTab />
                    </Tab.Pane>
                ),
            },
            { menuItem: "Coaches", render: () => <Tab.Pane><CoachesTab/></Tab.Pane> },
            {
                menuItem: "Actions",
                render: () => (
                    <Tab.Pane>
                        <ActionsTab />
                    </Tab.Pane>
                ),
            },
            {
                menuItem: "Admin",
                render: () => (
                    <Tab.Pane>
                        <AdminView />
                        <SemesterEditor />
                        <ActionEditor semesterData={semesterData} />
                        <ProjectEditor semesterData={semesterData} />
                        <UserEditor />
                    </Tab.Pane>
                ),
            },
        ];
    } else if (user.role === "coach") {
        panes = [
            {
                menuItem: "Dashboard",
                render: () => (
                    <Tab.Pane>
                        <TimeLines />
                    </Tab.Pane>
                ),
            },
            {
                menuItem: "Proposals",
                render: () => (
                    <Tab.Pane>
                        <Proposals semesterData={semesterData} />
                    </Tab.Pane>
                ),
            },
            { menuItem: "Sponsor Info", render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
            {
                menuItem: "Students",
                render: () => (
                    <Tab.Pane>
                        <StudentsTab />
                    </Tab.Pane>
                ),
            },
            { menuItem: "Coaches", render: () => <Tab.Pane><CoachesTab/></Tab.Pane> },
            {
                menuItem: "Actions",
                render: () => (
                    <Tab.Pane>
                        <ActionsTab />
                    </Tab.Pane>
                ),
            },
        ];
    } else if (user.role === "student") {
        panes = [
            {
                menuItem: "Dashboard",
                render: () => (
                    <Tab.Pane>
                        <TimeLines />
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
        ];
    } else {
        panes = [
            {
                menuItem: "Loading...",
                render: () => (
                    <Tab.Pane>
                        <p>Loading...</p>
                    </Tab.Pane>
                ),
            },
        ];
    }

    return <Tab panes={panes} className="admin-menu" />;
}
