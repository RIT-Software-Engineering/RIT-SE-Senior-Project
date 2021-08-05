import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal, Sidebar, Menu, Icon } from "semantic-ui-react";
import TempSignInModalContent from "./TempSignInModalContent";
import "../../css/header.css";
import { config } from "../util/constants";
import { UserContext } from "../util/UserContext";


function Header() {
    const history = useHistory();
    const [visible, setVisible] = useState(false);
    const { user } = useContext(UserContext);

    const signInOutButtonText = Object.keys(user).length === 0 ? "RIT Login" : `Sign out, ${user.fname}`;

    const renderNavButtons = () => {
        return (
            <>
                <div id="nav-buttons" className="ui right floated buttons">
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
                            history.push("/dashboard");
                        }}
                    >
                        Dashboard
                    </button>
                    <button
                        className="ui button"
                        onClick={() => {
                            history.push("/sponsor");
                        }}
                    >
                        Sponsor a Project
                    </button>
                    <button
                        className="ui button"
                        onClick={() => {
                            window.location.href = config.url.API_LOGIN;
                        }}
                    >
                        {signInOutButtonText}
                    </button>
                    <Modal
                        trigger={<Button>Dev Sign in/Sign Out</Button>}
                        header="Sign in/Sign Out"
                        content={{
                            content: <TempSignInModalContent />
                        }}
                        actions={["Nevermind..."]}
                    />
                </div>
                <div id="hamburger-menu">
                    <Button icon onClick={() => setVisible(true)}><Icon name="bars" /></Button>
                </div>
                <Sidebar
                    as={Menu}
                    animation="overlay"
                    direction="right"
                    visible={visible}
                    onHide={() => setVisible(false)}
                    vertical
                    inverted
                >
                    <Menu.Item
                        as="a"
                        onClick={() => {
                            history.push("/");
                        }}
                    >
                        Home
                    </Menu.Item>
                    <Menu.Item
                        as="a"
                        onClick={() => {
                            history.push("/dashboard");
                        }}
                    >
                        Dashboard
                    </Menu.Item>
                    <Menu.Item
                        as="a"
                        onClick={() => {
                            history.push("/sponsor");
                        }}
                    >
                        Sponsor a Project
                    </Menu.Item>
                    <Menu.Item as="a">
                        <button
                            className="ui button"
                            onClick={() => {
                                window.location.href = config.url.API_LOGIN;
                            }}
                        >
                            {signInOutButtonText}
                        </button>
                    </Menu.Item>
                    <Menu.Item as="a">
                        <Modal
                            trigger={<div>Dev Sign in/Sign Out</div>}
                            header="Sign in/Sign Out"
                            content={{
                                content: <TempSignInModalContent />
                            }}
                            actions={["Nevermind..."]}
                        />
                    </Menu.Item>
                </Sidebar>
            </>
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
