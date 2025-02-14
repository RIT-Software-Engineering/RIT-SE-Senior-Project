import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    console.log("Reset button clicked");
    this.setState({ hasError: false, error: null, errorInfo: null });
  };
  

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>Please try refreshing the page or reporting this issue.</p>
          <details>
            <summary>Error Details</summary>
            <pre>
              {this.state.error?.toString()}
              {"\n"}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
          <button onClick={this.handleReset}>Try Again</button>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
