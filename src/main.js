import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import NovaLight from '@primeuix/themes/aura'
import App from './App.vue'
import router from './router' 

// PrimeFlex и PrimeIcons
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: NovaLight,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
})
app.use(router)  // подключаем роутер
app.mount('#app')