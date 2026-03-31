<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const isOpen = ref(false)
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    setTimeout(() => inputRef.value?.focus(), 100)
  } else {
    query.value = ''
  }
}

function submit() {
  const q = query.value.trim()
  if (q) {
    router.push({ name: 'browse', query: { q } })
    isOpen.value = false
    query.value = ''
  }
}
</script>

<template>
  <div class="relative flex items-center">
    <button
      @click="toggle"
      class="p-2 text-gray-300 hover:text-white transition-colors"
      :aria-label="t('search.label')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
    </button>
    <Transition name="search">
      <input
        v-if="isOpen"
        ref="inputRef"
        v-model="query"
        @keydown.enter="submit"
        @keydown.escape="toggle"
        type="text"
        :placeholder="t('search.placeholder')"
        class="absolute right-10 top-1/2 -translate-y-1/2 w-56 bg-gray-900/90 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-all"
      />
    </Transition>
  </div>
</template>

<style scoped>
.search-enter-active,
.search-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.search-enter-from,
.search-leave-to {
  opacity: 0;
  transform: translateY(-50%) scaleX(0.8);
}
</style>
