<script setup lang="ts">
defineProps<{
  label: string
  active: boolean
}>()

defineEmits<{ click: [] }>()
</script>

<template>
  <button
    @click="$emit('click')"
    class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
    :class="active
      ? 'bg-white text-black'
      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'"
  >
    {{ label }}
  </button>
</template>
