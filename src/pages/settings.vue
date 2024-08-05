<template>
  <TdLayout title="Настройки">
    <v-container>
      <v-label class="mb-4" text="Тема приложения" />
      <v-btn-toggle
        v-model="appStore.darkMode"
        class="d-flex"
        color="secondary"
        @update:model-value="setDarkMode($event)"
      >
        <v-btn class="flex-grow-1" text="Светлая" :value="false" />
        <v-btn class="flex-grow-1" text="Темная" :value="true" />
      </v-btn-toggle>
      <v-divider class="my-4" />
      <v-label class="mb-4" text="Экспорт и импорт данных" />
      <v-file-input
        v-model="fileDB"
        label="Импорт данных из файла"
        @update:model-value="readFile()"
      />
      <v-btn
        block
        color="secondary"
        text="Экспорт данных в файл"
        @click="backup()"
      />
    </v-container>
  </TdLayout>
</template>

<script setup lang="ts">
  import { StoreNames } from '@/core/dictionaries/storeNames'
  import { fileToJson } from '@/core/utils/files'
  import { IStorageTraining, useAppStore } from '@/stores/app'
  import { ref } from 'vue'
  import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
  import { useTheme } from 'vuetify'

  const theme = useTheme()
  const appStore = useAppStore()

  const fileDB = ref<File>()

  const readFile = async () => {
    if (!fileDB.value) return

    const result = await fileToJson<IStorageTraining>(fileDB.value)

    appStore.setSavedData(result)
    await appStore.migrationDB()
    await appStore.saveTrainings()
    appStore.addToast('Данные успешно импортированы')
  }

  const fileName = `${StoreNames.TRAININGS}-${(new Date()).toLocaleDateString('ru')}.json`

  const backupWeb = () => {
    const encodedUri = encodeURIComponent(JSON.stringify(appStore.savedData))
    const link = document.createElement('a')

    link.setAttribute('href', `data:text/json;charset=utf-8,${encodedUri}`)
    link.setAttribute('download', fileName)
    document.body.appendChild(link) // Required for FF
    link.click()
    document.body.removeChild(link) // Required for FF
  }

  const backupFile = () => (
    Filesystem.writeFile({
      directory: Directory.Documents,
      path: `Training Diary/${fileName}`,
      recursive: true,
      encoding: Encoding.UTF8,
      data: JSON.stringify(appStore.savedData),
    })
  )

  const backup = async () => {
    try {
      if (appStore.appInfo.platform === 'web') backupWeb()
      else await backupFile()
      appStore.addToast('Данные успешно выгружены')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      appStore.addToast({ color: 'negative', text: 'Не удалось выгрузить данные' })
    }
  }

  const setDarkMode = (value: boolean|'auto') => {
    theme.global.name.value = value ? 'myCustomDarkTheme' : 'light'
    appStore.darkMode = value
    appStore.saveSettings()
  }
</script>
