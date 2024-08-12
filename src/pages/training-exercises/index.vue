<template>
  <v-main>
    <v-empty-state
      v-if="isEmpty"
      text="Добавьте, чтобы было"
      title="Здесь ничего нет"
    />
    <v-container v-else class="pa-0">
      <v-list>
        <TdDictionaryListItem
          v-for="item in list"
          :key="item.trainingExercise.id"
          :subtitle="`${item.trainingExercise.approaches}x${item.trainingExercise.repetitions}x${item.trainingExercise.weight}`"
          :title="item.exercise?.name"
          @click="moveItem(item.trainingExercise.id)"
          @delete="delItem(item.trainingExercise.id)"
        />
      </v-list>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
  import TrainingModel from '@/core/entities/training/TrainingModel'
  import { useAppStore } from '@/stores/app'
  import useTrainingExercisesPageStore from '@/stores/trainingExercisesPage'

  definePage({
    meta: { title: 'Выполненные упражнения' },
  })

  const router = useRouter()
  const appStore = useAppStore()
  const trainingExercisesPageStore = useTrainingExercisesPageStore()

  const isFiltered = (id: number, filter: number) => (!filter || id === filter)

  const exercises = computed(() => (
    appStore.trainingExercises
      .map(item => ({
        trainingExercise: item,
        training: appStore.trainings.find(e => e.id === item.training_id) as TrainingModel,
        exercise: appStore.exercises.find(e => e.id === item.exercise_id),
      }))
      .sort((a, b) => b.training.date - a.training.date)
  ))

  const isEmpty = computed(() => !appStore.trainingExercises.length)
  const list = computed(() => (
    exercises.value
      .filter(e => (
        isFiltered(e.training.tag_id, trainingExercisesPageStore.options.tagId) &&
        isFiltered(e.trainingExercise.exercise_id, trainingExercisesPageStore.options.exerciseId)
      ))
  ))

  const moveItem = (id: number) => {
    router.push({ name: '/training-exercises/[id]', params: { id } })
  }

  const delItem = async (id: number) => {
    appStore.delTrainingExercise(id)
    await appStore.saveTrainings()
    appStore.addToast('Успешно удалено')
  }
</script>
