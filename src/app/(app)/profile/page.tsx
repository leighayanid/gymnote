"use client";

import { useEffect, useRef } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  LogOut,
  Moon,
  Sun,
  RefreshCw,
  Wifi,
  WifiOff,
  User,
  Settings,
  Cloud,
  ChevronRight,
  Sparkles,
  Trophy,
  Timer,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSync } from "@/hooks/use-sync";
import { useWorkoutStats } from "@/hooks/use-workouts";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();

  const userId = user?.id ?? "";
  const stats = useWorkoutStats(userId);
  const { syncState, pendingCount, isOnline, sync, lastSyncAt } = useSync();

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Animations
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 }
      );

      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.children,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        );
      }

      if (cardsRef.current) {
        tl.fromTo(
          cardsRef.current.children,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.08 },
          "-=0.3"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!isLoaded) {
    return <ProfileSkeleton />;
  }

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container max-w-lg px-4 py-8 space-y-8">
        {/* Profile Header */}
        <div ref={headerRef} className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Profile
            </span>
          </div>

          {/* Avatar and Info */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.firstName ?? "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-black text-primary">
                    {user?.firstName?.[0] ??
                      user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ??
                      "U"}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center border-2 border-background">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black tracking-tight">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div ref={statsRef} className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-5">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-black">{stats.totalWorkouts}</p>
              <p className="text-xs text-muted-foreground font-medium">
                Total Workouts
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 p-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                <Timer className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-black">{stats.totalDurationMinutes}</p>
              <p className="text-xs text-muted-foreground font-medium">
                Total Minutes
              </p>
            </div>
          </div>
        )}

        {/* Settings Cards */}
        <div ref={cardsRef} className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
            Settings
          </h3>

          {/* Sync Status Card */}
          <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isOnline ? "bg-green-500/20" : "bg-red-500/20"
                  )}
                >
                  {isOnline ? (
                    <Wifi className="w-5 h-5 text-green-500" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-bold">Sync Status</p>
                  <p className="text-xs text-muted-foreground">
                    {isOnline ? "Connected" : "Offline"}
                  </p>
                </div>
              </div>
              <Badge
                variant={isOnline ? "default" : "destructive"}
                className="capitalize"
              >
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Pending Changes
                </span>
                <Badge variant={pendingCount > 0 ? "secondary" : "outline"}>
                  {pendingCount}
                </Badge>
              </div>
              {lastSyncAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Synced
                  </span>
                  <span className="text-sm font-medium">
                    {formatTimeAgo(lastSyncAt)}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl"
                onClick={sync}
                disabled={!isOnline || syncState === "syncing"}
              >
                <RefreshCw
                  className={cn(
                    "mr-2 h-4 w-4",
                    syncState === "syncing" && "animate-spin"
                  )}
                />
                {syncState === "syncing" ? "Syncing..." : "Sync Now"}
              </Button>
            </div>
          </div>

          {/* Theme Toggle Card */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-orange-500" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold">Appearance</p>
              <p className="text-sm text-muted-foreground">
                {theme === "dark" ? "Dark theme" : "Light theme"}
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-muted/50 text-sm font-medium">
              {theme === "dark" ? "Dark" : "Light"}
            </div>
          </button>
        </div>

        {/* Sign Out Button */}
        <div className="pt-4 space-y-4">
          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-300"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>

          {/* App Version */}
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">Ryne</p>
            <p className="text-[10px] text-muted-foreground/60">Version 0.1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container max-w-lg space-y-8 px-4 py-8">
      <div className="space-y-6">
        <Skeleton className="h-4 w-20" />
        <div className="flex items-center gap-5">
          <Skeleton className="w-20 h-20 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
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
