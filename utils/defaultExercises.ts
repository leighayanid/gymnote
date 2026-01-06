export interface DefaultExercise {
  name: string
  bodyPart: string
  target: string
  equipment: string
}

export const defaultExercises: DefaultExercise[] = [
  // Chest exercises
  { name: 'bench press', bodyPart: 'chest', target: 'pectorals', equipment: 'barbell' },
  { name: 'incline bench press', bodyPart: 'chest', target: 'upper pectorals', equipment: 'barbell' },
  { name: 'decline bench press', bodyPart: 'chest', target: 'lower pectorals', equipment: 'barbell' },
  { name: 'dumbbell press', bodyPart: 'chest', target: 'pectorals', equipment: 'dumbbell' },
  { name: 'incline dumbbell press', bodyPart: 'chest', target: 'upper pectorals', equipment: 'dumbbell' },
  { name: 'push up', bodyPart: 'chest', target: 'pectorals', equipment: 'body weight' },
  { name: 'cable fly', bodyPart: 'chest', target: 'pectorals', equipment: 'cable' },
  { name: 'dumbbell fly', bodyPart: 'chest', target: 'pectorals', equipment: 'dumbbell' },
  { name: 'chest dip', bodyPart: 'chest', target: 'pectorals', equipment: 'body weight' },
  { name: 'pec deck', bodyPart: 'chest', target: 'pectorals', equipment: 'machine' },

  // Back exercises
  { name: 'deadlift', bodyPart: 'back', target: 'spinal erectors', equipment: 'barbell' },
  { name: 'barbell row', bodyPart: 'back', target: 'lats', equipment: 'barbell' },
  { name: 'pull up', bodyPart: 'back', target: 'lats', equipment: 'body weight' },
  { name: 'chin up', bodyPart: 'back', target: 'lats', equipment: 'body weight' },
  { name: 'lat pulldown', bodyPart: 'back', target: 'lats', equipment: 'cable' },
  { name: 'seated cable row', bodyPart: 'back', target: 'lats', equipment: 'cable' },
  { name: 'dumbbell row', bodyPart: 'back', target: 'lats', equipment: 'dumbbell' },
  { name: 't-bar row', bodyPart: 'back', target: 'lats', equipment: 'barbell' },
  { name: 'face pull', bodyPart: 'back', target: 'rear delts', equipment: 'cable' },
  { name: 'hyperextension', bodyPart: 'back', target: 'lower back', equipment: 'body weight' },

  // Shoulder exercises
  { name: 'overhead press', bodyPart: 'shoulders', target: 'delts', equipment: 'barbell' },
  { name: 'military press', bodyPart: 'shoulders', target: 'delts', equipment: 'barbell' },
  { name: 'dumbbell shoulder press', bodyPart: 'shoulders', target: 'delts', equipment: 'dumbbell' },
  { name: 'lateral raise', bodyPart: 'shoulders', target: 'side delts', equipment: 'dumbbell' },
  { name: 'front raise', bodyPart: 'shoulders', target: 'front delts', equipment: 'dumbbell' },
  { name: 'rear delt fly', bodyPart: 'shoulders', target: 'rear delts', equipment: 'dumbbell' },
  { name: 'arnold press', bodyPart: 'shoulders', target: 'delts', equipment: 'dumbbell' },
  { name: 'upright row', bodyPart: 'shoulders', target: 'delts', equipment: 'barbell' },
  { name: 'shrug', bodyPart: 'shoulders', target: 'traps', equipment: 'dumbbell' },

  // Leg exercises
  { name: 'squat', bodyPart: 'legs', target: 'quads', equipment: 'barbell' },
  { name: 'front squat', bodyPart: 'legs', target: 'quads', equipment: 'barbell' },
  { name: 'leg press', bodyPart: 'legs', target: 'quads', equipment: 'machine' },
  { name: 'leg extension', bodyPart: 'legs', target: 'quads', equipment: 'machine' },
  { name: 'leg curl', bodyPart: 'legs', target: 'hamstrings', equipment: 'machine' },
  { name: 'romanian deadlift', bodyPart: 'legs', target: 'hamstrings', equipment: 'barbell' },
  { name: 'walking lunge', bodyPart: 'legs', target: 'quads', equipment: 'dumbbell' },
  { name: 'bulgarian split squat', bodyPart: 'legs', target: 'quads', equipment: 'dumbbell' },
  { name: 'calf raise', bodyPart: 'legs', target: 'calves', equipment: 'machine' },
  { name: 'hack squat', bodyPart: 'legs', target: 'quads', equipment: 'machine' },

  // Arm exercises
  { name: 'barbell curl', bodyPart: 'arms', target: 'biceps', equipment: 'barbell' },
  { name: 'dumbbell curl', bodyPart: 'arms', target: 'biceps', equipment: 'dumbbell' },
  { name: 'hammer curl', bodyPart: 'arms', target: 'biceps', equipment: 'dumbbell' },
  { name: 'preacher curl', bodyPart: 'arms', target: 'biceps', equipment: 'barbell' },
  { name: 'cable curl', bodyPart: 'arms', target: 'biceps', equipment: 'cable' },
  { name: 'tricep dip', bodyPart: 'arms', target: 'triceps', equipment: 'body weight' },
  { name: 'close grip bench press', bodyPart: 'arms', target: 'triceps', equipment: 'barbell' },
  { name: 'tricep pushdown', bodyPart: 'arms', target: 'triceps', equipment: 'cable' },
  { name: 'overhead tricep extension', bodyPart: 'arms', target: 'triceps', equipment: 'dumbbell' },
  { name: 'skull crusher', bodyPart: 'arms', target: 'triceps', equipment: 'barbell' },

  // Core exercises
  { name: 'crunch', bodyPart: 'waist', target: 'abs', equipment: 'body weight' },
  { name: 'sit up', bodyPart: 'waist', target: 'abs', equipment: 'body weight' },
  { name: 'plank', bodyPart: 'waist', target: 'abs', equipment: 'body weight' },
  { name: 'side plank', bodyPart: 'waist', target: 'obliques', equipment: 'body weight' },
  { name: 'russian twist', bodyPart: 'waist', target: 'obliques', equipment: 'body weight' },
  { name: 'leg raise', bodyPart: 'waist', target: 'abs', equipment: 'body weight' },
  { name: 'bicycle crunch', bodyPart: 'waist', target: 'abs', equipment: 'body weight' },
  { name: 'mountain climber', bodyPart: 'waist', target: 'abs', equipment: 'body weight' },
  { name: 'ab wheel rollout', bodyPart: 'waist', target: 'abs', equipment: 'wheel' },
  { name: 'cable crunch', bodyPart: 'waist', target: 'abs', equipment: 'cable' },

  // Cardio exercises
  { name: 'running', bodyPart: 'cardio', target: 'cardiovascular', equipment: 'body weight' },
  { name: 'treadmill', bodyPart: 'cardio', target: 'cardiovascular', equipment: 'machine' },
  { name: 'cycling', bodyPart: 'cardio', target: 'cardiovascular', equipment: 'machine' },
  { name: 'rowing', bodyPart: 'cardio', target: 'cardiovascular', equipment: 'machine' },
  { name: 'elliptical', bodyPart: 'cardio', target: 'cardiovascular', equipment: 'machine' },
  { name: 'jump rope', bodyPart: 'cardio', target: 'cardiovascular', equipment: 'rope' },
  { name: 'burpee', bodyPart: 'cardio', target: 'cardiovascular', equipment: 'body weight' },
  { name: 'box jump', bodyPart: 'cardio', target: 'cardiovascular', equipment: 'body weight' },

  // Compound/Olympic lifts
  { name: 'power clean', bodyPart: 'upper legs', target: 'glutes', equipment: 'barbell' },
  { name: 'clean and jerk', bodyPart: 'upper legs', target: 'glutes', equipment: 'barbell' },
  { name: 'snatch', bodyPart: 'upper legs', target: 'glutes', equipment: 'barbell' },
  { name: 'sumo deadlift', bodyPart: 'upper legs', target: 'glutes', equipment: 'barbell' },
  { name: 'good morning', bodyPart: 'upper legs', target: 'hamstrings', equipment: 'barbell' },
]

/**
 * Search default exercises by name
 */
export function searchDefaultExercises(query: string, limit = 10): DefaultExercise[] {
  if (!query || query.trim() === '') {
    return defaultExercises.slice(0, limit)
  }

  const lowerQuery = query.toLowerCase().trim()

  const results = defaultExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(lowerQuery) ||
    exercise.bodyPart.toLowerCase().includes(lowerQuery) ||
    exercise.target.toLowerCase().includes(lowerQuery)
  )

  return results.slice(0, limit)
}
