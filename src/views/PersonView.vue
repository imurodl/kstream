<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { PersonDetail, PersonCredit } from '../types'
import { getPersonDetail, getPersonTVCredits, profileUrl } from '../services/tmdb'
import ContentCard from '../components/ContentCard.vue'

const { t } = useI18n()
const route = useRoute()

const person = ref<PersonDetail | null>(null)
const credits = ref<PersonCredit[]>([])
const loading = ref(true)

const personId = computed(() => Number(route.params.id))

const bioTruncated = computed(() => {
  const text = person.value?.biography || ''
  return text.length > 500 ? text.slice(0, 500) + '...' : text
})

const showsAsCards = computed(() =>
  credits.value
    .filter(c => c.poster_path)
    .sort((a, b) => b.popularity - a.popularity)
    .map(c => ({
      id: c.id,
      name: c.name,
      original_name: c.name,
      overview: '',
      poster_path: c.poster_path,
      backdrop_path: null,
      vote_average: c.vote_average,
      vote_count: 0,
      first_air_date: c.first_air_date,
      genre_ids: [],
      origin_country: [],
      original_language: 'ko',
      popularity: c.popularity,
    }))
)

onMounted(async () => {
  try {
    const [personRes, creditsRes] = await Promise.all([
      getPersonDetail(personId.value),
      getPersonTVCredits(personId.value),
    ])
    person.value = personRes
    credits.value = creditsRes.cast
  } catch (e) {
    // failed to load
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-6">
      <div class="flex gap-6">
        <div class="w-40 h-40 rounded-full bg-gray-800 flex-shrink-0" />
        <div class="flex-1 space-y-3 pt-4">
          <div class="h-8 w-48 bg-gray-800 rounded" />
          <div class="h-4 w-32 bg-gray-800/60 rounded" />
          <div class="h-4 w-full bg-gray-800/40 rounded" />
          <div class="h-4 w-3/4 bg-gray-800/40 rounded" />
        </div>
      </div>
    </div>

    <template v-else-if="person">
      <!-- Person info -->
      <div class="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-10">
        <div class="flex-shrink-0 mx-auto sm:mx-0">
          <div class="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-gray-800">
            <img
              v-if="person.profile_path"
              :src="profileUrl(person.profile_path, 'w300')"
              :alt="person.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
              </svg>
            </div>
          </div>
        </div>

        <div class="flex-1 text-center sm:text-left">
          <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3">{{ person.name }}</h1>

          <div class="space-y-2 text-sm text-gray-400 mb-4">
            <p v-if="person.birthday">
              <span class="text-gray-500">{{ t('person.born') }}:</span> {{ person.birthday }}
              <span v-if="person.place_of_birth"> — {{ person.place_of_birth }}</span>
            </p>
            <p v-if="person.also_known_as?.length">
              <span class="text-gray-500">{{ t('person.knownAs') }}:</span> {{ person.also_known_as.join(', ') }}
            </p>
          </div>

          <p v-if="bioTruncated" class="text-sm text-gray-300 leading-relaxed max-w-2xl">
            {{ bioTruncated }}
          </p>
        </div>
      </div>

      <!-- TV Credits -->
      <div>
        <h2 class="text-xl font-semibold text-white mb-6">{{ t('person.filmography') }}</h2>

        <div v-if="showsAsCards.length === 0" class="text-center py-12">
          <p class="text-gray-500">{{ t('person.noShows') }}</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <ContentCard
            v-for="show in showsAsCards"
            :key="show.id"
            :show="show"
            class="!w-full"
          />
        </div>
      </div>
    </template>
  </div>
</template>
