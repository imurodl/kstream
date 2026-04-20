import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { CATEGORIES, DEFAULT_CATEGORY, getCategory, type CategoryKey } from '../config/categories'

const STORAGE_KEY = 'kstream-active-category'

function loadInitial(): CategoryKey {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && CATEGORIES.some(c => c.key === stored)) {
    return stored as CategoryKey
  }
  return DEFAULT_CATEGORY
}

export const useCategoryStore = defineStore('category', () => {
  const activeKey = ref<CategoryKey>(loadInitial())
  const active = computed(() => getCategory(activeKey.value))
  const all = computed(() => CATEGORIES)

  watch(activeKey, (val) => localStorage.setItem(STORAGE_KEY, val))

  function setActive(key: CategoryKey) {
    activeKey.value = key
  }

  return { activeKey, active, all, setActive }
})
