import React from 'react';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-lg font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-textMuted max-w-md mb-6">An unexpected error occurred. Please reload.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg border border-white/10 transition-colors cursor-pointer"
          >
            Reload Page
          </button>
          {import.meta.env.DEV && (
            <pre className="mt-6 p-4 text-left font-mono text-xs text-red-400 bg-red-950/20 border border-red-900/40 rounded-lg max-w-xl overflow-x-auto w-full">
              {this.state.error?.stack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
