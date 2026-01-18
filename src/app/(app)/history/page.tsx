"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Calendar, Clock, Dumbbell, Trash2 } from "lucide-react";
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

export default function HistoryPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const { completedWorkouts, isLoading, deleteWorkout } = useWorkouts(userId);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-4">
        <h1 className="text-xl font-bold">Workout History</h1>
        <p className="text-sm text-muted-foreground">
          {completedWorkouts.length} workouts completed
        </p>
      </div>

      {/* Workout List */}
      <ScrollArea className="flex-1 px-4 py-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : completedWorkouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No workouts yet</p>
            <p className="text-muted-foreground">
              Complete a workout to see it here
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {completedWorkouts.map((workout) => (
              <Card
                key={workout.id}
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => setSelectedWorkoutId(workout.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {workout.name || formatDate(workout.startedAt)}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(workout.startedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDuration(workout.durationSeconds)}
                        </span>
                      </div>
                    </div>
                    <Dumbbell className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        {!workout ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {workout.name || formatDate(workout.startedAt)}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Workout Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(workout.startedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(workout.durationSeconds)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                Started at {formatTime(workout.startedAt)}
                {workout.completedAt && ` • Finished at ${formatTime(workout.completedAt)}`}
              </p>

              {/* Exercises */}
              <div className="space-y-4">
                <h3 className="font-medium">Exercises</h3>
                {workout.exercises.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No exercises recorded</p>
                ) : (
                  <div className="space-y-4">
                    {workout.exercises.map((we) => (
                      <Card key={we.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            {we.exercise.name}
                          </CardTitle>
                          <Badge variant="secondary" className="w-fit text-xs capitalize">
                            {we.exercise.muscleGroup.replace("_", " ")}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          {we.sets.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No sets recorded</p>
                          ) : (
                            <div className="space-y-1">
                              <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground">
                                <span>SET</span>
                                <span>WEIGHT</span>
                                <span>REPS</span>
                              </div>
                              {we.sets.map((set) => (
                                <div
                                  key={set.id}
                                  className="grid grid-cols-3 gap-2 text-sm"
                                >
                                  <span>{set.setNumber}</span>
                                  <span>{set.weight ? `${set.weight} kg` : "—"}</span>
                                  <span>{set.reps ?? "—"}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="destructive" onClick={onDelete}>
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
