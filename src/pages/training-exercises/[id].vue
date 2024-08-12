<template>
  <v-main>
    <v-container class="pb-fab">
      <v-autocomplete
        v-model="current.exercise_id"
        v-model:search="searchExercise"
        class="mb-4"
        :items="exerciseItems"
        label="Упражнение"
        @change="addExercise()"
        @update:model-value="changed = true"
      />
      <div class="d-flex mb-4">
        <TdMask
          v-model="current.rest_time"
          :blocks="{
            mm: { mask: IMask.MaskedRange, from: 0, to: 60, autofix: true },
            ss: { mask: IMask.MaskedRange, from: 0, to: 60, autofix: true },
          }"
          class="mr-4"
          inputmode="numeric"
          label="Отдых"
          mask="mm:ss"
          @update:model-value="changed = true"
        />
        <v-text-field
          v-model.number="current.approaches"
          label="Подходы"
          type="number"
          @update:model-value="changed = true"
        />
      </div>
      <div class="d-flex mb-4">
        <v-text-field
          v-model.number="current.repetitions"
          class="mr-4"
          label="Повторы"
          type="number"
          @update:model-value="changed = true"
        />
        <v-text-field
          v-model.number="current.weight"
          label="Вес, кг"
          type="number"
          @update:model-value="changed = true"
        />
      </div>
      <v-textarea
        v-model="current.comment"
        auto-grow
        class="mb-4"
        label="Комментарий"
        max-rows="4"
        rows="1"
        @change="current.comment = current.comment.trim()"
        @update:model-value="changed = true"
      />
      <v-card>
        <v-table>
          <caption class="py-3">
            История
          </caption>
          <thead>
            <tr>
              <th class="text-center">Суперсет</th>
              <th class="text-center">Отдых</th>
              <th class="text-center">Подходы</th>
              <th class="text-center">Повторы</th>
              <th class="text-center text-no-wrap">Вес, кг</th>
              <th class="text-center" style="min-width: 200px">Комментарий</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in history"
              :key="item.id"
              :class="item.id === current.id ? 'bg-primary' : ''"
            >
              <td class="text-center">{{ item.bind_next || item.bind_prev ? 'Да' : 'Нет' }}</td>
              <td class="text-center">{{ item.rest_time || '—' }}</td>
              <td class="text-right">{{ item.approaches || '—' }}</td>
              <td class="text-right">{{ item.repetitions || '—' }}</td>
              <td class="text-right">{{ item.weight || '—' }}</td>
              <td>{{ item.comment || '—' }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
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
  import { withZero } from '@/core/utils/items'
  import { useAppStore } from '@/stores/app'
  import { isIncludeString } from '@/core/utils/strings'
  import TrainingExerciseModel from '@/core/entities/training-exercise/TrainingExerciseModel'
  import { onBeforeRouteLeave } from 'vue-router'
  import { IMask } from 'vue-imask'

  definePage({
    meta: { title: 'Изменение упражнения', isBack: true },
  })

  const route = useRoute()
  const appStore = useAppStore()

  const exerciseItems = computed(() => withZero(appStore.exercises))

  const currentId = 'id' in route.params ? +route.params.id : 0

  /** Что-то было изменено */
  const changed = ref(false)
  const current = computed(() => (
    appStore.trainingExercises.find(e => e.id === currentId) || new TrainingExerciseModel()
  ))

  const training = computed(() => appStore.trainings.find(e => e.id === current.value.training_id))
  const trainingsIds = computed(() => (
    appStore.trainings
      .filter(e => e.tag_id === training.value?.tag_id)
      .sort((a, b) => a.date - b.date)
      .map(e => e.id)
  ))

  const history = computed(() => (
    trainingsIds.value
      .reduce((acc, cur) => {
        appStore.trainingExercises.forEach(e => {
          if (e.training_id === cur && e.exercise_id === current.value.exercise_id) {
            acc.push(e)
          }
        })

        return acc
      }, [] as TrainingExerciseModel[])
      .reverse()
  ))

  const searchExercise = ref('')
  const addExercise = () => {
    const exercise = appStore.exercises.find(e => isIncludeString(e.name, searchExercise.value))
    if (!exercise) current.value.exercise_id = appStore.addExercise(searchExercise.value)
  }

  const save = async () => {
    await appStore.saveTrainings()
    changed.value = false
    appStore.addToast('Успешно сохранено')
    return true
  }

  onBeforeRouteLeave(async () => !changed.value || save())
</script>
