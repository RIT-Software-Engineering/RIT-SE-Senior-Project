import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { config, USERTYPES } from "../functions/constants";
import { SecureFetch } from "../functions/secureFetch";
import { Button, Container } from "semantic-ui-react";
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
    <Container textAlign="center">
      <h3>Sign in as</h3>
      <select className="ui dropdown labeled" ref={selectedUserIdx}>
        {adminUsers.length > 0 && (
          <optgroup label="Admins">
            {adminUsers.map((user, idx) => (
              <option
                value={users.findIndex((u) => u.system_id === user.system_id)}
                key={`admin-${user.system_id}`}
              >{`${user.fname} ${user.lname} (${user.system_id})`}</option>
            ))}
          </optgroup>
        )}
        {coachUsers.length > 0 && (
          <optgroup label="Coaches">
            {coachUsers.map((user, idx) => (
              <option
                value={users.findIndex((u) => u.system_id === user.system_id)}
                key={`coach-${user.system_id}`}
              >{`${user.fname} ${user.lname} (${user.system_id})`}</option>
            ))}
          </optgroup>
        )}
        {studentUsers.length > 0 && (
          <optgroup label="Students">
            {studentUsers.map((user, idx) => (
              <option
                value={users.findIndex((u) => u.system_id === user.system_id)}
                key={`student-${user.system_id}`}
              >{`${user.fname} ${user.lname} (${user.system_id})`}</option>
            ))}
          </optgroup>
        )}
      </select>
      <br />
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
        Sign Out
      </Button>
      <Button
        color="red"
        onClick={async () => {
          setLoading(true);

          // Delete all cookies
          document.cookie.split(";").forEach((cookie) => {
            document.cookie = cookie + ";max-age=0";
          });

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
              alert(`Error: ${data.message || "Failed to reset database"}`);
            }
          } catch (error) {
            console.error("Request failed", error);
            alert("Failed to connect to the server. Please try again.");
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Database"}
      </Button>
    </Container>
  );
}
