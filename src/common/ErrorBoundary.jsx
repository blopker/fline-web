import React from "react";
import * as Sentry from "@sentry/browser";
import { PropTypes } from "prop-types";

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log the error to Sentry
    if (process.env.NODE_ENV === "production") {
      Sentry.withScope(scope => {
        scope.setExtras(info);
        Sentry.captureException(error);
      });
    }
  }

  render() {
    if (this.state.error) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  fallback: PropTypes.node.isRequired,
  children: PropTypes.node
};

export default ErrorBoundary;
