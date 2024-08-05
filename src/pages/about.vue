<template>
  <TdLayout title="О приложении">
    <v-container class="pa-0">
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
    </v-container>
  </TdLayout>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()

  const items = computed(() => {
    const arr = [{ key: 'Версия Web', value: appStore.appInfo.frontVersion }]
    if (appStore.appInfo.platform) arr.push({ key: 'Версия приложения', value: appStore.appInfo.platformAppVersion })
    return arr
  })
</script>
