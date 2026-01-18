"use client";

import { WifiOff, RefreshCw, Check, AlertCircle } from "lucide-react";
import { useSync } from "@/hooks/use-sync";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function OfflineIndicator() {
  const { syncState, pendingCount, isOnline, sync } = useSync();

  // Don't show anything if online and synced
  if (isOnline && syncState === "idle" && pendingCount === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-2 pt-safe">
      <Badge
        variant={!isOnline ? "destructive" : syncState === "error" ? "destructive" : "secondary"}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-xs font-medium shadow-lg",
          syncState === "syncing" && "animate-pulse"
        )}
        onClick={isOnline ? sync : undefined}
      >
        {!isOnline ? (
          <>
            <WifiOff className="h-3.5 w-3.5" />
            <span>Offline</span>
            {pendingCount > 0 && (
              <span className="ml-1 rounded-full bg-background/20 px-1.5 py-0.5 text-[10px]">
                {pendingCount} pending
              </span>
            )}
          </>
        ) : syncState === "syncing" ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Syncing...</span>
          </>
        ) : syncState === "error" ? (
          <>
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Sync failed</span>
          </>
        ) : pendingCount > 0 ? (
          <>
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{pendingCount} changes to sync</span>
          </>
        ) : (
          <>
            <Check className="h-3.5 w-3.5" />
            <span>Synced</span>
          </>
        )}
      </Badge>
    </div>
  );
}
