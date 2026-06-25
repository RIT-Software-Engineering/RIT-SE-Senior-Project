import React from "react";
import { Button, Icon, Message, Container } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import "./../../css/components/pages/AuthError.css";

function AuthErrorPage() {
  const history = useHistory();

  const handleGoHome = () => {
    // Clear any existing authentication data
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Navigate to home page
    history.push("/");
  };

  return (
    <Container className="autherror-container">
      <div className="autherror-content">
        <Icon
          name="user times"
          size="huge"
          className="autherror-icon"
        />

        <Message
          error
          className="autherror-message"
        >
          <Message.Header className="autherror-message-header">
            Account Access Denied
          </Message.Header>
          <p className="autherror-message-p">
            Sorry, this user does not have an active account or has been
            deactivated.
          </p>
          <p>
            If you believe this is an error, please contact your academic
            advisor.
          </p>
        </Message>

        <div className="autherror-div">
          <Button
            primary
            size="large"
            onClick={handleGoHome}
            className="autherror-button"
          >
            <Icon name="home" />
            Go to Home Page
          </Button>
        </div>

        <div style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#666" }}>
          <p>
            <strong>Common reasons for access denial:</strong>
          </p>
          <ul style={{ textAlign: "left", display: "inline-block" }}>
            <li>Your account has been deactivated by an administrator</li>
            <li>You are not registered in the system</li>
            <li>There was a problem with a third party authenticator</li>
            <li>You are not cool enough</li>
          </ul>
        </div>
      </div>
    </Container>
  );
}

export default AuthErrorPage;
