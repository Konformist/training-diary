<template>
  <v-main>
    <v-container class="pb-fab">
      <v-text-field
        v-model="current.name"
        class="mb-4"
        label="Имя"
        @change="current.name = current.name.trim()"
        @update:model-value="changed = true"
      />
      <v-select
        v-model="current.muscle_group_id"
        class="mb-4"
        :items="musclesItems"
        label="Мышца"
        @update:model-value="changed = true"
      />
      <v-select
        v-model="current.equipment_id"
        :items="equipmentsItems"
        label="Инвентарь"
        @update:model-value="changed = true"
      />
    </v-container>
    <v-fab
      app
      appear
      class="me-4"
      icon="$content-save"
      location="bottom end"
      size="large"
      @click="save()"
    />
  </v-main>
</template>

<script setup lang="ts">
  import ExerciseModel from '@/core/entities/exercise/ExerciseModel'
  import { withZero } from '@/core/utils/items'
  import { useAppStore } from '@/stores/app'
  import { onBeforeRouteLeave } from 'vue-router'

  definePage({
    meta: { title: 'Изменение упражнения', isBack: true },
  })

  const route = useRoute()
  const appStore = useAppStore()

  const musclesItems = computed(() => withZero(appStore.muscles))
  const equipmentsItems = computed(() => withZero(appStore.equipments))

  const currentId = 'id' in route.params ? +route.params.id : 0

  /** Что-то было изменено */
  const changed = ref(false)
  const current = computed(() => (
    appStore.exercises.find(e => e.id === currentId) || new ExerciseModel()
  ))

  const save = async () => {
    await appStore.saveTrainings()
    changed.value = false
    appStore.addToast('Успешно сохранено')
    return true
  }

  onBeforeRouteLeave(async () => !changed.value || save())
</script>
