<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CastMember } from '../types'
import { profileUrl } from '../services/tmdb'

defineProps<{ cast: CastMember }>()
</script>

<template>
  <RouterLink
    :to="{ name: 'person', params: { id: cast.id } }"
    class="flex-shrink-0 w-28 sm:w-32 group text-center"
  >
    <div class="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden bg-gray-800">
      <img
        v-if="cast.profile_path"
        :src="profileUrl(cast.profile_path)"
        :alt="cast.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
        </svg>
      </div>
    </div>
    <p class="mt-2 text-xs sm:text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
      {{ cast.name }}
    </p>
    <p class="text-xs text-gray-500 truncate">{{ cast.character }}</p>
  </RouterLink>
</template>
