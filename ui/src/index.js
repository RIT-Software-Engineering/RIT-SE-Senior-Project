import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

sessionStorage.setItem("random", String(Math.floor(Math.random() * 24) + 1));
console.log(sessionStorage.getItem("random"))
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(Logger.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
