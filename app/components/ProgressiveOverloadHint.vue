<template>
  <div v-if="previousData" class="text-sm space-y-1">
    <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
      <ChartBarIcon class="w-4 h-4 flex-shrink-0" />
      <span class="text-xs">Last time:</span>
      <span class="font-medium">
        {{ previousData.sets }}×{{ previousData.reps }}
        <span v-if="previousData.weight">@ {{ previousData.weight }} lbs</span>
      </span>
    </div>

    <!-- Comparison -->
    <div v-if="comparison" class="flex items-center gap-2">
      <component
        :is="comparison.icon"
        :class="[
          'w-4 h-4 flex-shrink-0',
          comparison.color
        ]"
      />
      <span :class="['text-xs font-medium', comparison.color]">
        {{ comparison.message }}
      </span>
    </div>
  </div>

  <div v-else-if="!loading" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
    <SparklesIcon class="w-4 h-4" />
    <span>First time doing this exercise!</span>
  </div>
</template>

<script setup lang="ts">
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon, SparklesIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  exerciseName: string
  currentWeight: number | null
  currentSets: number
  currentReps: number
}>()

const loading = ref(true)
const previousData = ref<any>(null)

const { getPreviousExerciseData } = useExerciseHistory()

const comparison = computed(() => {
  if (!previousData.value || !props.currentWeight) return null

  const prevWeight = previousData.value.weight || 0
  const currWeight = props.currentWeight

  // Weight comparison
  if (currWeight > prevWeight) {
    const diff = currWeight - prevWeight
    return {
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600 dark:text-green-400',
      message: `+${diff} lbs increase! 💪`
    }
  } else if (currWeight < prevWeight) {
    const diff = prevWeight - currWeight
    return {
      icon: ArrowTrendingDownIcon,
      color: 'text-orange-600 dark:text-orange-400',
      message: `-${diff} lbs from last time`
    }
  } else {
    // Same weight - check volume (sets × reps)
    const prevVolume = previousData.value.sets * previousData.value.reps
    const currVolume = props.currentSets * props.currentReps

    if (currVolume > prevVolume) {
      return {
        icon: ArrowTrendingUpIcon,
        color: 'text-green-600 dark:text-green-400',
        message: 'More volume than last time! 🔥'
      }
    } else if (currVolume < prevVolume) {
      return {
        icon: ArrowTrendingDownIcon,
        color: 'text-orange-600 dark:text-orange-400',
        message: 'Less volume than last time'
      }
    } else {
      return {
        icon: MinusIcon,
        color: 'text-gray-600 dark:text-gray-400',
        message: 'Same as last time - ready to progress?'
      }
    }
  }
})

onMounted(async () => {
  try {
    const data = await getPreviousExerciseData(props.exerciseName)
    previousData.value = data
  } catch (error) {
    console.error('Error loading previous data:', error)
  } finally {
    loading.value = false
  }
})
</script>
