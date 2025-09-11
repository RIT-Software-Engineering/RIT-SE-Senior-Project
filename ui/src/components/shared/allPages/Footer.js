import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../util/functions/UserContext";
import uiConfig from "../../../config/uiConfig";
import "./../../../css/containers/footer.css";

function Footer() {
  const { user } = useContext(UserContext);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    // A user is considered signed in if the user object has a value
    setSignedIn(Object.keys(user).length !== 0);
  }, [user]);

  const footerConfig = signedIn
    ? uiConfig.footers.loggedIn
    : uiConfig.footers.loggedOut;

  if (signedIn) {
    return (
      <div id="footer">
        <div id="bringMeDown" className="ui container stackable grid">
          <div className="two column row">
            <div className="column">
              <h5 id="copyright">
                <i className="ui icon copyright"></i> {footerConfig.copyright}
              </h5>
            </div>
            <div id="version" className="column">
              <h5>
                <a
                  href={footerConfig.githubLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  v{footerConfig.version}
                </a>
              </h5>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div id="footer">
        <div id="bringMeDownSignedIn" className="ui container stackable grid">
          <div className="three column row">
            <div className="column">
              <img
                src={uiConfig.logoPath}
                alt="Logo"
                style={{
                  maxWidth: "200px",
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
            <div className="column">
              <h4>
                {footerConfig.address.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </h4>
            </div>
            <div className="column">
              <h4>
                <i className="ui mail icon"></i> {footerConfig.email}
              </h4>
            </div>
          </div>
          <div
            className="centered row"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <h5>
              <i className="ui icon copyright"></i> {footerConfig.copyright}
            </h5>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
