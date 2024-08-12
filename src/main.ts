/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import { useAppStore } from '@/stores/app'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

const init = async () => {
  const appStore = useAppStore()
  await Promise.all([
    appStore.getPlatformInfo(),
    appStore.loadSettings(),
    appStore.loadTrainings(),
    appStore.checkVersion(),
  ])
  appStore.migrationDB()

  app.mount('#app')
}

init()
