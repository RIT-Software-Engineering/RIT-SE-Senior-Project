import React from "react";
import { Tab } from "semantic-ui-react";
import { useLocation } from "react-router";
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
import "./../../css/dashboard.css";

export default function DashboardPage() {
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();
    let role = query.get("role") || "noRole";

    let panes = [];

    if (role === "admin") {
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
                        <ProposalTable />
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
                        <ActionEditor />
                        <ProjectEditor />
                    </Tab.Pane>
                ),
            },
        ];
    } else if (role === "coach") {
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
                        <Proposals />
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
    } else if (role === "student") {
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
    } else if (role === "noRole") {
        panes = [
            {
                menuItem: "Uh Oh!",
                render: () => (
                    <Tab.Pane>
                        <p>You don't seem to have a role selected!</p>
                    </Tab.Pane>
                ),
            },
        ];
    } else {
    }

    return <Tab panes={panes} className="admin-menu" />;
}
