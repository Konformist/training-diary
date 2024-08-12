<template>
  <v-main>
    <v-container>
      <v-label class="mb-4" text="Тема приложения" />
      <v-btn-toggle
        v-model="appStore.darkMode"
        class="d-flex"
        color="secondary"
        @update:model-value="setDarkMode($event)"
      >
        <v-btn class="flex-grow-1" text="Светлая" value="light" />
        <v-btn class="flex-grow-1" text="Темная" value="dark" />
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
  </v-main>
</template>

<script setup lang="ts">
  import { StoreNames } from '@/core/dictionaries/storeNames'
  import { fileToJson } from '@/core/utils/files'
  import { openLink } from '@/core/utils/links'
  import { IStorageTraining, TThemes, useAppStore } from '@/stores/app'
  import { Capacitor } from '@capacitor/core'
  import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
  import { useTheme } from 'vuetify'

  definePage({
    meta: { title: 'Настройки' },
  })

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
    openLink({
      href: `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(appStore.savedData))}`,
      download: fileName,
    })
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
      if (Capacitor.isNativePlatform()) await backupFile()
      else backupWeb()
      appStore.addToast('Данные успешно выгружены')
    } catch (e: any) {
      appStore.addToast({ color: 'negative', text: 'Не удалось выгрузить данные' })
    }
  }

  const setDarkMode = (value: TThemes) => {
    theme.global.name.value = value
    appStore.darkMode = value
    appStore.saveSettings()
  }
</script>
