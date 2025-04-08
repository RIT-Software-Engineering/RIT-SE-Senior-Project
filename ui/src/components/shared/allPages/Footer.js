import React, { useContext, useEffect, useState } from "react";
import "../../../css/footer.css";
import { UserContext } from "../../util/functions/UserContext";
import collegeLogo from "../../../Assets/Golisano _College of_Computing_and_Information_Sciences_LOGO.jpg";
import BuggyButton from "./buggyButton";


function Footer() {
  const { user } = useContext(UserContext);
  const [signedIn, setSignedIn] = useState(false);
  // Initialize darkMode from localStorage (default: false)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "enabled"
  );

  useEffect(() => {
    // A user is considered signed in if the user object has a value
    setSignedIn(Object.keys(user).length !== 0);
  }, [user]);

  useEffect(() => {
    // On mount, update the body class based on darkMode
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
      setDarkMode(false);
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
      setDarkMode(true);
    }
  };

  if (signedIn) {
    return (
      <div id="footer">
        <div id="bringMeDown" className="ui container stackable grid">
          <div className="two column row">
            <div className="column">
              <h5 id="copyright">
                <i className="ui icon copyright"></i> Rochester Institute of
                Technology, All Rights Reserved
              </h5>
            </div>
            <div id="version" className="column">
              <h5>
                <a
                  href="https://github.com/RIT-Software-Engineering/RIT-SE-Senior-Project"
                  target="_blank"
                  rel="noreferrer"
                >
                  V.1.7.3
                </a>
              </h5>
            </div>
          </div>
          <div className="centered row">
            <button className="ui button" onClick={toggleDarkMode}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
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
                src={collegeLogo}
                alt="Golisano College of Computing & Information Sciences"
                style={{
                  maxWidth: "200px", 
                  width: "100%", 
                  height: "auto", 
                }}
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
          <div className="centered row" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <h5>
              <i className="ui icon copyright"></i> Rochester Institute of
              Technology, All Rights Reserved
            </h5>
            <button className="ui button" onClick={toggleDarkMode}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
        <BuggyButton/>
      </div>
    );
  }
}

export default Footer;
