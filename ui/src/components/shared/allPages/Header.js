import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal, Sidebar, Menu, Icon } from "semantic-ui-react";
import DevSignInModalContent from "../../util/components/DevSignInModalContent";
import "../../../css/header.css";
import { config } from "../../util/functions/constants";
import { UserContext } from "../../util/functions/UserContext";
import { SecureFetch } from "../../util/functions/secureFetch";

function Header() {
    const history = useHistory();
    const [visible, setVisible] = useState(false);
    const { user } = useContext(UserContext);
    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        // A user is considered signed in if the user object has a value
        // This is set when the /whoami endpoint gets hit (currently happening in the Dashboard.js).
        setSignedIn(Object.keys(user).length !== 0);
    }, [user]);

    const signInOutBtnText = signedIn ? `Sign out, ${user.fname}` : "RIT Login";
    const signInOut = () => {
        if (signedIn) {
            SecureFetch(config.url.API_LOGOUT)
                .then(response => {
                    if (response.ok) {
                        window.location.href = config.url.LOGOUT_SUCCESS;
                    } else {
                        alert("Unknown error: Logout failed");
                    }
                }).catch(err => {
                    alert("An error occurred");
                    console.error(err);
                })
        } else {
            window.location.href = config.url.API_LOGIN;
        }
    }

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
                    {signedIn && <button
                        className="ui button"
                        onClick={() => {
                            history.push("/dashboard");
                        }}
                    >
                        Dashboard
                    </button>}
                    <button
                        className="ui button"
                        onClick={() => {
                            history.push("/sponsor");
                        }}
                    >
                        Sponsor a Project
                    </button>
                    {process.env.REACT_APP_NODE_ENV === 'production' ? <button
                        className="ui button"
                        onClick={signInOut}
                    >
                        {signInOutBtnText}
                    </button>
                        : <Modal
                            trigger={<Button>Dev Sign in/Sign Out</Button>}
                            header="Sign in/Sign Out"
                            content={{
                                content: <DevSignInModalContent />
                            }}
                            actions={["Nevermind..."]}
                        />}
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
                    {signedIn && <Menu.Item
                        as="a"
                        onClick={() => {
                            history.push("/dashboard");
                        }}
                    >
                        Dashboard
                    </Menu.Item>}
                    <Menu.Item
                        as="a"
                        onClick={() => {
                            history.push("/sponsor");
                        }}
                    >
                        Sponsor a Project
                    </Menu.Item>
                    {process.env.REACT_APP_NODE_ENV === 'production' ?
                        <Menu.Item
                            as="a"
                            onClick={signInOut}
                        >
                            {signInOutBtnText}
                    </Menu.Item>
                        : <Menu.Item as="a">
                            <Modal
                                trigger={<div>Dev Sign in/Sign Out</div>}
                                header="Sign in/Sign Out"
                                content={{
                                    content: <DevSignInModalContent />
                                }}
                                actions={["Nevermind..."]}
                            />
                        </Menu.Item>}
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
