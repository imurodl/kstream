<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from '../stores/category'
import type { Category } from '../config/categories'

const { t } = useI18n()
const categoryStore = useCategoryStore()
defineProps<{ category: Category }>()
</script>

<template>
  <button
    @click="categoryStore.setActive(category.key)"
    class="flex-shrink-0 w-36 sm:w-40 aspect-[16/9] rounded-lg flex flex-col items-center justify-center gap-2 border transition-all"
    :class="category.key === categoryStore.activeKey
      ? 'bg-purple-600/20 border-purple-500 text-white'
      : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:border-gray-600 hover:text-white'"
  >
    <span class="text-3xl">{{ category.emoji }}</span>
    <span class="text-sm font-medium">{{ t(category.labelKey) }}</span>
  </button>
</template>
