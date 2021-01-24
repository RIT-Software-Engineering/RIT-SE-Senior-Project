import React from "react";
import { useHistory } from "react-router-dom";

function Header() {
    const history = useHistory();

    return (
        <div className="two column row">
            <div className="column" style={{ paddingLeft: "0em" }}>
                <h1 id="mainHeader" className="ui header">
                    Senior Project
                    <div id="subHeader" className="sub header">
                        Department of Software Engineering, RIT
                    </div>
                </h1>
            </div>

            <div className="column" style={{ paddingRight: "0em" }}>
                <div id="navButtons" className="ui right floated buttons">
                    <button
                        className="ui button"
                        onClick={() => {
                            history.push("/");
                        }}
                    >
                        Home
                    </button>
                    <button
                        className="ui button"
                        onClick={() => {
                            history.push("/sponsor");
                        }}
                    >
                        Sponsor a Project
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;
