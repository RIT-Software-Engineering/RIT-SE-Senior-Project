import React, { Component } from "react";

//Wraps the entire app to catch all errors and stores details in the session storage


class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error occurred
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Capture error details
    this.setState({ errorInfo });

    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // Gather additional details
    const statusCode = 500; 
    const user_role = sessionStorage.getItem("userRole") || "Unknown";
    const url = window.location.href; 
    const timestamp = Date(Date.now()).toString(); 

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
