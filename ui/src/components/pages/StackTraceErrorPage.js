import React, { useState } from "react";
import { Button } from "semantic-ui-react";

const StackTraceErrorPage = () => {
  // Retrieve error details from sessionStorage.
  const errorDetails = sessionStorage.getItem("errorDetails");
  let errorInfo = null;
  try {
    errorInfo = errorDetails ? JSON.parse(errorDetails) : null;
  } catch (err) {
    console.error("Failed to parse error details:", err);
  }

  const [userFeedback, setUserFeedback] = useState("");

  const handleTryAgain = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleCopyStackTrace = async () => {
    if (errorInfo && errorInfo.componentStack) {
      try {
        await navigator.clipboard.writeText(errorInfo.componentStack);
        setUserFeedback("✅ Stack trace copied to clipboard!");
        setTimeout(() => setUserFeedback(""), 3000);
      } catch (err) {
        console.error("Failed to copy stack trace:", err);
        setUserFeedback("❌ Failed to copy stack trace.");
        setTimeout(() => setUserFeedback(""), 3000);
      }
    }
  };

  const handleReportOnGitHub = () => {
    try {
      const version = "v1.7.3";
      const timestamp = errorInfo?.timestamp || "No timestamp saved";
      const error = errorInfo?.error || "Unknown error";
      const statusCode = errorInfo?.statusCode
        ? `\n### Status Code\n${errorInfo.statusCode}\n`
        : "";
      const userRole = errorInfo?.user_role
        ? `\n### User Role\n${errorInfo.user_role}\n`
        : "";
      const url = errorInfo?.url ? `\n### URL\n${errorInfo.url}\n` : "";
      const componentStack = errorInfo?.componentStack
        ? `\n### Stack Trace\n\`\`\`\n${errorInfo.componentStack}\n\`\`\`\n`
        : "No stack trace available.\n\n";

      const title = encodeURIComponent(`Bug Report: ${error}`);
      const body = encodeURIComponent(
        `### Version\n${version}\n\n` +
          `### Timestamp\n${timestamp}\n\n` +
          statusCode +
          userRole +
          url +
          componentStack +
          "### Additional Info: \n",
      );

      const githubUrl = `https://github.com/RIT-Software-Engineering/RIT-SE-Senior-Project/issues/new?title=${title}&body=${body}`;
      window.open(githubUrl, "_blank");
      setUserFeedback("✅ Thank You!");
    } catch (err) {
      console.error("Failed to redirect:", err);
      setUserFeedback("❌ Failed to redirect.");
      setTimeout(() => setUserFeedback(""), 3000);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "var(--action-bar-proposal-red)" }}>⚠️ An Error Occurred</h1>
      {errorInfo ? (
        <div
          style={{
            background: "var(--bg-secondary)",
            padding: "15px",
            borderRadius: "8px",
            textAlign: "left",
          }}
        >
          <h2 style={{ color: "var(--action-bar-proposal-red)" }}>Error: {errorInfo.error}</h2>
          <details style={{ marginTop: "10px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold", color: "var(--text-primary)" }}>
              View Stack Trace
            </summary>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "var(--bg-secondary)",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {errorInfo.componentStack}
            </pre>
          </details>
        </div>
      ) : (
        <p>No error details available.</p>
      )}

      <div style={{ marginTop: "20px" }}>
        <p style={{ fontSize: "14px", color: "var(--action-bar-proposal-red)" }}>
          ⚠️ A GitHub account is required to report an issue.
        </p>
        <Button onClick={handleGoBack}>🔙 Go Back</Button>
        <Button onClick={handleCopyStackTrace}>📋 Copy Stack Trace</Button>
        <Button onClick={handleReportOnGitHub}>🐞 Report on GitHub</Button>
      </div>

      {userFeedback && (
        <p style={{ marginTop: "10px", color: "var(--action-bar-proposal-green)" }}>{userFeedback}</p>
      )}
    </div>
  );
};

export default StackTraceErrorPage;
