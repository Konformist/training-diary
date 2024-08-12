<template>
  <v-btn
    append-icon="$triangle-small-down"
    rounded="1"
    size="small"
    :text="tagName"
    variant="outlined"
    @click="dialogFilter = true"
  />
  <TdBottomSheetFilter
    v-model="trainingsPageStore.options.tagId"
    v-model:opened="dialogFilter"
    :items="tagsItems"
    title="Метка"
  />
</template>

<script setup lang="ts">
  import { withZero } from '@/core/utils/items'
  import { useAppStore } from '@/stores/app'
  import useTrainingsPageStore from '@/stores/trainingsPage'
  import { computed, ref } from 'vue'

  const appStore = useAppStore()
  const trainingsPageStore = useTrainingsPageStore()

  const dialogFilter = ref(false)

  const tagsItems = computed(() => withZero(appStore.tags, true))
  const tagName = computed(() => (
    appStore.tags.find(e => e.id === trainingsPageStore.options.tagId)?.name || 'Метка'
  ))
</script>
