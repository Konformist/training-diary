<template>
  <TdLayout is-back title="Изменение метки">
    <v-container class="pb-16">
      <v-text-field
        v-model="current.name"
        label="Имя"
        @change="current.name = $event.trim()"
        @update:model-value="changed = true"
      />
      <v-label class="mb-1" text="Цвет метки" />
      <v-chip-group v-model="current.color" column>
        <v-chip
          v-for="item in paletteItems"
          :key="item.id"
          class="flex-grow-1"
          :color="item.color"
          :text="item.color || 'Не задан'"
          :value="item.id"
        />
      </v-chip-group>
    </v-container>
    <template #footer>
      <v-fab
        app
        appear
        class="me-4"
        icon="$content-save"
        location="bottom end"
        size="large"
        @click="save()"
      />
    </template>
  </TdLayout>
</template>

<script setup lang="ts">
  import { palette } from '@/core/dictionaries/colors'
  import TagModel from '@/core/entities/tag/TagModel'
  import { useAppStore } from '@/stores/app'
  import { computed, ref } from 'vue'
  import { onBeforeRouteLeave, useRoute } from 'vue-router'

  const route = useRoute()
  const appStore = useAppStore()

  const paletteItems = palette.map((e, i) => ({
    id: i,
    name: e,
    color: e,
  }))

  const currentId = 'id' in route.params ? +route.params.id : 0

  /** Что-то было изменено */
  const changed = ref(false)
  const current = computed(() => (
    appStore.tags.find(e => e.id === currentId) || new TagModel()
  ))

  const save = async () => {
    await appStore.saveTrainings()
    changed.value = false
    appStore.addToast('Успешно сохранено')
    return true
  }

  onBeforeRouteLeave(async () => !changed.value || save())
</script>
