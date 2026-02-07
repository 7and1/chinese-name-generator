"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function GlobalError({ error, reset }: GlobalErrorProps) {
  const handleReport = () => {
    // Log error details for debugging
    console.error("Global error caught:", error);

    // In production, you could send this to Sentry or other error tracking
    // Sentry.captureException(error);

    // Show user-friendly message
    alert("Error has been logged. Thank you for your patience.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">
            Something went wrong
          </CardTitle>
          <CardDescription>
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {error.message ||
                "An unexpected error occurred while processing your request."}
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                  Error details
                </summary>
                <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto max-h-48">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={handleReport} variant="outline">
            Report error
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;

      if (FallbackComponent && this.state.error) {
        return (
          <FallbackComponent
            error={this.state.error}
            retry={this.handleReset}
          />
        );
      }

      return (
        <GlobalError
          error={this.state.error || new Error("Unknown error")}
          reset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
