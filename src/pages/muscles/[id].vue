<template>
  <TdLayout is-back title="Изменение мышцы">
    <v-container class="pb-16">
      <v-text-field
        v-model="current.name"
        label="Имя"
        @change="current.name = $event.trim()"
        @update:model-value="changed = true"
      />
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
  import MuscleModel from '@/core/entities/muscle/MuscleModel'
  import { useAppStore } from '@/stores/app'
  import { computed, ref } from 'vue'
  import { onBeforeRouteLeave, useRoute } from 'vue-router'

  const route = useRoute()
  const appStore = useAppStore()

  const currentId = 'id' in route.params ? +route.params.id : 0

  /** Что-то было изменено */
  const changed = ref(false)
  const current = computed(() => (
    appStore.muscles.find(e => e.id === currentId) || new MuscleModel()
  ))

  const save = async () => {
    await appStore.saveTrainings()
    changed.value = false
    appStore.addToast('Успешно сохранено')
    return true
  }

  onBeforeRouteLeave(async () => !changed.value || save())
</script>
