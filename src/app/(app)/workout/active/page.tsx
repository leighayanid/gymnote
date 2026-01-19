"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { gsap } from "gsap";
import {
  Plus,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Timer,
  X,
  Loader2,
  Dumbbell,
  Flame,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useWorkouts, useWorkout } from "@/hooks/use-workouts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id ?? "";

  const { activeWorkout, completeWorkout, addSet, deleteSet, removeExerciseFromWorkout } =
    useWorkouts(userId);

  // Store workout ID to prevent losing reference during completion
  const workoutIdRef = useRef<string | null>(null);

  // Update ref when activeWorkout changes (but not when it becomes null during completion)
  useEffect(() => {
    if (activeWorkout?.id) {
      workoutIdRef.current = activeWorkout.id;
    }
  }, [activeWorkout?.id]);

  const workout = useWorkout(workoutIdRef.current ?? activeWorkout?.id ?? "");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Timer effect
  useEffect(() => {
    if (!activeWorkout?.startedAt) return;

    const startTime = new Date(activeWorkout.startedAt).getTime();
    setElapsedTime(Math.floor((Date.now() - startTime) / 1000));

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout?.startedAt]);

  // Entrance animation
  useEffect(() => {
    if (!workout) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".exercise-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [workout]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOpenFinishDialog = () => {
    setShowFinishDialog(true);
  };

  const handleCloseFinishDialog = () => {
    if (!isFinishing) {
      setShowFinishDialog(false);
    }
  };

  const handleFinishWorkout = async () => {
    const workoutId = workoutIdRef.current ?? activeWorkout?.id;
    if (!workoutId || isFinishing) return;

    setIsFinishing(true);

    try {
      await completeWorkout(workoutId);
      setShowFinishDialog(false);
      toast.success("Workout completed!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to complete workout:", error);
      toast.error("Failed to complete workout");
      setIsFinishing(false);
    }
  };

  // Show loading while finishing to prevent "no active workout" flash
  if (isFinishing) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-6rem)] px-4 text-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-2">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
          <p className="text-xl font-bold">Completing workout...</p>
          <p className="text-muted-foreground">Saving your progress</p>
        </div>
      </div>
    );
  }

  if (!activeWorkout && !workoutIdRef.current) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-6rem)] px-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
            <Dumbbell className="w-10 h-10 text-primary" />
          </div>
          <p className="text-xl font-bold mb-2">No active workout</p>
          <p className="text-muted-foreground mb-6">Start a new workout to begin</p>
          <Button onClick={() => router.push("/workout")} size="lg" className="rounded-xl">
            <Plus className="mr-2 h-5 w-5" />
            Add Exercises
          </Button>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container max-w-lg space-y-4 px-4 py-6">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  const totalSets = workout.exercises.reduce((acc, e) => acc + e.sets.length, 0);

  return (
    <>
      <div ref={containerRef} className="relative min-h-screen">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-green-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col h-[calc(100vh-6rem)]">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-green-500">
                      In Progress
                    </span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight">Active Workout</h1>
                </div>
                <Button
                  type="button"
                  onClick={handleOpenFinishDialog}
                  className="rounded-xl shadow-lg shadow-primary/20"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Finish
                </Button>
              </div>

              {/* Timer Card */}
              <div className="mt-4 flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Timer className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-black tabular-nums">
                    {formatTime(elapsedTime)}
                  </p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">{totalSets}</p>
                  <p className="text-xs text-muted-foreground">Sets</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exercise List */}
          <ScrollArea className="flex-1">
            <div className="px-4 py-4">
              {workout.exercises.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                    <Dumbbell className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold mb-2">No exercises added</p>
                  <p className="text-muted-foreground mb-6">Add exercises to track your sets</p>
                  <Button onClick={() => router.push("/workout")} className="rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Exercise
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 pb-4">
                  {workout.exercises.map((we, index) => (
                    <ExerciseCard
                      key={we.id}
                      workoutExercise={we}
                      isExpanded={expandedExercise === we.id}
                      onToggle={() =>
                        setExpandedExercise(expandedExercise === we.id ? null : we.id)
                      }
                      onAddSet={addSet}
                      onDeleteSet={deleteSet}
                      onRemove={() => removeExerciseFromWorkout(we.id)}
                      index={index}
                    />
                  ))}

                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-dashed"
                    onClick={() => router.push("/workout")}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Exercise
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Finish Dialog - Moved outside main container */}
      <Dialog open={showFinishDialog} onOpenChange={handleCloseFinishDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Finish Workout?</DialogTitle>
            <DialogDescription>
              Review your workout summary before completing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-4">
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <Timer className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-black">{formatTime(elapsedTime)}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Duration</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <Dumbbell className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-black">{workout.exercises.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Exercises</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-black">{totalSets}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Sets</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseFinishDialog}
              disabled={isFinishing}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleFinishWorkout}
              disabled={isFinishing}
              className="flex-1 rounded-xl"
            >
              {isFinishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Complete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ExerciseCardProps {
  workoutExercise: {
    id: string;
    exercise: { id: string; name: string; muscleGroup: string };
    sets: Array<{
      id: string;
      setNumber: number;
      reps?: number;
      weight?: number;
      isWarmup: boolean;
    }>;
  };
  isExpanded: boolean;
  onToggle: () => void;
  onAddSet: (workoutExerciseId: string, data: { reps?: number; weight?: number }) => Promise<unknown>;
  onDeleteSet: (setId: string) => Promise<void>;
  onRemove: () => void;
  index: number;
}

function ExerciseCard({
  workoutExercise,
  isExpanded,
  onToggle,
  onAddSet,
  onDeleteSet,
  onRemove,
  index,
}: ExerciseCardProps) {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSet = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await onAddSet(workoutExercise.id, {
        reps: reps ? parseInt(reps) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
      });
      toast.success("Set added");
    } catch (error) {
      toast.error("Failed to add set");
    } finally {
      setIsAdding(false);
    }
  };

  // Pre-fill with last set values
  useEffect(() => {
    if (workoutExercise.sets.length > 0 && !reps && !weight) {
      const lastSet = workoutExercise.sets[workoutExercise.sets.length - 1];
      if (lastSet.reps) setReps(lastSet.reps.toString());
      if (lastSet.weight) setWeight(lastSet.weight.toString());
    }
  }, [workoutExercise.sets.length]);

  return (
    <div className="exercise-item rounded-2xl bg-card border border-border/50 overflow-hidden opacity-0">
      {/* Header */}
      <button
        type="button"
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">{workoutExercise.exercise.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs capitalize">
              {workoutExercise.exercise.muscleGroup.replace("_", " ")}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {workoutExercise.sets.length} sets
            </Badge>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border/50">
          {/* Sets Table */}
          {workoutExercise.sets.length > 0 && (
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-4 gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                <span>Set</span>
                <span>Weight</span>
                <span>Reps</span>
                <span></span>
              </div>
              {workoutExercise.sets.map((set) => (
                <div
                  key={set.id}
                  className="grid grid-cols-4 gap-2 items-center text-sm p-2 rounded-xl bg-muted/30"
                >
                  <span className="font-bold">{set.setNumber}</span>
                  <span>{set.weight ? `${set.weight} kg` : "—"}</span>
                  <span>{set.reps ?? "—"}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-auto"
                    onClick={() => onDeleteSet(set.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add Set Form */}
          <div className="p-4 bg-muted/20 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-12 rounded-xl text-center text-lg font-bold"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Reps
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="h-12 rounded-xl text-center text-lg font-bold"
                />
              </div>
              <div className="pt-5">
                <Button
                  type="button"
                  onClick={handleAddSet}
                  disabled={isAdding}
                  className="h-12 w-12 rounded-xl"
                >
                  {isAdding ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Remove Exercise */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
              onClick={onRemove}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Exercise
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
