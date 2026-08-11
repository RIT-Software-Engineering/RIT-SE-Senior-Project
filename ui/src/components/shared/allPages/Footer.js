import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../util/functions/UserContext";
import { config, USERTYPES } from "../../util/functions/constants";
import { SecureFetch } from "../../util/functions/secureFetch";
import InnerHTML from "dangerously-set-html-content";
import "./../../../css/containers/footer.css";
import "semantic-ui-css/semantic.min.css";
import uiConfig from "../../../config/uiConfig";
import collegeLogo from "../../../Assets/gccis_logo.jpg";

function Footer() {
  const { user, isAuditTabActive } = useContext(UserContext);
  const [footerHtml, setFooterHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const signedIn = user && Object.keys(user).length > 0 && user.user;
  const isAdminOrViewOnlyAdmin = signedIn && user.role === USERTYPES.ADMIN;
  const showErrorLogsLink = isAdminOrViewOnlyAdmin && isAuditTabActive;
  useEffect(() => {
    const footerName = signedIn ? "loggedInFooter" : "loggedOutFooter";

    setIsLoading(true);
    SecureFetch(`${config.url.API_GET_HTML}?name=${footerName}`)
      .then((r) => {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.json();
      })
      .then((data) => {
        const html = data?.[0]?.html || "";
        setFooterHtml(html);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching footer:", error);
        setFooterHtml("");
        setIsLoading(false);
      });
  }, [user]);
  if (isLoading) {
    return (
      <div id="footer">
        <div id="bringMeDownSignedIn" className="ui container stackable grid">
          <div className="three column row">
            <div className="column">
              <img
                src={collegeLogo}
                alt="Golisano College of Computing & Information Sciences"
                className="footer-college-logo"
              />
            </div>
            <div className="column">
              <h4>
                Department of Software Engineering
                <br />
                Golisano Building 70, Room 1690
                <br />
                134 Lomb Memorial Drive
                <br />
                Rochester, NY 14623-5608
              </h4>
            </div>
            <div className="column">
              <h4>
                <i className="ui mail icon"></i> seniorprojects@se.rit.edu
              </h4>
            </div>
          </div>
          <div className="centered row footer-signed-out-copyright">
            <h5>
              <i className="ui icon copyright"></i> Rochester Institute of
              Technology, All Rights Reserved
            </h5>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="footer">
      {footerHtml ? <InnerHTML html={footerHtml} /> : null}
      {signedIn && (
        <div
          id="version"
          className="ui container"
          style={{ textAlign: "right" }}
        >
          <h5>
            {showErrorLogsLink ? (
              <Link to="/error-logs">Error Logs</Link>
            ) : (
              <a
                href={uiConfig.footers.loggedIn.githubLink}
                target="_blank"
                rel="noreferrer"
              >
                v{uiConfig.footers.loggedIn.version}
              </a>
            )}
          </h5>
        </div>
      )}
    </div>
  );
}

export default Footer;
