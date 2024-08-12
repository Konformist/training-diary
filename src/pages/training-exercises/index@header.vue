<template>
  <v-btn
    append-icon="$triangle-small-down"
    rounded="1"
    size="small"
    :text="tagName"
    variant="outlined"
    @click="dialogFilter = 'tag'"
  />
  <v-btn
    append-icon="$triangle-small-down"
    class="ml-4"
    rounded="1"
    size="small"
    :text="exerciseName"
    variant="outlined"
    @click="dialogFilter = 'exercise'"
  />
  <TdBottomSheetFilter
    v-model="trainingExercisesPageStore.options.tagId"
    :items="tagsItems"
    :opened="dialogFilter === 'tag'"
    title="Метка"
    @update:opened="dialogFilter = undefined"
  />
  <TdBottomSheetFilter
    v-model="trainingExercisesPageStore.options.exerciseId"
    :items="exercisesItems"
    :opened="dialogFilter === 'exercise'"
    title="Упражнение"
    @update:opened="dialogFilter = undefined"
  />
</template>

<script setup lang="ts">
  import TdBottomSheetFilter from '@/components/UI/TdBottomSheetFilter.vue'
  import { withZero } from '@/core/utils/items'
  import { useAppStore } from '@/stores/app'
  import useTrainingExercisesPageStore from '@/stores/trainingExercisesPage'
  import { computed, ref } from 'vue'

  const appStore = useAppStore()
  const trainingExercisesPageStore = useTrainingExercisesPageStore()

  const dialogFilter = ref<'exercise'|'tag'>()

  const tagsItems = computed(() => withZero(appStore.tags, true))
  const tagName = computed(() => (
    appStore.tags.find(e => e.id === trainingExercisesPageStore.options.tagId)?.name || 'Метка'
  ))

  const exercisesItems = computed(() => withZero(appStore.exercises, true))
  const exerciseName = computed(() => (
    appStore.exercises.find(e => e.id === trainingExercisesPageStore.options.exerciseId)?.name || 'Упражнение'
  ))
</script>
