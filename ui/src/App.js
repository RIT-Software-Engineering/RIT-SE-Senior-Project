import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import ProjectsPage from "./components/pages/ProjectsPage";
import UniqueProjectPage from "./components/pages/UniqueProjectPage";
import SponsorPage from "./components/pages/SponsorPage";
import ProposalPage from "./components/pages/ProposalPage";
import ErrorPage from "./components/pages/ErrorPage";
import DashboardPage from "./components/pages/DashboardPage";
import AuthErrorPage from "./components/pages/AuthErrorPage";
import ErrorLogsPage from "./components/pages/ErrorLogsPage";
import AuditLogsPage from "./components/pages/AuditLogsPage";
import Header from "./components/shared/allPages/Header";
import Footer from "./components/shared/allPages/Footer";
import { UserContextProvider } from "./components/util/functions/UserContext";
import { Container } from "semantic-ui-react";
import ErrorBoundary from "./components/shared/allPages/ErrorBoundary";
import StackTraceErrorPage from "./components/pages/StackTraceErrorPage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./css/utils/helpers.css";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <UserContextProvider>
        <ErrorBoundary>
          <Header />
          <div id="page">
            <Container>
              <Switch>
                <Route path="/" component={HomePage} exact />
                <Route
                  path="/projects/:url_slug"
                  component={UniqueProjectPage}
                />
                <Route path="/projects" component={ProjectsPage} />
                <Route path="/sponsor" component={SponsorPage} />
                <Route path="/proposal-form" component={ProposalPage} />
                <Route path="/dashboard" component={DashboardPage} />
                <Route path="/auth-error" component={AuthErrorPage} />
                <Route path="/error-logs" component={ErrorLogsPage} />
                <Route path="/audit-logs" component={AuditLogsPage} />
                <Route path="/error" component={StackTraceErrorPage} />
                <Route component={ErrorPage} />
              </Switch>
            </Container>
          </div>
          <Footer />
        </ErrorBoundary>
      </UserContextProvider>
    </DndProvider>
  );
}

export default App;
