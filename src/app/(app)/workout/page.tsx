"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Search, Plus, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useExercises } from "@/hooks/use-exercises";
import { useWorkouts } from "@/hooks/use-workouts";
import { type MuscleGroup } from "@/db/local-database";

const muscleGroups: { value: MuscleGroup | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "quadriceps", label: "Quads" },
  { value: "hamstrings", label: "Hams" },
  { value: "glutes", label: "Glutes" },
  { value: "core", label: "Core" },
  { value: "calves", label: "Calves" },
  { value: "full_body", label: "Full Body" },
];

export default function WorkoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id ?? "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | "all">("all");

  const { exercises, isLoading, searchExercises } = useExercises();
  const { activeWorkout, startWorkout, addExerciseToWorkout } = useWorkouts(userId);

  const filteredExercises = exercises.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === "all" || e.muscleGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleSelectExercise = async (exerciseId: string) => {
    try {
      let workoutId = activeWorkout?.id;

      if (!workoutId) {
        const workout = await startWorkout();
        workoutId = workout.id;
      }

      await addExerciseToWorkout(workoutId, exerciseId);
      router.push("/workout/active");
    } catch (error) {
      console.error("Failed to add exercise:", error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="sticky top-0 z-10 space-y-4 bg-background px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Exercises</h1>
          {activeWorkout && (
            <Button size="sm" onClick={() => router.push("/workout/active")}>
              Active Workout
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Muscle Group Tabs */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {muscleGroups.map((group) => (
              <Button
                key={group.value}
                variant={selectedGroup === group.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGroup(group.value)}
                className="shrink-0"
              >
                {group.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Exercise List */}
      <ScrollArea className="flex-1 px-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No exercises found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {filteredExercises.map((exercise) => (
              <Card
                key={exercise.id}
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => handleSelectExercise(exercise.id)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <p className="font-medium">{exercise.name}</p>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {exercise.muscleGroup.replace("_", " ")}
                    </Badge>
                  </div>
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
