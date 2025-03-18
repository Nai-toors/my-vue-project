import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import NovaLight from '@primeuix/themes/aura'
import App from './App.vue'
import router from './router' 
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// PrimeFlex и PrimeIcons
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia)
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