"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { gsap } from "gsap";
import {
  Calendar,
  Clock,
  Dumbbell,
  Trash2,
  ChevronRight,
  History,
  Trophy,
  Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useWorkouts, useWorkout } from "@/hooks/use-workouts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const { completedWorkouts, isLoading, deleteWorkout } = useWorkouts(userId);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Animations
  useEffect(() => {
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
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isLoading || !listRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".history-card",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }, listRef);

    return () => ctx.revert();
  }, [isLoading, completedWorkouts.length]);

  const handleDelete = async (workoutId: string) => {
    try {
      await deleteWorkout(workoutId);
      setDeleteConfirmId(null);
      setSelectedWorkoutId(null);
      toast.success("Workout deleted");
    } catch (error) {
      toast.error("Failed to delete workout");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
  };

  // Calculate stats
  const totalDuration = completedWorkouts.reduce(
    (acc, w) => acc + (w.durationSeconds ?? 0),
    0
  );
  const avgDuration =
    completedWorkouts.length > 0
      ? Math.round(totalDuration / completedWorkouts.length / 60)
      : 0;

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col h-[calc(100vh-5rem)]">
        {/* Header */}
        <div
          ref={headerRef}
          className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <History className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Your Journey
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">History</h1>
            <p className="text-sm text-muted-foreground">
              {completedWorkouts.length} workout
              {completedWorkouts.length !== 1 && "s"} completed
            </p>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 px-4 py-4">
          {/* Quick Stats */}
          {completedWorkouts.length > 0 && (
            <div ref={statsRef} className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-4 text-center">
                <Trophy className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-black">{completedWorkouts.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Workouts
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 p-4 text-center">
                <Flame className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-black">{avgDuration}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Avg Min
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 p-4 text-center">
                <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-black">
                  {Math.round(totalDuration / 60)}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Total Min
                </p>
              </div>
            </div>
          )}

          {/* Workout List */}
          <div ref={listRef}>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl" />
                ))}
              </div>
            ) : completedWorkouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <p className="text-xl font-bold mb-2">No workouts yet</p>
                <p className="text-muted-foreground max-w-[250px]">
                  Complete your first workout and it will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 mb-2">
                  Recent Workouts
                </h3>
                {completedWorkouts.map((workout, index) => (
                  <button
                    key={workout.id}
                    className="history-card w-full text-left p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group opacity-0"
                    onClick={() => setSelectedWorkoutId(workout.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Dumbbell className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">
                          {workout.name || formatDate(workout.startedAt)}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(workout.startedAt)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDuration(workout.durationSeconds)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Workout Detail Dialog */}
        <WorkoutDetailDialog
          workoutId={selectedWorkoutId}
          onClose={() => setSelectedWorkoutId(null)}
          onDelete={() => setDeleteConfirmId(selectedWorkoutId)}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Workout?</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              This action cannot be undone. This workout and all its data will be
              permanently deleted.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function WorkoutDetailDialog({
  workoutId,
  onClose,
  onDelete,
}: {
  workoutId: string | null;
  onClose: () => void;
  onDelete: () => void;
}) {
  const workout = useWorkout(workoutId ?? "");

  if (!workoutId) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "—";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins} min`;
  };

  return (
    <Dialog open={!!workoutId} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        {!workout ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-black">
                {workout.name || formatDate(workout.startedAt)}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Workout Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <Calendar className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                    }).format(new Date(workout.startedAt))}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold">
                    {formatDuration(workout.durationSeconds)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                {formatTime(workout.startedAt)}
                {workout.completedAt && ` — ${formatTime(workout.completedAt)}`}
              </p>

              {/* Exercises */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Exercises ({workout.exercises.length})
                </h3>
                {workout.exercises.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No exercises recorded
                  </p>
                ) : (
                  <div className="space-y-3">
                    {workout.exercises.map((we) => (
                      <div
                        key={we.id}
                        className="rounded-xl bg-card border border-border/50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-border/50 bg-muted/30">
                          <p className="font-bold">{we.exercise.name}</p>
                          <Badge
                            variant="secondary"
                            className="mt-1 text-xs capitalize"
                          >
                            {we.exercise.muscleGroup.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="p-4">
                          {we.sets.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                              No sets recorded
                            </p>
                          ) : (
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                <span>Set</span>
                                <span>Weight</span>
                                <span>Reps</span>
                              </div>
                              {we.sets.map((set) => (
                                <div
                                  key={set.id}
                                  className="grid grid-cols-3 gap-2 text-sm"
                                >
                                  <span className="font-semibold">
                                    {set.setNumber}
                                  </span>
                                  <span>
                                    {set.weight ? `${set.weight} kg` : "—"}
                                  </span>
                                  <span>{set.reps ?? "—"}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button variant="destructive" onClick={onDelete} className="flex-1">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
