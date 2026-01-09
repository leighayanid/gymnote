<template>
  <button
    :class="[
      'fixed z-50 flex items-center justify-center rounded-full shadow-lg transition-all duration-200',
      'bg-primary-500 hover:bg-primary-600 active:scale-95',
      'text-white',
      sizeClasses,
      positionClasses
    ]"
    @click="handleClick"
  >
    <component :is="icon" v-if="icon" class="w-6 h-6" />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

const props = withDefaults(
  defineProps<{
    icon?: any
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    icon: PlusIcon,
    position: 'bottom-right',
    size: 'md'
  }
)

const emit = defineEmits<{
  click: []
}>()

const { hapticMedium } = useHaptics()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-12 h-12'
    case 'lg':
      return 'w-16 h-16'
    default:
      return 'w-14 h-14'
  }
})

const positionClasses = computed(() => {
  // Adjust for mobile bottom nav (80px from bottom on mobile)
  const mobileBottomOffset = 'bottom-20'
  const desktopBottomOffset = 'lg:bottom-8'

  switch (props.position) {
    case 'bottom-left':
      return `${mobileBottomOffset} ${desktopBottomOffset} left-6 lg:left-8`
    case 'top-right':
      return 'top-6 lg:top-8 right-6 lg:right-8'
    case 'top-left':
      return 'top-6 lg:top-8 left-6 lg:left-8'
    default: // bottom-right
      return `${mobileBottomOffset} ${desktopBottomOffset} right-6 lg:right-8`
  }
})

const handleClick = () => {
  hapticMedium()
  emit('click')
}
</script>
