"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  featureName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`${this.props.featureName || "Component"} error:`, error, errorInfo);
    
    // Report to Sentry
    if (typeof window !== "undefined") {
      const sentry = (window as unknown as { Sentry?: { captureException: (error: Error, options?: unknown) => void } }).Sentry;
      if (sentry) {
        sentry.captureException(error, {
          extra: {
            featureName: this.props.featureName,
            componentStack: errorInfo.componentStack,
          },
        });
      }
    }
    
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[200px] items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="text-lg font-semibold text-white">
              {this.props.featureName 
                ? `Something went wrong with ${this.props.featureName}` 
                : "Something went wrong"}
            </h2>
            <p className="text-sm text-neutral-400">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button
              variant="primary"
              onClick={this.handleRetry}
              className="mt-2"
            >
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundaries for different features
export function AdminErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary featureName="Admin Panel">
      {children}
    </ErrorBoundary>
  );
}

export function SiteErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary featureName="Site">
      {children}
    </ErrorBoundary>
  );
}

export function InboxErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary featureName="Inbox">
      {children}
    </ErrorBoundary>
  );
}

export function MediaErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary featureName="Media Upload">
      {children}
    </ErrorBoundary>
  );
}

export function FormErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary featureName="Form">
      {children}
    </ErrorBoundary>
  );
}