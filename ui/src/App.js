import React, { useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import SponsorPage from "./components/pages/SponsorPage";
import ProposalPage from "./components/pages/ProposalPage";
import ErrorPage from "./components/pages/ErrorPage";
import DashboardPage from "./components/pages/DashboardPage";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import { UserContextProvider } from "./components/util/UserContext";
import { Container } from "semantic-ui-react";
import PrivateRoute from "./components/shared/PrivateRoute";
import SignInPage from "./components/pages/SignInPage";
import "./App.css";

function App() {

    const [signedIn, setSignedIn] = useState({ authenticated: false });
    const history = useHistory();

    console.log("app", signedIn);
    
    return (
        <>
            <UserContextProvider>
                <Header />
            </UserContextProvider>
            {signedIn?.authenticated && (
                <>
                    <button onClick={() => setSignedIn({})}>Sign Out</button>
                    <button
                        onClick={() => {
                            history.push("/dashboard?role=admin");
                        }}
                    >
                        Dashboard
                    </button>
                </>
            )}
            <div id="page">
                <Container>
                    <Switch>
                        <Route path="/" component={HomePage} exact />
                        <Route path="/sign-in">
                            <SignInPage setSignedIn={setSignedIn} />
                        </Route>
                        <Route path="/sponsor" component={SponsorPage} />
                        <Route path="/proposal-form" component={ProposalPage} />
                        {/* TODO: remove one of these /dashboard routes */}
                        <UserContextProvider>
                            <Route path="/dashboard" component={DashboardPage} />
                        </UserContextProvider>
                        <PrivateRoute signedIn={signedIn} path="/dashboard" component={DashboardPage} />
                        <Route component={ErrorPage} />
                    </Switch>
                </Container>
            </div>
            <Footer />
        </>
    );
}

export default App;
