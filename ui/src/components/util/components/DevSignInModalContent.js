import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../functions/constants";
import { SecureFetch } from "../functions/secureFetch";
import { Button, Container } from "semantic-ui-react";

/**
 * NOTE: THIS SHOULD ONLY BE USED FOR DEVELOPMENT PURPOSES ONLY
 */
export default function DevSignInModalContent() {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const selectedUserIdx = useRef(null);

  useEffect(() => {
    if (process.env.REACT_APP_NODE_ENV === "development") {
      SecureFetch(config.url.DEV_ONLY_API_GET_ALL_USERS)
        .then((response) => response.json())
        .then((users) => {
          setUsers(users);
        });
    }
  }, []);

  return (
    <Container textAlign="center">
      <h3>Sign in as</h3>
      <select className="ui dropdown labeled" ref={selectedUserIdx}>
        {users.map((user, idx) => (
          <option
            value={idx}
            key={idx}
          >{`${user.fname} ${user.lname} (${user.system_id})`}</option>
        ))}
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
          document.cookie = `view_only=${user.view_only}`
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
      </Button>{" "}
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
    </Container>
  );
}
