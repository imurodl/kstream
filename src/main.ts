import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import router from './router'
import App from './App.vue'
import en from './locales/en'
import ko from './locales/ko'
import './style.css'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('kstream-locale') || 'en',
  fallbackLocale: 'en',
  messages: { en, ko },
})

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.use(router)
app.mount('#app')
