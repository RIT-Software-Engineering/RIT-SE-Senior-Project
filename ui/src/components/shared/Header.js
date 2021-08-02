import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal, Sidebar, Menu, Icon } from "semantic-ui-react";
import TempSignInModalContent from "./TempSignInModalContent";
import "../../css/header.css";
import { config } from "../util/constants";


function Header() {
    const history = useHistory();
    const [visible, setVisible] = useState(false);

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
                            window.location.replace(config.url.API_LOGIN);
                        }}
                    >
                        SAML Sign In
                    </button>
                    <Modal
                        trigger={<Button>Sign in/Sign Out</Button>}
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
                                window.location.replace(config.url.API_LOGIN);
                            }}
                        >
                            SAML Sign In
                        </button>
                    </Menu.Item>
                    <Menu.Item as="a">
                        <Modal
                            trigger={<div>Sign in/Sign Out</div>}
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
