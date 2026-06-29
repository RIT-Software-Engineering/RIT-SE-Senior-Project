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
      const version = "v1.8.2";
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
      className="stack-trace-error-page"
    >
      <h1 className="stack-trace-error-color">
        ⚠️ An Error Occurred
      </h1>
      {errorInfo ? (
        <div
          className="stack-trace-error-info"
        >
          <h2 className="stack-trace-error-color">
            Error: {errorInfo.error}
          </h2>
          <details className="stack-trace-error-detail">
            <summary
              className="stack-trace-error-detail-summary"
            >
              View Stack Trace
            </summary>
            <pre
              className="stack-trace-error-detail-summary2"
            >
              {errorInfo.componentStack}
            </pre>
          </details>
        </div>
      ) : (
        <p>No error details available.</p>
      )}

      <div className="stack-trace-error-detail-div">
        <p
          className="stack-trace-error-detail-p"
        >
          ⚠️ A GitHub account is required to report an issue.
        </p>
        <Button onClick={handleGoBack}>🔙 Go Back</Button>
        <Button onClick={handleCopyStackTrace}>📋 Copy Stack Trace</Button>
        <Button onClick={handleReportOnGitHub}>🐞 Report on GitHub</Button>
      </div>

      {userFeedback && (
        <p
          className="stack-trace-error-userfeedback"
        >
          {userFeedback}
        </p>
      )}
    </div>
  );
};

export default StackTraceErrorPage;
