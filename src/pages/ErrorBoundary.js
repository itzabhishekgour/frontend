import React from "react";
import { Navigate } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_) {
    return { hasError: true };
  }
  
  componentDidCatch(error, info) {
    console.error("React render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Navigate to="/404" replace />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
