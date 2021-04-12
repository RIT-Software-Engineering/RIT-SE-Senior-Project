import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal } from "semantic-ui-react";
import "../../css/header.css";
import TempSignInModalContent from "./TempSignInModalContent";


function Header() {
    const history = useHistory();

    const renderNavButtons = () => {
        if (history.location.pathname !== "/dashboard")
            return (
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
                    <Modal
                        trigger={<Button>Sign In</Button>}
                        header="Sign in!"
                        content={{
                            content: <TempSignInModalContent />
                        }}
                        actions={["Nevermind..."]}
                    />
                </div>
            );
    };

    return (
        <div id="header">
            <div className="ui container">
                <h1 className="ui header">
                    Senior Project
                    <div id="subHeader" className="sub header">
                        Department of Software Engineering, RIT
                    </div>
                </h1>
                {renderNavButtons()}
            </div>
        </div>
    );
}

export default Header;
