<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Show } from '../types'
import { useDragScroll } from '../composables/useDragScroll'
import ContentCard from './ContentCard.vue'
import SkeletonCard from './SkeletonCard.vue'

const { t } = useI18n()

defineProps<{
  title: string
  shows: Show[]
  loading?: boolean
}>()

const scrollContainer = ref<HTMLElement | null>(null)
useDragScroll(scrollContainer)

function scroll(direction: 'left' | 'right') {
  if (!scrollContainer.value) return
  const amount = scrollContainer.value.clientWidth * 0.75
  scrollContainer.value.scrollBy({
    left: direction === 'left' ? -amount : amount,
    behavior: 'smooth',
  })
}
</script>

<template>
  <section class="mb-8">
    <div class="flex items-center justify-between mb-3 px-4 sm:px-6 lg:px-8">
      <h2 class="text-lg sm:text-xl font-semibold text-white">{{ title }}</h2>
      <div class="hidden sm:flex gap-1">
        <button
          @click="scroll('left')"
          class="p-1.5 rounded-full bg-gray-800/60 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          :aria-label="t('content.scrollLeft')"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          @click="scroll('right')"
          class="p-1.5 rounded-full bg-gray-800/60 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          :aria-label="t('content.scrollRight')"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
    <div
      ref="scrollContainer"
      class="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide"
    >
      <template v-if="loading">
        <SkeletonCard v-for="i in 8" :key="i" />
      </template>
      <template v-else>
        <ContentCard
          v-for="show in shows"
          :key="show.id"
          :show="show"
          class="snap-start"
        />
      </template>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
