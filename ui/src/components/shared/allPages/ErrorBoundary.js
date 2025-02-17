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
    // Update state with error info and log to console.
    this.setState({ errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // Save error details in sessionStorage so they persist after redirect.
    sessionStorage.setItem(
      "errorDetails",
      JSON.stringify({
        error: error.toString(),
        componentStack: errorInfo.componentStack,
      })
    );
  }

  render() {
    if (this.state.hasError) {
      // Redirect to the error page.
      window.location.href = "/error"; 
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
