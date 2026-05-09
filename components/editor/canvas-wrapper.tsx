"use client";

import { 
  LiveblocksProvider, 
  RoomProvider, 
  ClientSideSuspense 
} from "@liveblocks/react/suspense";
import { LiveObject, LiveMap } from "@liveblocks/client";
import { ReactNode } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui/button";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background p-6 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't connect to the collaborative session. 
        {(error as any)?.message && (
          <span className="block mt-2 text-xs opacity-70 italic font-mono">
            {(error as any).message}
          </span>
        )}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Page
        </Button>
        <Button onClick={resetErrorBoundary}>
          Try Again
        </Button>
      </div>
    </div>
  );
}

export function CanvasWrapper({ 
  children, 
  roomId 
}: { 
  children: ReactNode; 
  roomId: string 
}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider 
          id={roomId} 
          initialPresence={{ cursor: null, isThinking: false }}
          initialStorage={{
            flow: new LiveObject({
              nodes: new LiveMap(),
              edges: new LiveMap(),
            }) as any
          }}
        >
          <ClientSideSuspense fallback={
            <div className="flex h-full w-full items-center justify-center bg-background">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }>
            {children}
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </ErrorBoundary>
  );
}
