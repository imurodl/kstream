<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="border-t border-gray-800 bg-[#0a0a0a] mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <span class="text-lg font-bold text-white tracking-wider">KSTREAM</span>
          <p class="text-sm text-gray-500 mt-2 leading-relaxed">
            {{ t('footer.description') }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-300 mb-3">{{ t('footer.project') }}</h3>
          <ul class="space-y-2">
            <li>
              <a href="https://github.com/imurodl/kstream" target="_blank" rel="noopener" class="text-sm text-gray-500 hover:text-purple-400 transition-colors">
                {{ t('footer.sourceCode') }}
              </a>
            </li>
            <li>
              <a href="https://github.com/imurodl/kstream#tech-stack" target="_blank" rel="noopener" class="text-sm text-gray-500 hover:text-purple-400 transition-colors">
                {{ t('footer.techStack') }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-300 mb-3">{{ t('footer.author') }}</h3>
          <ul class="space-y-2">
            <li>
              <a href="https://imurodl.me" target="_blank" rel="noopener" class="text-sm text-gray-500 hover:text-purple-400 transition-colors">
                imurodl.me
              </a>
            </li>
            <li>
              <a href="https://github.com/imurodl" target="_blank" rel="noopener" class="text-sm text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-gray-800 text-center sm:text-left">
        <p class="text-xs text-gray-600">{{ t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
      </div>
    </div>
  </footer>
</template>
