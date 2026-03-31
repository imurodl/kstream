import { ref, onMounted, onUnmounted } from 'vue'

export function useScrolled(threshold = 50) {
  const isScrolled = ref(false)

  function onScroll() {
    isScrolled.value = window.scrollY > threshold
  }

  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  return { isScrolled }
}
