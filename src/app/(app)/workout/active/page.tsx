"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Plus,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Timer,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { useWorkouts, useWorkout } from "@/hooks/use-workouts";
import { toast } from "sonner";

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id ?? "";

  const { activeWorkout, completeWorkout, addSet, deleteSet, removeExerciseFromWorkout } =
    useWorkouts(userId);

  const workout = useWorkout(activeWorkout?.id ?? "");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (!activeWorkout?.startedAt) return;

    const startTime = new Date(activeWorkout.startedAt).getTime();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout?.startedAt]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFinishWorkout = async () => {
    if (!activeWorkout) return;

    try {
      await completeWorkout(activeWorkout.id);
      toast.success("Workout completed!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to complete workout");
    }
  };

  if (!activeWorkout) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] px-4 text-center">
        <p className="text-lg font-medium">No active workout</p>
        <p className="text-muted-foreground mb-4">Start a new workout to begin</p>
        <Button onClick={() => router.push("/workout")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Exercises
        </Button>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container max-w-lg space-y-4 px-4 py-6">
        <Skeleton className="h-12" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Active Workout</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
          <Button size="sm" onClick={() => setShowFinishDialog(true)}>
            <Check className="mr-2 h-4 w-4" />
            Finish
          </Button>
        </div>
      </div>

      {/* Exercise List */}
      <ScrollArea className="flex-1 px-4 py-4">
        {workout.exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">No exercises added yet</p>
            <Button onClick={() => router.push("/workout")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {workout.exercises.map((we) => (
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
              />
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/workout")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </div>
        )}
      </ScrollArea>

      {/* Finish Dialog */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finish Workout?</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <p className="text-muted-foreground">
              Duration: <span className="font-medium text-foreground">{formatTime(elapsedTime)}</span>
            </p>
            <p className="text-muted-foreground">
              Exercises: <span className="font-medium text-foreground">{workout.exercises.length}</span>
            </p>
            <p className="text-muted-foreground">
              Sets:{" "}
              <span className="font-medium text-foreground">
                {workout.exercises.reduce((acc, e) => acc + e.sets.length, 0)}
              </span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFinishDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleFinishWorkout}>Complete Workout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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
}

function ExerciseCard({
  workoutExercise,
  isExpanded,
  onToggle,
  onAddSet,
  onDeleteSet,
  onRemove,
}: ExerciseCardProps) {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const handleAddSet = async () => {
    try {
      await onAddSet(workoutExercise.id, {
        reps: reps ? parseInt(reps) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
      });
      // Keep the last values for convenience
    } catch (error) {
      toast.error("Failed to add set");
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
    <Card>
      <CardHeader
        className="cursor-pointer pb-2"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{workoutExercise.exercise.name}</CardTitle>
            <Badge variant="secondary" className="mt-1 text-xs capitalize">
              {workoutExercise.exercise.muscleGroup.replace("_", " ")}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{workoutExercise.sets.length} sets</Badge>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Sets Table */}
          {workoutExercise.sets.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground">
                <span>SET</span>
                <span>WEIGHT</span>
                <span>REPS</span>
                <span></span>
              </div>
              {workoutExercise.sets.map((set) => (
                <div
                  key={set.id}
                  className="grid grid-cols-4 gap-2 items-center text-sm"
                >
                  <span className="font-medium">{set.setNumber}</span>
                  <span>{set.weight ? `${set.weight} kg` : "-"}</span>
                  <span>{set.reps ?? "-"}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDeleteSet(set.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add Set Form */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">kg</span>
            <Input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-20"
            />
            <Button size="sm" onClick={handleAddSet}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Remove Exercise */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Exercise
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
