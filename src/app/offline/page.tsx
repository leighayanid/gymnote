'use client';

import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <WifiOff className="h-10 w-10 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">You're Offline</h1>
          <p className="text-muted-foreground max-w-sm">
            Don't worry! Ryne works offline. You can continue tracking your workouts
            and your data will sync when you're back online.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => window.location.reload()}
            className="w-full max-w-xs"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full max-w-xs"
          >
            Go Back
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Check your internet connection and try again
        </p>
      </div>
    </div>
  );
}
