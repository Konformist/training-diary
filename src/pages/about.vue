<template>
  <v-main>
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item"
        :title="item.key"
      >
        <template #append>
          <v-list-item-subtitle>
            {{ item.value }}
          </v-list-item-subtitle>
        </template>
      </v-list-item>
    </v-list>
  </v-main>
</template>

<script setup lang="ts">
  import { useAppStore } from '@/stores/app'
  import { Capacitor } from '@capacitor/core'

  definePage({
    meta: { title: 'О приложении' },
  })

  const appStore = useAppStore()

  const items = computed(() => {
    const arr = [{ key: 'Версия Web', value: appStore.appInfo.frontVersion }]
    if (Capacitor.isNativePlatform()) arr.push({ key: 'Версия приложения', value: appStore.appInfo.platformAppVersion })
    return arr
  })
</script>
