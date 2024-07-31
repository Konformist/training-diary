<template>
  <q-page padding>
    <q-select
      class="q-mb-sm"
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
      class="q-mb-sm"
      label="Отдых"
      mask="##:##"
      standout
      v-model="current.rest_time"
      @update:model-value="changed = true"
    />
    <q-input
      class="q-mb-sm"
      label="Подходы"
      type="number"
      standout
      v-model.number="current.approaches"
      @update:model-value="changed = true"
    />
    <q-input
      class="q-mb-sm"
      label="Повторы"
      type="number"
      standout
      v-model.number="current.repetitions"
      @update:model-value="changed = true"
    />
    <q-input
      class="q-mb-sm"
      label="Вес, кг"
      type="number"
      standout
      v-model.number="current.weight"
      @update:model-value="changed = true"
    />
    <q-card>
      <q-card-section>
        <div class="text-subtitle1">
          История
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-px-none">
        <q-list dense>
          <q-item class="text-right">
            <q-item-section>Суперсет</q-item-section>
            <q-item-section>Отдых</q-item-section>
            <q-item-section>Подх.</q-item-section>
            <q-item-section>Повт.</q-item-section>
            <q-item-section>Вес, кг</q-item-section>
          </q-item>
          <q-item
            v-for="item in history"
            :key="item.id"
            class="text-right"
            :class="item.id === current.id ? 'bg-primary' : ''"
          >
            <q-item-section>{{ item.bind_next || item.bind_prev ? 'Да' : 'Нет' }}</q-item-section>
            <q-item-section>{{ item.rest_time || '-' }}</q-item-section>
            <q-item-section>{{ item.approaches || '-' }}</q-item-section>
            <q-item-section>{{ item.repetitions || '-' }}</q-item-section>
            <q-item-section>{{ item.weight || '-' }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    <TdFooter
      :buttons="[{ icon: 'save', text: 'Сохранить', emit: 'save' }]"
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

const history = computed(() => (
  mainStore.trainingExercises
    .filter((item) => {
      if (item.exercise_id !== current.value.exercise_id) return false;

      const tr = mainStore.trainings.find((e) => e.id === item.training_id);
      return tr?.tag_id === training.value?.tag_id;
    })
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
