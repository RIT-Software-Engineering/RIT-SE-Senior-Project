import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import SponsorPage from "./components/pages/SponsorPage";
import ProposalPage from "./components/pages/ProposalPage";
import ErrorPage from "./components/pages/ErrorPage";
import DashboardPage from "./components/pages/DashboardPage";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import { UserContextProvider } from "./components/util/UserContext";
import { Container } from "semantic-ui-react";
import "./App.css";

function App() {
    return (
        <UserContextProvider>
            <Header />
            <div id="page">
                <Container>
                    <Switch>
                        <Route path="/" component={HomePage} exact />
                        <Route path="/sponsor" component={SponsorPage} />
                        <Route path="/proposal-form" component={ProposalPage} />
                        <Route path="/dashboard" component={DashboardPage} />
                        <Route component={ErrorPage} />
                    </Switch>
                </Container>
            </div>
            <Footer />
        </UserContextProvider>
    );
}

export default App;
