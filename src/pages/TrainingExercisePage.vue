<template>
  <q-page class="q-pa-md">
    <q-select
      class="q-mb-md"
      label="Упражнение"
      :options="exerciseItems"
      option-value="id"
      option-label="name"
      standout
      emit-value
      map-options
      use-input
      hide-selected
      fill-input
      v-model="current.exercise_id"
      @update:model-value="changed = true"
      @new-value="addExercise"
    />
    <q-input
      class="q-mb-md"
      label="Отдых"
      mask="##:##"
      standout
      v-model="current.rest_time"
      @update:model-value="changed = true"
    />
    <q-input
      class="q-mb-md"
      label="Подходы"
      type="number"
      standout
      v-model.number="current.approaches"
      @update:model-value="changed = true"
    />
    <q-input
      class="q-mb-md"
      label="Повторы"
      type="number"
      standout
      v-model.number="current.repetitions"
      @update:model-value="changed = true"
    />
    <q-input
      class="q-mb-md"
      label="Вес, кг"
      type="number"
      standout
      v-model.number="current.weight"
      @update:model-value="changed = true"
    />
    <q-markup-table>
      <caption class="q-py-sm">
        История
      </caption>
      <thead>
        <tr class="text-center">
          <th>Суперсет</th>
          <th>Отдых</th>
          <th>Подх.</th>
          <th>Повт.</th>
          <th>Вес, кг</th>
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
        </tr>
      </tbody>
    </q-markup-table>
    <TdFooter
      :buttons="[{ icon: 'sym_r_save', text: 'Сохранить', emit: 'save' }]"
      @save="save()"
    />
  </q-page>
</template>
<script setup lang="ts">
import { Notify } from 'quasar';
import { isIncludeString } from 'src/core/utils/strings';
import { ref, computed } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { useMainStore } from 'stores/main-store';
import TrainingExerciseModel from 'src/core/entities/training-exercise/TrainingExerciseModel';
import TdFooter from 'components/UI/TdFooter.vue';

defineOptions({
  name: 'TrainingExercisePage',
});

const route = useRoute();
const mainStore = useMainStore();

const exerciseItems = computed(() => [
  { id: 0, name: 'Не выбрано' },
  ...mainStore.exercises,
]);

/** Что-то было изменено */
const changed = ref(false);
const current = computed(() => (
  mainStore.trainingExercises.find((e) => e.id === +route.params.id)
  || new TrainingExerciseModel()
));

const training = computed(() => mainStore.trainings.find((e) => e.id === current.value.training_id));
const trainingsIds = computed(() => (
  mainStore.trainings
    .filter((e) => e.tag_id === training.value?.tag_id)
    .sort((a, b) => a.date - b.date)
    .map((e) => e.id)
));

const history = computed(() => (
  trainingsIds.value
    .reduce((acc, cur) => {
      mainStore.trainingExercises.forEach((e) => {
        if (e.training_id === cur && e.exercise_id === current.value.exercise_id) {
          acc.push(e);
        }
      });

      return acc;
    }, [] as TrainingExerciseModel[])
    .reverse()
));

const addExercise = (value: string, done: (v: number) => void) => {
  const exercise = mainStore.exercises.find((e) => isIncludeString(e.name, value));
  const id = exercise ? exercise.id : mainStore.addExercise(value);
  done(id);
  changed.value = true;
};

const save = async () => {
  await mainStore.saveTrainings();
  changed.value = false;
  Notify.create('Успешно сохранено');
  return true;
};

onBeforeRouteLeave(async () => !changed.value || save());
</script>
