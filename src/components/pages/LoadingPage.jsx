import React from 'react';
import { Loader2 } from 'lucide-react';

{/* Animated loading indicator with SecureBYTE branding*/}
export default function LoadingPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* SecureBYTE Logo/Text */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-secure-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">SB</span> 
          </div>
          <h1 className="text-3xl font-bold text-secure-blue">
            SecureBYTE
          </h1>
        </div>
        
        {/* Animated Loader */}
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-secure-orange" />
          <span className="text-muted-foreground text-sm">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
}
