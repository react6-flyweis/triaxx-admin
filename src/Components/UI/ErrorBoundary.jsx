import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log the error to an analytics service here
    // Keep the full info in state so we can optionally show it in dev
    this.setState({ info });
    if (typeof window !== "undefined" && window?.console?.error) {
      // Always print to console for easier local debugging
      console.error("Captured error in ErrorBoundary:", error, info);
    }
    // TODO: send error to remote logging service if configured
  }

  handleReload = () => {
    // a conservative reload; sometimes just resetting local state is enough
    // but we prefer a full page reload to guarantee a clean slate
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, info } = this.state;
      return (
        <div
          style={{ padding: 32, fontFamily: "Inter, system-ui, sans-serif" }}
        >
          <div style={{ maxWidth: 920, margin: "0 auto" }}>
            <h1 style={{ color: "#b00020" }}>Something went wrong</h1>
            <p>
              An unexpected error occurred while rendering the app. You can try
              reloading the page — if the problem persists, please contact
              support.
            </p>

            <div style={{ marginTop: 16 }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Reload page
              </button>
            </div>

            {/* Show a minimal error trace in development */}
            {import.meta.env.NODE_ENV !== "production" && (
              <details style={{ marginTop: 24, whiteSpace: "pre-wrap" }}>
                <summary>Error details (click to expand)</summary>
                <div style={{ marginTop: 12 }}>
                  <strong>Error:</strong>
                  <pre>{String(error?.message ?? error)}</pre>
                  {info?.componentStack && (
                    <>
                      <strong>Component stack:</strong>
                      <pre>{info.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
