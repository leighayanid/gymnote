import { localDB } from '~/utils/db'
import type { WorkoutTemplate } from '~/types'

const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'full-body',
    name: 'Full Body',
    lastUsed: null,
    usageCount: 0,
    exercises: [
      { name: 'Squat', sets: 3, reps: 10 },
      { name: 'Bench Press', sets: 3, reps: 8 },
      { name: 'Bent-Over Row', sets: 3, reps: 10 },
      { name: 'Plank', sets: 3, reps: 30 }
    ]
  },
  {
    id: 'push-day',
    name: 'Push Day',
    lastUsed: null,
    usageCount: 0,
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8 },
      { name: 'Overhead Press', sets: 3, reps: 8 },
      { name: 'Tricep Dips', sets: 3, reps: 10 },
      { name: 'Lateral Raises', sets: 3, reps: 12 }
    ]
  },
  {
    id: 'pull-day',
    name: 'Pull Day',
    lastUsed: null,
    usageCount: 0,
    exercises: [
      { name: 'Deadlift', sets: 3, reps: 5 },
      { name: 'Pull-Ups', sets: 3, reps: 0, weight: 0 }, // AMRAP
      { name: 'Barbell Row', sets: 3, reps: 8 },
      { name: 'Bicep Curls', sets: 3, reps: 12 }
    ]
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    lastUsed: null,
    usageCount: 0,
    exercises: [
      { name: 'Squat', sets: 4, reps: 6 },
      { name: 'Romanian Deadlift', sets: 3, reps: 8 },
      { name: 'Lunges', sets: 3, reps: 10 },
      { name: 'Calf Raises', sets: 3, reps: 15 }
    ]
  }
]

export const useTemplates = () => {
  const templates = useState<WorkoutTemplate[]>('templates', () => [])
  const loading = useState('templates-loading', () => false)

  const loadTemplates = async () => {
    loading.value = true
    try {
      await localDB.init()
      const storedTemplates = await localDB.getTemplates()

      if (storedTemplates.length === 0) {
        // Seed default templates
        for (const template of DEFAULT_TEMPLATES) {
          await localDB.saveTemplate(template)
        }
        templates.value = DEFAULT_TEMPLATES
      } else {
        // Sort by lastUsed DESC (most recent first), then by name
        templates.value = storedTemplates.sort((a, b) => {
          if (!a.lastUsed && !b.lastUsed) return a.name.localeCompare(b.name)
          if (!a.lastUsed) return 1
          if (!b.lastUsed) return -1
          return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
        })
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
      templates.value = DEFAULT_TEMPLATES
    } finally {
      loading.value = false
    }
  }

  const createWorkoutFromTemplate = async (templateId: string): Promise<void> => {
    const template = templates.value.find(t => t.id === templateId)
    if (!template) throw new Error('Template not found')

    const { createWorkout } = useWorkouts()

    await createWorkout({
      date: new Date(),
      notes: `Started from ${template.name} template`,
      exercises: template.exercises.map(e => ({
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight
      }))
    })

    // Update template lastUsed and usageCount
    const updatedTemplate: WorkoutTemplate = {
      ...template,
      lastUsed: new Date(),
      usageCount: template.usageCount + 1
    }

    await saveTemplate(updatedTemplate)
  }

  const saveTemplate = async (template: WorkoutTemplate) => {
    await localDB.init()
    await localDB.saveTemplate(template)
    await loadTemplates()
  }

  return {
    templates,
    loading,
    loadTemplates,
    createWorkoutFromTemplate,
    saveTemplate
  }
}
