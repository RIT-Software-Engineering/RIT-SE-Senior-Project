import React from "react";
import { Route, Redirect } from "react-router-dom";
import { config } from "../util/constants";

export default function PrivateRoute({ signedIn, component, path, ...rest }) {
    console.log("signedIn", signedIn);
    signedIn.authenticated = true;
    return signedIn?.authenticated ? (
        <Route path={path} component={component} {...rest} />
    ) : (
        <Redirect to={config.url.API_LOGIN} />
    );
}
