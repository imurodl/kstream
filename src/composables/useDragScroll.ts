import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useDragScroll(containerRef: Ref<HTMLElement | null>) {
  const isDragging = ref(false)
  let startX = 0
  let scrollLeft = 0

  function onMouseDown(e: MouseEvent) {
    if (!containerRef.value) return
    isDragging.value = true
    startX = e.pageX - containerRef.value.offsetLeft
    scrollLeft = containerRef.value.scrollLeft
    containerRef.value.style.cursor = 'grabbing'
    containerRef.value.style.userSelect = 'none'
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging.value || !containerRef.value) return
    e.preventDefault()
    const x = e.pageX - containerRef.value.offsetLeft
    const walk = (x - startX) * 1.5
    containerRef.value.scrollLeft = scrollLeft - walk
  }

  function onMouseUp() {
    if (!containerRef.value) return
    isDragging.value = false
    containerRef.value.style.cursor = 'grab'
    containerRef.value.style.removeProperty('user-select')
  }

  onMounted(() => {
    const el = containerRef.value
    if (!el) return
    el.style.cursor = 'grab'
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  })

  onBeforeUnmount(() => {
    const el = containerRef.value
    if (el) el.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  })

  return { isDragging }
}
