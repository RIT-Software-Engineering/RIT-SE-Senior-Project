import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { config, USERTYPES } from "../functions/constants";
import { SecureFetch } from "../functions/secureFetch";
import {
  Button,
  Container,
  Icon,
  Input,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  DropdownHeader,
} from "semantic-ui-react";
import "./../../../css/utils/helpers.css"
import _ from "lodash";

/**
 * NOTE: THIS SHOULD ONLY BE USED FOR DEVELOPMENT PURPOSES ONLY
 */
export default function DevSignInModalContent() {
  const history = useHistory();
  const [adminUsers, setAdminUsers] = useState([]);
  const [coachUsers, setCoachUsers] = useState([]);
  const [studentUsers, setStudentUsers] = useState([]);
  const [searchAdminUsers, setSearchAdminUsers] = useState([]);
  const [searchCoachUsers, setSearchCoachUsers] = useState([]);
  const [searchStudentUsers, setSearchStudentUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const dropdownRef = useRef(null);

  // Helper function to get user status text
  const getUserStatusText = (user) => {
    const isDeactivated = user.active && user.active !== "";
    const isViewOnly = user.view_only === "TRUE";

    if (isDeactivated && isViewOnly) {
      return "(Deactivated, View Only)";
    } else if (isDeactivated) {
      return "(Deactivated)";
    } else if (isViewOnly) {
      return "(View Only)";
    }
    return "";
  };

  // Calculate dynamic dropdown height based on screen size
  const getDropdownMaxHeight = () => {
    // Base height that adapts to screen size
    const baseHeight = Math.min(windowHeight * 0.6, 500); // 60% of screen height, max 500px
    const minHeight = 350; // Minimum height for usability
    return Math.max(baseHeight, minHeight);
  };

  useEffect(() => {
    if (process.env.REACT_APP_NODE_ENV === "development") {
      SecureFetch(config.url.DEV_ONLY_API_GET_ALL_USERS)
        .then((response) => response.json())
        .then((users) => {
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
          setSearchAdminUsers(admins);
          setSearchCoachUsers(coaches);
          setSearchStudentUsers(students);
        });
    }

    // Handle window resize for dynamic dropdown height
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    // Handle click outside to close dropdown
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSearch = (searchVal) => {
    if (searchVal === "") {
      setSearchAdminUsers(adminUsers);
      setSearchCoachUsers(coachUsers);
      setSearchStudentUsers(studentUsers);
      return;
    }

    const filterUsers = (usersList) => {
      return usersList.filter((user) => {
        return (
          user.fname.toLowerCase().includes(searchVal.toLowerCase()) ||
          user.lname.toLowerCase().includes(searchVal.toLowerCase()) ||
          user.system_id.toLowerCase().includes(searchVal.toLowerCase())
        );
      });
    };

    setSearchAdminUsers(filterUsers(adminUsers));
    setSearchCoachUsers(filterUsers(coachUsers));
    setSearchStudentUsers(filterUsers(studentUsers));
  };

  const handleDropdownOpen = () => {
    setIsDropdownOpen(!isDropdownOpen);
    handleSearch("");
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsDropdownOpen(false);
  };

  const signInAsUser = () => {
    if (!selectedUser) {
      alert("Please select a user to sign in as");
      return;
    }

    document.cookie = `system_id=${selectedUser.system_id}`;
    document.cookie = `fname=${selectedUser.fname}`;
    document.cookie = `lname=${selectedUser.lname}`;
    document.cookie = `email=${selectedUser.email}`;
    document.cookie = `type=${selectedUser.type}`;
    document.cookie = `semester_group=${selectedUser.semester_group}`;
    document.cookie = `project=${selectedUser.project}`;
    document.cookie = `active=${selectedUser.active}`;
    document.cookie = `view_only=${selectedUser.view_only}`;

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
  };

  // Check if dark mode is active
  const isDarkMode = document.body.classList.contains("dark-mode");

  return (
    <Container textAlign="center" style={{ maxWidth: 600 }}>
      <div className="ui container stackable grid">
        <div className="two column row">
          <div className="column">
            {/* Left Section: Sign In */}
            <div
              style={{
                background: isDarkMode
                  ? "var(--bg-secondary)"
                  : "rgba(0,0,0,0.1)",
                borderRadius: 8,
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
                padding: 32,
                justifyContent: "center",
                minHeight: 250,
                border: isDarkMode ? "1px solid var(--border-color)" : "none",
              }}
            >
              <h2
                style={{
                  marginBottom: 24,
                  color: isDarkMode ? "var(--text-primary)" : "inherit",
                }}
              >
                Sign In As
              </h2>
              <div ref={dropdownRef} style={{ marginBottom: 24 }}>
                <Dropdown
                  onClick={handleDropdownOpen}
                  className="ui button"
                  search
                  text={
                    selectedUser
                      ? `${selectedUser.fname} ${selectedUser.lname} (${selectedUser.system_id})`
                      : "Select User..."
                  }
                  open={isDropdownOpen}
                  fluid
                  style={{
                    fontSize: 16,
                  }}
                >
                  {isDropdownOpen ? (
                    <DropdownMenu>
                      <Input
                        icon="search"
                        iconPosition="left"
                        placeholder="Search User..."
                        input={{ onClick: (e) => e.stopPropagation() }}
                        onChange={(e) => {
                          handleSearch(e.target.value);
                        }}
                        autoFocus
                      />
                      {searchAdminUsers.length > 0 && (
                        <>
                          <DropdownDivider />
                          <DropdownHeader content="Admins" />
                          {searchAdminUsers.map((user) => {
                            const statusText = getUserStatusText(user);
                            return (
                              <DropdownItem
                                key={`admin-${user.system_id}`}
                                value={user.system_id}
                                onClick={(e, target) => handleSelectUser(user)}
                              >
                                <div>
                                  <div>{`${user.fname} ${user.lname} (${user.system_id})`}</div>
                                  {statusText && (
                                    <div
                                      style={{
                                        fontSize: "0.9em",
                                        color: "#999",
                                        marginTop: "2px",
                                      }}
                                    >
                                      {statusText}
                                    </div>
                                  )}
                                </div>
                              </DropdownItem>
                            );
                          })}
                        </>
                      )}
                      {searchCoachUsers.length > 0 && (
                        <>
                          <DropdownDivider />
                          <DropdownHeader content="Coaches" />
                          {searchCoachUsers.map((user) => {
                            const statusText = getUserStatusText(user);
                            return (
                              <DropdownItem
                                key={`coach-${user.system_id}`}
                                value={user.system_id}
                                onClick={(e, target) => handleSelectUser(user)}
                              >
                                <div>
                                  <div>{`${user.fname} ${user.lname} (${user.system_id})`}</div>
                                  {statusText && (
                                    <div
                                      style={{
                                        fontSize: "0.9em",
                                        color: "#999",
                                        marginTop: "2px",
                                      }}
                                    >
                                      {statusText}
                                    </div>
                                  )}
                                </div>
                              </DropdownItem>
                            );
                          })}
                        </>
                      )}
                      {searchStudentUsers.length > 0 && (
                        <>
                          <DropdownDivider />
                          <DropdownHeader content="Students" />
                          {searchStudentUsers.map((user) => {
                            const statusText = getUserStatusText(user);
                            return (
                              <DropdownItem
                                key={`student-${user.system_id}`}
                                value={user.system_id}
                                onClick={(e, target) => handleSelectUser(user)}
                              >
                                <div>
                                  <div>{`${user.fname} ${user.lname} (${user.system_id})`}</div>
                                  {statusText && (
                                    <div
                                      style={{
                                        fontSize: "0.9em",
                                        color: "#999",
                                        marginTop: "2px",
                                      }}
                                    >
                                      {statusText}
                                    </div>
                                  )}
                                </div>
                              </DropdownItem>
                            );
                          })}
                        </>
                      )}
                    </DropdownMenu>
                  ) : null}
                </Dropdown>
              </div>
              <div>
                <Button
                  color="orange"
                  className="offset-outline"
                  onClick={signInAsUser}
                >
                  {" "}
                  <Icon name="sign-in" />
                  Sign In
                </Button>
                <Button
                  secondary
                  className="offset-outline"
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
              <div
                style={{
                  marginBottom: 12,
                  color: isDarkMode ? "var(--text-primary)" : "inherit",
                }}
              >
                This will reset the entire database and delete all cookies.
                Please proceed with caution.
              </div>

              <Button
                color="red"
                className="offset-outline"
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
                style={{ marginTop: 12, width: "100%", }}
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
