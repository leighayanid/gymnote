"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  Plus,
  Dumbbell,
  Calendar,
  Timer,
  TrendingUp,
  Flame,
  Target,
  Zap,
  ChevronRight,
  Sparkles,
  Activity,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkouts, useWorkoutStats } from "@/hooks/use-workouts";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const userId = user?.id ?? "";

  const { activeWorkout, startWorkout, isLoading: workoutsLoading } = useWorkouts(userId);
  const stats = useWorkoutStats(userId);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "activity">("overview");

  useEffect(() => {
    if (!isLoaded || workoutsLoading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Header animation
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 }
      );

      // Hero card with scale and blur
      tl.fromTo(
        heroCardRef.current,
        { opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1 },
        "-=0.5"
      );

      // Floating orbs animation inside hero
      gsap.to(".hero-orb", {
        y: -20,
        x: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.5, from: "random" },
      });

      // Stats cards stagger
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.4)",
          },
          "-=0.6"
        );
      }

      // Actions animation
      if (actionsRef.current) {
        tl.fromTo(
          actionsRef.current.children,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
          "-=0.4"
        );
      }

      // Pulse animation for the start button
      gsap.to(".start-btn-glow", {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded, workoutsLoading]);

  const handleStartWorkout = async () => {
    if (activeWorkout) {
      router.push("/workout/active");
      return;
    }

    try {
      await startWorkout();
      router.push("/workout/active");
    } catch (error) {
      console.error("Failed to start workout:", error);
    }
  };

  if (!isLoaded) {
    return <DashboardSkeleton />;
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container max-w-lg px-4 py-8 space-y-8">
        {/* Header */}
        <div ref={headerRef} className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {getTimeOfDay()}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            {user?.firstName ?? "Athlete"}
          </h1>
          <p className="text-muted-foreground font-medium">
            Ready to push your limits?
          </p>
        </div>

        {/* Hero Card - Start Workout */}
        <div
          ref={heroCardRef}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20 p-6"
        >
          {/* Floating orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="hero-orb absolute top-4 right-8 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="hero-orb absolute bottom-4 left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                                linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 rounded-full">
                {activeWorkout ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-xs font-bold text-primary">
                      IN PROGRESS
                    </span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3 h-3 text-primary" />
                    <span className="text-xs font-bold text-primary">
                      READY
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-black">
                {activeWorkout ? "Continue Session" : "Start Workout"}
              </h2>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                {activeWorkout
                  ? "You have an active workout waiting"
                  : "Begin your training and track every rep"}
              </p>
            </div>

            <button
              onClick={handleStartWorkout}
              className="relative group"
              aria-label={activeWorkout ? "Continue workout" : "Start workout"}
            >
              <div className="start-btn-glow absolute inset-0 bg-primary rounded-full" />
              <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:scale-105 group-active:scale-95 transition-transform duration-300">
                {activeWorkout ? (
                  <Dumbbell className="w-8 h-8 text-primary-foreground" />
                ) : (
                  <Plus className="w-8 h-8 text-primary-foreground" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="relative flex items-center p-1.5 bg-muted/50 rounded-2xl backdrop-blur-sm">
          <div
            className={cn(
              "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-background rounded-xl shadow-sm transition-all duration-500 ease-out",
              activeTab === "activity" && "translate-x-[calc(100%+6px)]"
            )}
          />
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors duration-300",
              activeTab === "overview"
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors duration-300",
              activeTab === "activity"
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            <Activity className="w-4 h-4" />
            Activity
          </button>
        </div>

        {/* Tab Content with Animation */}
        <div className="relative min-h-[300px]">
          {/* Overview Tab */}
          <div
            className={cn(
              "transition-all duration-500 ease-out",
              activeTab === "overview"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8 absolute inset-0 pointer-events-none"
            )}
          >
            {/* Stats Grid */}
            <div ref={statsRef} className="grid grid-cols-2 gap-4">
              {workoutsLoading || !stats ? (
                [...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))
              ) : (
                <>
                  <StatCard
                    icon={Calendar}
                    label="This Week"
                    value={stats.workoutsThisWeek}
                    unit="workouts"
                    color="primary"
                    delay={0}
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Total"
                    value={stats.totalWorkouts}
                    unit="workouts"
                    color="green"
                    delay={1}
                  />
                  <StatCard
                    icon={Timer}
                    label="Avg Duration"
                    value={stats.averageDurationMinutes}
                    unit="min"
                    color="orange"
                    delay={2}
                  />
                  <StatCard
                    icon={Zap}
                    label="Total Time"
                    value={stats.totalDurationMinutes}
                    unit="min"
                    color="blue"
                    delay={3}
                  />
                </>
              )}
            </div>
          </div>

          {/* Activity Tab */}
          <div
            className={cn(
              "transition-all duration-500 ease-out",
              activeTab === "activity"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8 absolute inset-0 pointer-events-none"
            )}
          >
            <div className="space-y-4">
              <WeeklyChart stats={stats} />
              <StreakCard workoutsThisWeek={stats?.workoutsThisWeek ?? 0} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div ref={actionsRef} className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Quick Actions
          </h3>
          <ActionCard
            icon={Dumbbell}
            title="Browse Exercises"
            subtitle="Explore our exercise library"
            onClick={() => router.push("/workout")}
          />
          <ActionCard
            icon={Calendar}
            title="Workout History"
            subtitle="Review your past sessions"
            onClick={() => router.push("/history")}
          />
          <ActionCard
            icon={Target}
            title="Set Goals"
            subtitle="Define your training targets"
            onClick={() => router.push("/profile")}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  color: "primary" | "green" | "orange" | "blue";
  delay: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const colorClasses = {
    primary: "from-primary/20 to-primary/5 text-primary",
    green: "from-green-500/20 to-green-500/5 text-green-500",
    orange: "from-orange-500/20 to-orange-500/5 text-orange-500",
    blue: "from-blue-500/20 to-blue-500/5 text-blue-500",
  };

  const iconBgClasses = {
    primary: "bg-primary/10",
    green: "bg-green-500/10",
    orange: "bg-orange-500/10",
    blue: "bg-blue-500/10",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.round(value * eased));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }, delay * 100);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 border border-border/50 group hover:scale-[1.02] transition-transform duration-300",
        colorClasses[color]
      )}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 space-y-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            iconBgClasses[color]
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-3xl font-black tracking-tight">
            {displayValue}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            {label} · {unit}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group text-left"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <div className="font-bold">{title}</div>
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
    </button>
  );
}

function WeeklyChart({ stats }: { stats: ReturnType<typeof useWorkoutStats> }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = new Date().getDay();
  const adjustedDay = currentDay === 0 ? 6 : currentDay - 1;

  return (
    <div className="rounded-2xl bg-card border border-border/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold">Weekly Activity</h4>
        <span className="text-xs text-muted-foreground font-medium">
          {stats?.workoutsThisWeek ?? 0} workouts
        </span>
      </div>
      <div className="flex items-end justify-between gap-2 h-24">
        {days.map((day, i) => {
          const isActive = i <= adjustedDay;
          const hasWorkout = i < (stats?.workoutsThisWeek ?? 0);
          const height = hasWorkout ? 60 + Math.random() * 40 : 20;

          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-full rounded-lg transition-all duration-500",
                  hasWorkout
                    ? "bg-gradient-to-t from-primary to-primary/60"
                    : isActive
                    ? "bg-muted"
                    : "bg-muted/30"
                )}
                style={{
                  height: `${height}%`,
                  transitionDelay: `${i * 50}ms`,
                }}
              />
              <span
                className={cn(
                  "text-[10px] font-bold",
                  i === adjustedDay
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StreakCard({ workoutsThisWeek }: { workoutsThisWeek: number }) {
  const streakLevel =
    workoutsThisWeek >= 5
      ? "fire"
      : workoutsThisWeek >= 3
      ? "good"
      : "building";

  const messages = {
    fire: "You're on fire! Keep crushing it!",
    good: "Great momentum! Stay consistent!",
    building: "Building your streak. Let's go!",
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-background border border-orange-500/20 p-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-7 h-7 text-orange-500" />
          </div>
          {workoutsThisWeek >= 3 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-black text-white">
                {workoutsThisWeek}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="font-bold">Weekly Streak</div>
          <p className="text-sm text-muted-foreground">{messages[streakLevel]}</p>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container max-w-lg space-y-8 px-4 py-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>
      <Skeleton className="h-40 rounded-3xl" />
      <Skeleton className="h-12 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}
