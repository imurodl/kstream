<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'

const router = useRouter()
const routeLoading = ref(false)

router.beforeEach(() => { routeLoading.value = true })
router.afterEach(() => { setTimeout(() => { routeLoading.value = false }, 150) })
</script>

<template>
  <div class="min-h-screen bg-[#0f0f0f] text-gray-200 flex flex-col">
    <!-- Route loading bar -->
    <div
      class="fixed top-0 left-0 h-0.5 bg-purple-500 z-[60] transition-all duration-300"
      :class="routeLoading ? 'w-4/5 opacity-100' : 'w-full opacity-0'"
    />
    <AppNavbar />
    <main class="flex-1 pt-16">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>
