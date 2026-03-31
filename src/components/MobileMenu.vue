<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const links = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/browse', labelKey: 'nav.browse' },
  { to: '/watchlist', labelKey: 'nav.watchlist' },
]
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="open"
        class="fixed inset-0 bg-black/60 z-40"
        @click="emit('close')"
      />
    </Transition>
    <Transition name="drawer">
      <nav
        v-if="open"
        class="fixed top-0 left-0 h-full w-64 bg-[#141414] z-50 flex flex-col p-6"
      >
        <button
          @click="emit('close')"
          class="self-end mb-8 text-gray-400 hover:text-white"
          :aria-label="t('nav.closeMenu')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          @click="emit('close')"
          class="text-lg text-gray-300 hover:text-white py-3 border-b border-gray-800 transition-colors"
          active-class="!text-purple-400"
        >
          {{ t(link.labelKey) }}
        </RouterLink>
      </nav>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}
</style>
