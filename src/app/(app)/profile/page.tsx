"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut, Moon, Sun, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSync } from "@/hooks/use-sync";
import { useWorkoutStats } from "@/hooks/use-workouts";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();

  const userId = user?.id ?? "";
  const stats = useWorkoutStats(userId);
  const { syncState, pendingCount, isOnline, sync, lastSyncAt } = useSync();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (!isLoaded) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="container max-w-lg space-y-6 px-4 py-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.firstName ?? "Profile"}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-primary">
              {user?.firstName?.[0] ?? user?.emailAddresses[0]?.emailAddress[0] ?? "U"}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user?.emailAddresses[0]?.emailAddress}
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
                <p className="text-xs text-muted-foreground">Total Workouts</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalDurationMinutes}</p>
                <p className="text-xs text-muted-foreground">Total Minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Sync Status
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-destructive" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Connection</span>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pending Changes</span>
            <Badge variant={pendingCount > 0 ? "secondary" : "outline"}>
              {pendingCount}
            </Badge>
          </div>
          {lastSyncAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Synced</span>
              <span className="text-sm">{formatTimeAgo(lastSyncAt)}</span>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={sync}
            disabled={!isOnline || syncState === "syncing"}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${syncState === "syncing" ? "animate-spin" : ""}`}
            />
            {syncState === "syncing" ? "Syncing..." : "Sync Now"}
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="text-sm">Theme</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "Dark" : "Light"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Sign Out */}
      <Button
        variant="outline"
        className="w-full text-destructive hover:text-destructive"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>

      {/* App Version */}
      <p className="text-center text-xs text-muted-foreground">Ryne v0.1.0</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container max-w-lg space-y-6 px-4 py-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-32" />
      <Skeleton className="h-48" />
    </div>
  );
}

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
