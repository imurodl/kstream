<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useScrolled } from '../composables/useScrolled'
import SearchBar from './SearchBar.vue'
import MobileMenu from './MobileMenu.vue'

const { isScrolled } = useScrolled()
const mobileMenuOpen = ref(false)

const links = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/watchlist', label: 'Watchlist' },
]
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'bg-[#0f0f0f]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="text-xl font-bold text-white tracking-wider">
        KSTREAM
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-sm text-gray-300 hover:text-white transition-colors"
          active-class="!text-white font-medium"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-2">
        <SearchBar />

        <!-- Mobile hamburger -->
        <button
          @click="mobileMenuOpen = true"
          class="md:hidden p-2 text-gray-300 hover:text-white"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <MobileMenu :open="mobileMenuOpen" @close="mobileMenuOpen = false" />
  </header>
</template>
