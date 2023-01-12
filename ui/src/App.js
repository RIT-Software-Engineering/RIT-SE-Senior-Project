import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import ProjectsPage from "./components/pages/ProjectsPage";
import UniqueProjectPage from "./components/pages/UniqueProjectPage";
import SponsorPage from "./components/pages/SponsorPage";
import ProposalPage from "./components/pages/ProposalPage";
import ErrorPage from "./components/pages/ErrorPage";
import DashboardPage from "./components/pages/DashboardPage";
import Header from "./components/shared/allPages/Header";
import Footer from "./components/shared/allPages/Footer";
import {UserContextProvider} from "./components/util/functions/UserContext";
import { Container } from "semantic-ui-react";
import {Helmet} from "react-helmet";
import "./App.css";

function App() {
    return (
        <UserContextProvider>
            <Header />
            {/* Open Graph Protocol */}
            <Helmet>
                <meta property="og:title" content="Senior Project - RIT Software Engineering"/>
                <meta property="og:type" content="website"/>
                <meta property="og:image" content="https://cdn.rit.edu/images/news/2020-09/aerial_drone_09-web.jpg"/>
                <meta property="og:url" content="https://seniorproject.se.rit.edu/"/>
                <meta property="og:description" content=
                    "Senior Project is a capstone course completed by every
                    Software Engineering senior. Small teams of students are assigned to solve challenging,
                    real-world software issues for companies and organizations. External corporate and non-profit
                    sponsors submit proposals for projects that teams of 4 or 5 students will work on."/>
            </Helmet>
            <div id="page">
                <Container>
                    <Switch>
                        <Route path="/" component={HomePage} exact />
                        <Route path="/projects/:url_slug" component={UniqueProjectPage}/>
                        <Route path="/projects" component={ProjectsPage}/>
                        <Route path="/sponsor" component={SponsorPage} />
                        <Route path="/proposal-form" component={ProposalPage} />
                        <Route path="/dashboard" component={DashboardPage} />
                        <Route component={ErrorPage} />
                    </Switch>
                </Container>
            </div>
            <Footer/>
        </UserContextProvider>
    );
}

export default App;
