import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal, Sidebar, Menu, Icon } from "semantic-ui-react";
import DevSignInModalContent from "../../util/components/DevSignInModalContent";
import "../../../css/containers/header.css";
import "../../../css/utils/responsive.css";
import { config } from "../../util/functions/constants";
import { UserContext } from "../../util/functions/UserContext";
import { SecureFetch } from "../../util/functions/secureFetch";
import ProfileModal from "./profileModal";
import ProfileCircle from "../../util/components/ProfileCircle";
import uiConfig from "../../../config/uiConfig";

function Header() {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const { user } = useContext(UserContext);
  const [darkMode, setDarkMode] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    // A user is considered signed in if the user object has a value
    // This is set when the /whoami endpoint gets hit (currently happening in the Dashboard.js).
    setSignedIn(Object.keys(user).length !== 0);
    setDarkMode(
      ["true", "1"].includes(user?.profile_info?.dark_mode.toString().trim()),
    );
  }, [user]);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const signInOutBtnText = signedIn ? `Sign Out, ${user.fname}` : "RIT Login";
  const devSignInBtnText = signedIn ? `DEV Sign Out` : "DEV Sign In";
  const signInOut = () => {
    if (signedIn) {
      SecureFetch(config.url.API_LOGOUT)
        .then((response) => {
          if (response.ok) {
            window.location.href = config.url.LOGOUT_SUCCESS;
          } else {
            alert("Unknown error: Logout failed");
          }
        })
        .catch((err) => {
          alert("An error occurred");
          console.error(err);
        });
    } else {
      window.location.href = config.url.API_LOGIN;
    }
  };

  const renderNavButtons = () => {
    return (
      <>
        <div id="nav-buttons" className="ui right floated buttons">
          {!signedIn && (
            <>
              <Button
                className="ui button"
                onClick={() => {
                  history.push("/");
                }}
              >
                Home
              </Button>
              <Button
                className="ui button"
                onClick={() => {
                  history.push("/projects");
                }}
              >
                Projects
              </Button>
              <Button
                className="ui button"
                onClick={() => {
                  history.push("/sponsor");
                }}
              >
                Sponsor a Project
              </Button>
            </>
          )}
          {process.env.REACT_APP_NODE_ENV === "production" ? (
            <Button onClick={signInOut} className="ui button">
              <Icon name="sign-in" />
              {signInOutBtnText}
            </Button>
          ) : (
            <Modal
              closeOnDimmerClick={false}
              className={"sticky"}
              trigger={
                <Button className="ui button">
                  <Icon name="sign-in" />
                  {devSignInBtnText}
                </Button>
              }
              header="Developer Menu"
              content={{
                content: <DevSignInModalContent />,
              }}
              actions={["Cancel"]}
            />
          )}
          {signedIn && (
            <Button
              className="ui button"
              onClick={() => setProfileModalOpen(true)}
            >
              <span className="header-span">
                <ProfileCircle user={user} size="tiny" />
                <span className="header-profile">
                  Profile
                </span>
              </span>
            </Button>
          )}
        </div>
        <div id="hamburger-menu" className="ui right floated buttons">
          <Button
            className="header-button"
            icon
            onClick={() => setVisible(true)}
          >
            <Icon name="bars" />
          </Button>
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
          <Menu.Item>
            <Button
              fluid
              onClick={() => {
                setVisible(false);
                history.push("/");
              }}
            >
              Home
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              fluid
              onClick={() => {
                setVisible(false);
                history.push("/projects");
              }}
            >
              Projects
            </Button>
          </Menu.Item>
          {signedIn && (
            <Menu.Item>
              <Button
                fluid
                onClick={() => {
                  setVisible(false);
                  history.push("/dashboard");
                }}
              >
                Dashboard
              </Button>
            </Menu.Item>
          )}
          <Menu.Item>
            <Button
              fluid
              onClick={() => {
                setVisible(false);
                history.push("/sponsor");
              }}
            >
              Sponsor a Project
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              fluid
              onClick={() => {
                setVisible(false);
                setProfileModalOpen(true);
              }}
            >
              Profile
            </Button>
          </Menu.Item>
          {process.env.REACT_APP_NODE_ENV === "production" ? (
            <Menu.Item>
              <Button
                fluid
                onClick={() => {
                  setVisible(false);
                  signInOut();
                }}
              >
                {signInOutBtnText}
              </Button>
            </Menu.Item>
          ) : (
            <Menu.Item>
              <Modal
                closeOnDimmerClick={false}
                className={"sticky"}
                trigger={<Button fluid>Dev Sign in/out</Button>}
                header="Sign in/Sign Out"
                content={{
                  content: <DevSignInModalContent />,
                }}
                actions={["Cancel"]}
              />
            </Menu.Item>
          )}
        </Sidebar>
      </>
    );
  };

  return (
    <div id="header">
      <div id="navbar">
        <span>{uiConfig.app.name}</span>
        {renderNavButtons()}
        <ProfileModal
          open={profileModalOpen}
          darkModeCallback={setDarkMode}
          onClose={() => setProfileModalOpen(false)}
          user={user}
        />
      </div>
      <div
        className="header-nav"
      >
        <img
          src={darkMode ? SELogoDarkMode : SELogoLightMode}
          alt="Department of Software Engineering"
          className="header-dark"
          href={"/"}
          onClick={() => {
            history.push("/");
            // Delete all cookies
            let cookies = document.cookie.split(";");
            cookies.forEach(
              (cookie) => (document.cookie = cookie + ";max-age=0"),
            );
            window.location.reload();
          }}
        />
        <span
          className="header-cookies"
          href={"/"}
          onClick={() => {
            history.push("/");
            // Delete all cookies
            let cookies = document.cookie.split(";");
            cookies.forEach(
              (cookie) => (document.cookie = cookie + ";max-age=0"),
            );
            window.location.reload();
          }}
        ></span>
      </div>
      <div className="header-divider" />
    </div>
  );
}

export default Header;
