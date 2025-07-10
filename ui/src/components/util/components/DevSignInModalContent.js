import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { config, USERTYPES } from "../functions/constants";
import { SecureFetch } from "../functions/secureFetch";
import { Button, Container, Icon } from "semantic-ui-react";
import _ from "lodash";

/**
 * NOTE: THIS SHOULD ONLY BE USED FOR DEVELOPMENT PURPOSES ONLY
 */
export default function DevSignInModalContent() {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [coachUsers, setCoachUsers] = useState([]);
  const [studentUsers, setStudentUsers] = useState([]);
  const selectedUserIdx = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (process.env.REACT_APP_NODE_ENV === "development") {
      SecureFetch(config.url.DEV_ONLY_API_GET_ALL_USERS)
        .then((response) => response.json())
        .then((users) => {
          setUsers(users);

          // Group users by type and sort alphabetically within each group
          const admins = _.sortBy(
            users.filter((user) => user.type === USERTYPES.ADMIN),
            ["fname", "lname"],
          );
          const coaches = _.sortBy(
            users.filter((user) => user.type === USERTYPES.COACH),
            ["fname", "lname"],
          );
          const students = _.sortBy(
            users.filter((user) => user.type === USERTYPES.STUDENT),
            ["fname", "lname"],
          );

          setAdminUsers(admins);
          setCoachUsers(coaches);
          setStudentUsers(students);
        });
    }
  }, []);

  return (
    <Container textAlign="center" style={{ maxWidth: 600 }}>
      <div className="ui container stackable grid">
        <div className="two column row">
          <div className="column">
            {/* Left Section: Sign In */}
            <div
              style={{
                background: "rgba(0,0,0,0.1)",
                borderRadius: 8,
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
                padding: 32,
                justifyContent: "center",
                minHeight: 250,
              }}
            >
              <h2 style={{ marginBottom: 24 }}>Sign In As</h2>
              <select
                className="ui dropdown labeled"
                ref={selectedUserIdx}
                style={{
                  marginBottom: 24,
                  padding: 8,
                  fontSize: 16,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  width: 250,
                }}
              >
                {adminUsers.length > 0 && (
                  <optgroup label="Admins">
                    {adminUsers.map((user) => (
                      <option
                        value={users.findIndex(
                          (u) => u.system_id === user.system_id,
                        )}
                        key={`admin-${user.system_id}`}
                      >{`${user.fname} ${user.lname} (${user.system_id})`}</option>
                    ))}
                  </optgroup>
                )}
                {coachUsers.length > 0 && (
                  <optgroup label="Coaches">
                    {coachUsers.map((user) => (
                      <option
                        value={users.findIndex(
                          (u) => u.system_id === user.system_id,
                        )}
                        key={`coach-${user.system_id}`}
                      >{`${user.fname} ${user.lname} (${user.system_id})`}</option>
                    ))}
                  </optgroup>
                )}
                {studentUsers.length > 0 && (
                  <optgroup label="Students">
                    {studentUsers.map((user) => (
                      <option
                        value={users.findIndex(
                          (u) => u.system_id === user.system_id,
                        )}
                        key={`student-${user.system_id}`}
                      >{`${user.fname} ${user.lname} (${user.system_id})`}</option>
                    ))}
                  </optgroup>
                )}
              </select>
              <div>
                <Button
                  color="orange"
                  onClick={() => {
                    const user = users[selectedUserIdx.current.value];

                    document.cookie = `system_id=${user.system_id}`;
                    document.cookie = `fname=${user.fname}`;
                    document.cookie = `lname=${user.lname}`;
                    document.cookie = `email=${user.email}`;
                    document.cookie = `type=${user.type}`;
                    document.cookie = `semester_group=${user.semester_group}`;
                    document.cookie = `project=${user.project}`;
                    document.cookie = `active=${user.active}`;
                    document.cookie = `view_only=${user.view_only}`;
                    //TODO: MAKE ADJUSTMENTS FOR PRODUCTION, BUT DO NOT REMOVE THIS. UPDATES LOGIN TIMES.
                    SecureFetch(config.url.DEV_ONLY_API_POST_EDIT_LAST_LOGIN, {
                      method: "post",
                    })
                      .then(() => {
                        // Simulate redirect from Shibboleth
                        history.push("/dashboard");
                        window.location.reload();
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  }}
                >
                  {" "}
                  <Icon name="sign-in" />
                  Sign In
                </Button>
                <Button
                  secondary
                  onClick={() => {
                    // Delete all cookies
                    let cookies = document.cookie.split(";");
                    cookies.forEach(
                      (cookie) => (document.cookie = cookie + ";max-age=0"),
                    );
                    // Simulate redirect from Shibboleth
                    history.push("/");
                    window.location.reload();
                  }}
                >
                  {" "}
                  <Icon name="sign-out" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          <div className="column">
            <div
              style={{
                border: "2px solid #e53935",
                borderRadius: 8,
                background: "rgba(220, 50, 50, 0.15)",
                padding: 32,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 250,
              }}
            >
              <div
                style={{
                  color: "#e53935",
                  fontWeight: "bold",
                  fontSize: 18,
                  marginBottom: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                DANGER
              </div>
              <div style={{ marginBottom: 12 }}>
                This will reset the entire database and delete all cookies.
                Please proceed with caution.
              </div>

              <Button
                color="red"
                onClick={async () => {
                  setLoading(true);

                  // Clear all browser storage
                  try {
                    // Delete all cookies
                    document.cookie.split(";").forEach((cookie) => {
                      const eqPos = cookie.indexOf("=");
                      const name =
                        eqPos > -1
                          ? cookie.substr(0, eqPos).trim()
                          : cookie.trim();
                      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
                      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                    });

                    // Clear session storage
                    sessionStorage.clear();

                    // Clear local storage
                    localStorage.clear();

                    console.log("Browser storage cleared");
                  } catch (storageError) {
                    console.warn(
                      "Failed to clear some browser storage:",
                      storageError,
                    );
                  }

                  try {
                    const response = await SecureFetch(
                      config.url.DEV_ONLY_REDEPLOY_DATABASE,
                      {
                        method: "PUT",
                      },
                    );

                    if (response.ok) {
                      // Successful database reset
                      console.log("Database reset successful");
                      history.push("/");
                      setTimeout(() => {
                        window.location.reload();
                      }, 500);
                    } else {
                      // Handle failure
                      const data = await response.json();
                      alert(
                        `Error: ${data.message || "Failed to reset database"}`,
                      );
                    }
                  } catch (error) {
                    console.error("Request failed", error);
                    alert("Failed to connect to the server. Please try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                style={{ marginTop: 12, width: "100%" }}
                size="large"
              >
                {loading ? (
                  <div
                    className="loading-bar"
                    style={{ margin: "-10px -20px", padding: "10px 20px" }}
                  >
                    <Icon name="database" />
                    Resetting...
                  </div>
                ) : (
                  <>
                    <Icon name="database" /> Reset Database
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
