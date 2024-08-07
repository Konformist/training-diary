<template>
  <router-view v-slot="{ Component, route: routeLocal }">
    <component :is="Component" :key="routeLocal.path" />
  </router-view>
  <v-snackbar-queue
    v-model="appStore.toasts"
    close-on-content-click
    color="success"
    :timeout="2000"
  >
    <template #actions>
      <v-icon class="mr-2" icon="$window-close" />
    </template>
  </v-snackbar-queue>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title />
      <v-card-text>
        Доступна новая версия, скачать?
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="secondary"
          text="Нет"
          @click="dialog = false"
        />
        <v-btn
          download
          :href="fileVersionLink"
          text="Да"
          @click="dialog = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
  const route = useRoute()
  const router = useRouter()

  window.addEventListener('popstate', evt => {
    if (evt.state.current !== '/' && !route.name.includes('[id]')) {
      router.push({ name: '/' })
    }
  })

  const dialog = ref(false)
  const fileVersionLink = ref('')

  const init = async () => {
    await appStore.getPlatformInfo()
    appStore.loadSettings()
    await appStore.loadTrainings()
    await appStore.migrationDB()
    fileVersionLink.value = await appStore.checkVersion()
    dialog.value = !!fileVersionLink.value
  }

  init()
</script>
