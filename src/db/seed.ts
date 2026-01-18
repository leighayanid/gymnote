import { db } from './index';
import { exercises, type MuscleGroup } from './schema';

interface SeedExercise {
  name: string;
  muscleGroup: MuscleGroup;
}

const builtInExercises: SeedExercise[] = [
  // Chest
  { name: 'Barbell Bench Press', muscleGroup: 'chest' },
  { name: 'Dumbbell Bench Press', muscleGroup: 'chest' },
  { name: 'Incline Barbell Press', muscleGroup: 'chest' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'chest' },
  { name: 'Decline Bench Press', muscleGroup: 'chest' },
  { name: 'Dumbbell Flyes', muscleGroup: 'chest' },
  { name: 'Cable Crossover', muscleGroup: 'chest' },
  { name: 'Push-Ups', muscleGroup: 'chest' },
  { name: 'Chest Dips', muscleGroup: 'chest' },
  { name: 'Pec Deck Machine', muscleGroup: 'chest' },

  // Back
  { name: 'Deadlift', muscleGroup: 'back' },
  { name: 'Barbell Row', muscleGroup: 'back' },
  { name: 'Dumbbell Row', muscleGroup: 'back' },
  { name: 'Pull-Ups', muscleGroup: 'back' },
  { name: 'Chin-Ups', muscleGroup: 'back' },
  { name: 'Lat Pulldown', muscleGroup: 'back' },
  { name: 'Seated Cable Row', muscleGroup: 'back' },
  { name: 'T-Bar Row', muscleGroup: 'back' },
  { name: 'Face Pulls', muscleGroup: 'back' },
  { name: 'Rack Pulls', muscleGroup: 'back' },

  // Shoulders
  { name: 'Overhead Press', muscleGroup: 'shoulders' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders' },
  { name: 'Arnold Press', muscleGroup: 'shoulders' },
  { name: 'Lateral Raises', muscleGroup: 'shoulders' },
  { name: 'Front Raises', muscleGroup: 'shoulders' },
  { name: 'Rear Delt Flyes', muscleGroup: 'shoulders' },
  { name: 'Upright Rows', muscleGroup: 'shoulders' },
  { name: 'Shrugs', muscleGroup: 'shoulders' },

  // Biceps
  { name: 'Barbell Curl', muscleGroup: 'biceps' },
  { name: 'Dumbbell Curl', muscleGroup: 'biceps' },
  { name: 'Hammer Curl', muscleGroup: 'biceps' },
  { name: 'Preacher Curl', muscleGroup: 'biceps' },
  { name: 'Incline Dumbbell Curl', muscleGroup: 'biceps' },
  { name: 'Cable Curl', muscleGroup: 'biceps' },
  { name: 'Concentration Curl', muscleGroup: 'biceps' },

  // Triceps
  { name: 'Close-Grip Bench Press', muscleGroup: 'triceps' },
  { name: 'Tricep Dips', muscleGroup: 'triceps' },
  { name: 'Skull Crushers', muscleGroup: 'triceps' },
  { name: 'Tricep Pushdown', muscleGroup: 'triceps' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'triceps' },
  { name: 'Diamond Push-Ups', muscleGroup: 'triceps' },
  { name: 'Rope Pushdown', muscleGroup: 'triceps' },

  // Core
  { name: 'Plank', muscleGroup: 'core' },
  { name: 'Hanging Leg Raise', muscleGroup: 'core' },
  { name: 'Cable Crunch', muscleGroup: 'core' },
  { name: 'Ab Wheel Rollout', muscleGroup: 'core' },
  { name: 'Russian Twist', muscleGroup: 'core' },
  { name: 'Dead Bug', muscleGroup: 'core' },
  { name: 'Mountain Climbers', muscleGroup: 'core' },

  // Quadriceps
  { name: 'Back Squat', muscleGroup: 'quadriceps' },
  { name: 'Front Squat', muscleGroup: 'quadriceps' },
  { name: 'Leg Press', muscleGroup: 'quadriceps' },
  { name: 'Leg Extension', muscleGroup: 'quadriceps' },
  { name: 'Walking Lunges', muscleGroup: 'quadriceps' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'quadriceps' },
  { name: 'Hack Squat', muscleGroup: 'quadriceps' },
  { name: 'Goblet Squat', muscleGroup: 'quadriceps' },

  // Hamstrings
  { name: 'Romanian Deadlift', muscleGroup: 'hamstrings' },
  { name: 'Lying Leg Curl', muscleGroup: 'hamstrings' },
  { name: 'Seated Leg Curl', muscleGroup: 'hamstrings' },
  { name: 'Good Mornings', muscleGroup: 'hamstrings' },
  { name: 'Nordic Hamstring Curl', muscleGroup: 'hamstrings' },
  { name: 'Stiff-Leg Deadlift', muscleGroup: 'hamstrings' },

  // Glutes
  { name: 'Hip Thrust', muscleGroup: 'glutes' },
  { name: 'Glute Bridge', muscleGroup: 'glutes' },
  { name: 'Cable Kickback', muscleGroup: 'glutes' },
  { name: 'Sumo Deadlift', muscleGroup: 'glutes' },
  { name: 'Step-Ups', muscleGroup: 'glutes' },

  // Calves
  { name: 'Standing Calf Raise', muscleGroup: 'calves' },
  { name: 'Seated Calf Raise', muscleGroup: 'calves' },
  { name: 'Donkey Calf Raise', muscleGroup: 'calves' },

  // Full Body
  { name: 'Clean and Press', muscleGroup: 'full_body' },
  { name: 'Thrusters', muscleGroup: 'full_body' },
  { name: 'Burpees', muscleGroup: 'full_body' },
  { name: 'Kettlebell Swing', muscleGroup: 'full_body' },
];

async function seed() {
  console.log('Seeding database with built-in exercises...');

  for (const exercise of builtInExercises) {
    await db.insert(exercises).values({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      isBuiltIn: true,
      isCustom: false,
      syncStatus: 'synced',
    }).onConflictDoNothing();
  }

  console.log(`Seeded ${builtInExercises.length} exercises`);
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
