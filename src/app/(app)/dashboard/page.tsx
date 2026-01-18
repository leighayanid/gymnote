"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Plus, Dumbbell, Calendar, Timer, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkouts, useWorkoutStats } from "@/hooks/use-workouts";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const userId = user?.id ?? "";

  const { activeWorkout, startWorkout, isLoading: workoutsLoading } = useWorkouts(userId);
  const stats = useWorkoutStats(userId);

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
    <div className="container max-w-lg space-y-6 px-4 py-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          {getGreeting()}, {user?.firstName ?? "Athlete"}
        </h1>
        <p className="text-muted-foreground">Ready to crush your workout?</p>
      </div>

      {/* Quick Start */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                {activeWorkout ? "Continue Workout" : "Start Workout"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {activeWorkout
                  ? "You have an active session"
                  : "Begin your training session"}
              </p>
            </div>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg"
              onClick={handleStartWorkout}
            >
              {activeWorkout ? (
                <Dumbbell className="h-6 w-6" />
              ) : (
                <Plus className="h-6 w-6" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Stats</h2>
        {workoutsLoading || !stats ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={Calendar}
              label="This Week"
              value={stats.workoutsThisWeek}
              unit="workouts"
            />
            <StatCard
              icon={TrendingUp}
              label="Total"
              value={stats.totalWorkouts}
              unit="workouts"
            />
            <StatCard
              icon={Timer}
              label="Avg Duration"
              value={stats.averageDurationMinutes}
              unit="min"
            />
            <StatCard
              icon={Dumbbell}
              label="Total Time"
              value={stats.totalDurationMinutes}
              unit="min"
            />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-3">
          <Button
            variant="outline"
            className="h-12 justify-start gap-3"
            onClick={() => router.push("/workout")}
          >
            <Dumbbell className="h-5 w-5 text-primary" />
            Browse Exercises
          </Button>
          <Button
            variant="outline"
            className="h-12 justify-start gap-3"
            onClick={() => router.push("/history")}
          >
            <Calendar className="h-5 w-5 text-primary" />
            View Workout History
          </Button>
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
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{unit}</p>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container max-w-lg space-y-6 px-4 py-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>
      <Skeleton className="h-32" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
