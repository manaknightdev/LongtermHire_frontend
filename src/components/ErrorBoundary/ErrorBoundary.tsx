import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: any, info: { componentStack: any }) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state: { hasError: boolean; error: any; errorStack: any };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: "", errorStack: "" };
  }

  static getDerivedStateFromError(_error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: { componentStack: any }) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    this.setState(() => ({
      ...this.state,
      error,
      errorStack: info.componentStack,
    }));
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      const stack = JSON.stringify(
        this.state.errorStack,
        null,
        "\t"
      ).replaceAll("at", "\n at");

      return (
        <div
          className={`scrollbar-hide m-5 flex h-screen w-full flex-col items-center justify-center gap-3 overflow-hidden p-20 text-red-600`}
        >
          <div className="scrollbar-hide h-full w-full overflow-auto">
            <div>{this.state.error?.message}</div>
            <pre>{stack}</pre>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

export default ErrorBoundary;
