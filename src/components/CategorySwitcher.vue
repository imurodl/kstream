<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from '../stores/category'
import type { CategoryKey } from '../config/categories'

const { t } = useI18n()
const categoryStore = useCategoryStore()
const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

function toggle() { open.value = !open.value }
function pick(key: CategoryKey) {
  categoryStore.setActive(key)
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (open.value && rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      @click="toggle"
      class="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded border border-gray-700 hover:border-gray-500 transition-colors"
    >
      <span>{{ categoryStore.active.emoji }}</span>
      <span class="hidden sm:inline">{{ t(categoryStore.active.shortLabelKey) }}</span>
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-44 bg-[#141414] border border-gray-800 rounded-lg shadow-xl py-1 z-50"
      >
        <p class="px-3 pt-1 pb-1 text-[10px] uppercase tracking-wider text-gray-500">
          {{ t('category.label') }}
        </p>
        <button
          v-for="cat in categoryStore.all"
          :key="cat.key"
          @click="pick(cat.key)"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-800/80 transition-colors"
          :class="cat.key === categoryStore.activeKey ? 'text-white font-medium' : 'text-gray-300'"
        >
          <span class="text-base">{{ cat.emoji }}</span>
          <span class="flex-1">{{ t(cat.labelKey) }}</span>
          <svg
            v-if="cat.key === categoryStore.activeKey"
            class="w-4 h-4 text-purple-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
