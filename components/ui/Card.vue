<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
      <slot name="header" />
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: boolean
  hover?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: true,
  hover: false,
  clickable: false
})

const cardClasses = computed(() => {
  return [
    'bg-white dark:bg-gray-800',
    'rounded-xl',
    'border border-gray-200 dark:border-gray-700',
    'shadow-sm',
    props.hover ? 'hover:shadow-md transition-shadow duration-200' : '',
    props.clickable ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''
  ].filter(Boolean).join(' ')
})

const bodyClasses = computed(() => {
  return props.padding ? 'px-5 py-4' : ''
})
</script>
