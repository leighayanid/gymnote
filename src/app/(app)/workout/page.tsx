"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { gsap } from "gsap";
import {
  Search,
  Plus,
  ChevronRight,
  Dumbbell,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useExercises } from "@/hooks/use-exercises";
import { useWorkouts } from "@/hooks/use-workouts";
import { type MuscleGroup } from "@/db/local-database";
import { cn } from "@/lib/utils";

const muscleGroups: { value: MuscleGroup | "all"; label: string; icon?: string }[] = [
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { exercises, isLoading } = useExercises();
  const { activeWorkout, startWorkout, addExerciseToWorkout } = useWorkouts(userId);

  const filteredExercises = exercises.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === "all" || e.muscleGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  // Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isLoading || !listRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".exercise-card",
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.out",
        }
      );
    }, listRef);

    return () => ctx.revert();
  }, [isLoading, filteredExercises.length, selectedGroup]);

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
    <div ref={containerRef} className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col h-[calc(100vh-5rem)]">
        {/* Header */}
        <div
          ref={headerRef}
          className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50"
        >
          <div className="px-4 py-4 space-y-4">
            {/* Title Row */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <Dumbbell className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Exercise Library
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight">Exercises</h1>
              </div>
              {activeWorkout && (
                <Button
                  size="sm"
                  onClick={() => router.push("/workout/active")}
                  className="gap-2 shadow-lg shadow-primary/20"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  Active
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Search Bar */}
            <div
              className={cn(
                "relative transition-all duration-300",
                isSearchFocused && "scale-[1.02]"
              )}
            >
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-11 pr-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Muscle Group Pills */}
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {muscleGroups.map((group) => (
                  <button
                    key={group.value}
                    onClick={() => setSelectedGroup(group.value)}
                    className={cn(
                      "shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
                      selectedGroup === group.value
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Exercise List */}
        <ScrollArea className="flex-1">
          <div ref={listRef} className="px-4 py-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-2xl" />
                ))}
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold">No exercises found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filter
                </p>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                {/* Results count */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
                  <Filter className="w-4 h-4" />
                  <span>
                    {filteredExercises.length} exercise
                    {filteredExercises.length !== 1 && "s"}
                  </span>
                </div>

                {filteredExercises.map((exercise, index) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleSelectExercise(exercise.id)}
                    className="exercise-card w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group text-left opacity-0"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Dumbbell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{exercise.name}</p>
                      <Badge
                        variant="secondary"
                        className="mt-1 text-xs capitalize bg-muted/50"
                      >
                        {exercise.muscleGroup.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                      <Plus className="w-5 h-5 text-primary" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
