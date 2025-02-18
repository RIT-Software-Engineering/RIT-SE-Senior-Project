import React, { useState } from "react";

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
    try{
        const title = encodeURIComponent(
        `Bug Report: ${errorInfo ? errorInfo.error : "Unknown error"}`
        );
        const body = encodeURIComponent(
        `**Error Details:**\n\n${errorInfo ? errorInfo.componentStack : "No stack trace available."}`
        );
        const url = `https://github.com/RIT-Software-Engineering/RIT-SE-Senior-Project/issues/new?title=${title}&body=${body}`;
        window.open(url, "_blank");
        setUserFeedback("✅ Thank You!");
    } catch(err) {
        console.error("Failed to redirect:", err);
        setUserFeedback("❌ Failed to redirect.");
        setTimeout(() => setUserFeedback(""), 3000);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#D32F2F" }}>⚠️ An Error Occurred</h1>
      {errorInfo ? (
        <div style={{ background: "#FFEBEE", padding: "15px", borderRadius: "8px", textAlign: "left" }}>
          <h2 style={{ color: "#B71C1C" }}>Error: {errorInfo.error}</h2>
          <details style={{ marginTop: "10px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>View Stack Trace</summary>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", background: "#FFF", padding: "10px", borderRadius: "5px" }}>
              {errorInfo.componentStack}
            </pre>
          </details>
        </div>
      ) : (
        <p>No error details available.</p>
      )}
      
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleGoBack} style={buttonStyle}>🔙 Go Back</button>
        <button onClick={handleCopyStackTrace} style={buttonStyle}>📋 Copy Stack Trace</button>
        <button onClick={handleReportOnGitHub} style={buttonStyle}>🐞 Report on GitHub</button>
      </div>

      {userFeedback && <p style={{ marginTop: "10px", color: "#388E3C" }}>{userFeedback}</p>}
    </div>
  );
};

const buttonStyle = {
  margin: "5px",
  padding: "10px 15px",
  background: "#1976D2",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px"
};

export default StackTraceErrorPage;
