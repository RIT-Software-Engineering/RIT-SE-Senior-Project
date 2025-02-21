import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error occurred.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Capture error details
    this.setState({ errorInfo });

    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // Gather additional details
    const statusCode = 500; // Assuming a generic server error (update dynamically if possible)
    const user_role = sessionStorage.getItem("userRole") || "Unknown"; // If stored elsewhere, adjust accordingly
    const url = window.location.href; // Capture current URL
    const timestamp = new Date().toISOString(); // ISO timestamp for accuracy

    // Save error details in sessionStorage for persistence
    sessionStorage.setItem(
      "errorDetails",
      JSON.stringify({
        error: error.toString(),
        statusCode,
        user_role,
        url,
        timestamp,
        componentStack: errorInfo.componentStack,
      })
    );

    // Redirect to the error page
    window.location.href = "/error";
  }

  render() {
    if (this.state.hasError) {
      return null; // Render nothing since we are redirecting
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
