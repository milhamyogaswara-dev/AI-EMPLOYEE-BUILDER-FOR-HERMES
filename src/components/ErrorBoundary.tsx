import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
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

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#0A0A0A] text-[#F0F0F0] p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif italic mb-2 text-white">Application Error</h2>
          <p className="text-[#888] font-light text-sm max-w-md mb-8">
            An unexpected error occurred while rendering this module. We have safely contained the error to prevent a full application crash.
          </p>
          
          <div className="bg-[#141414] p-4 rounded-xl border border-white/10 text-left w-full max-w-2xl mb-8 overflow-x-auto">
            <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 block mb-2">Error Details</span>
            <code className="text-xs font-mono text-[#CCC] whitespace-pre-wrap break-words">
              {this.state.error?.toString()}
            </code>
          </div>

          <button
            onClick={() => (this as any).setState({ hasError: false, error: null })}
            className="px-6 py-3 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset View</span>
          </button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
