import React, { useContext, useEffect, useState } from "react";
import { Container, Button, Icon, Loader } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../util/functions/UserContext";
import { SecureFetch } from "../util/functions/secureFetch";
import { config, USERTYPES } from "../util/functions/constants";
import AuditLogs from "../Tabs/AuditLogsTab/AuditLogs";
import "./../../css/components/pages/AuditLogsPage.css";

function AuditLogsPage() {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  const [isLoadingUser, setIsLoadingUser] = useState(!user?.role);

  useEffect(() => {
    if (user?.role) {
      setIsLoadingUser(false);
      return;
    }

    SecureFetch(config.url.API_WHO_AM_I)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            history.push("/auth-error");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseUser) => {
        if (!responseUser) return;

        let parsedProfileInfo;
        try {
          parsedProfileInfo = responseUser.profile_info
            ? JSON.parse(responseUser.profile_info.toString())
            : { additional_info: "", dark_mode: false, gantt_view: true };
        } catch (error) {
          console.error("Error parsing profile_info:", error);
          parsedProfileInfo = {
            additional_info: "",
            dark_mode: false,
            gantt_view: true,
          };
        }
        setUser({
          user: responseUser.system_id,
          role: responseUser.type,
          fname: responseUser.fname,
          lname: responseUser.lname,
          semester_group: responseUser.semester_group,
          project: responseUser.project,
          isMock: Object.keys(responseUser.mock).length !== 0,
          mockUser: responseUser.mock,
          last_login: responseUser.last_login,
          prev_login: responseUser.prev_login,
          view_only: responseUser.view_only === "TRUE" ? true : false,
          profile_info: parsedProfileInfo,
        });
        if (responseUser.system_id) {
          const darkPref = ["1", "true"].includes(
            parsedProfileInfo.dark_mode.toString().trim().toLowerCase(),
          );
          document.body.classList.toggle("dark-mode", darkPref);
        }
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        history.push("/auth-error");
      })
      .finally(() => setIsLoadingUser(false));
  }, []);

  const isAdmin =
    user?.role === USERTYPES.ADMIN &&
    !user?.view_only &&
    !user?.mockUser?.view_only;

  useEffect(() => {
    if (!isLoadingUser && user?.role && !isAdmin) {
      history.push("/dashboard");
    }
  }, [isLoadingUser, user, isAdmin, history]);

  if (isLoadingUser) {
    return <Loader active inline="centered" style={{ marginTop: "2rem" }} />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Container>
      <Button
        basic
        className="audit-logs-back-button"
        onClick={() => history.push("/dashboard")}
        style={{ marginTop: "1rem" }}
      >
        <Icon name="arrow left" />
        Back to Dashboard
      </Button>
      <AuditLogs />
    </Container>
  );
}

export default AuditLogsPage;
