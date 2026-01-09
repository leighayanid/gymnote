<template>
  <div class="w-full">
    <ClientOnly>
      <div v-if="chartData.length > 0" :style="{ height: `${height}px` }">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart :data="chartData" :margin="{ top: 10, right: 10, left: 10, bottom: 20 }">
            <CartesianGrid stroke-dasharray="3 3" :stroke="gridColor" />
            <XAxis
              dataKey="week"
              :tick="{ fill: textColor, fontSize: 12 }"
              :stroke="axisColor"
            />
            <YAxis
              :tick="{ fill: textColor, fontSize: 12 }"
              :stroke="axisColor"
              :label="{ value: 'Volume (lbs)', angle: -90, position: 'insideLeft', fill: textColor }"
            />
            <Tooltip :content="CustomTooltip" />
            <Bar dataKey="volume" :fill="barColor" radius="[8, 8, 0, 0]" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <ChartBarIcon class="w-12 h-12 mb-2 opacity-50" />
        <p class="text-sm">No volume data available yet</p>
        <p class="text-xs mt-1">Start tracking workouts to see your progress</p>
      </div>

      <template #fallback>
        <div class="flex items-center justify-center py-12">
          <div class="animate-pulse flex flex-col items-center gap-2">
            <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import type { WeeklyVolumeData } from '~/composables/useVolumeStats'

const props = withDefaults(
  defineProps<{
    data: WeeklyVolumeData[]
    height?: number
  }>(),
  {
    height: 300
  }
)

const { colorMode } = useTheme()

const chartData = computed(() => props.data)

// Dynamic colors based on theme
const barColor = computed(() => '#6f58c9') // Primary color
const textColor = computed(() => colorMode.value === 'dark' ? '#9ca3af' : '#4b5563')
const gridColor = computed(() => colorMode.value === 'dark' ? '#374151' : '#e5e7eb')
const axisColor = computed(() => colorMode.value === 'dark' ? '#4b5563' : '#d1d5db')

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload

  return h('div', {
    class: 'bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'
  }, [
    h('p', {
      class: 'text-sm font-semibold text-gray-900 dark:text-white mb-1'
    }, data.week),
    h('p', {
      class: 'text-sm text-gray-600 dark:text-gray-400'
    }, `Volume: ${data.volume.toLocaleString()} lbs`),
    data.change !== 0 && h('p', {
      class: `text-xs mt-1 ${data.change > 0 ? 'text-green-600' : 'text-red-600'}`
    }, `${data.change > 0 ? '↑' : '↓'} ${Math.abs(data.change)}% from last week`)
  ])
}
</script>
