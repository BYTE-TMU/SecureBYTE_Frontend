import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingView - A component for displaying loading states in review panels
 * 
 * @param {string} message - Optional custom loading message
 * @param {string} variant - 'inline' for inline loading, 'full' for full panel loading (default: 'inline')
 */
export function LoadingView({ message = 'Loading...', variant = 'inline' }) {
  if (variant === 'full') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-secure-orange mb-4" />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-6">
      <Loader2 className="h-5 w-5 animate-spin text-secure-orange" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export default LoadingView;

