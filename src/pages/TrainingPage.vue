<template>
  <q-page
    v-if="mainStore.currentTraining"
    padding
  >
    <q-btn
      class="full-width q-mb-sm"
      label="Назад"
      color="secondary"
      dense
      @click="moveTrainings()"
    />
    <q-input
      class="q-mb-sm"
      label="Время тренировки"
      type="datetime-local"
      dense
      outlined
      v-model.lazy="dateTime"
    />
    <q-card
      v-for="(item, index) in mainStore.currentTraining.exercises"
      :key="index"
      class="q-mb-sm"
      flat
    >
      <q-card-section>
        <div class="flex no-wrap q-gutter-sm q-mb-sm">
          <q-input
            style="flex-grow: 1;"
            label="Название упражнения"
            dense
            v-model="item.name"
          />
          <q-input
            style="flex-grow: 1;"
            label="Мышечная группа"
            dense
            v-model="item.muscle_group"
          />
          <q-btn
            class="self-center"
            icon="clear"
            color="negative"
            dense
            rounded
            @click="delExercise(index)"
          />
        </div>
        <div class="flex no-wrap q-gutter-sm">
          <q-input
            style="flex-grow: 1;"
            label="Подходы"
            type="number"
            dense
            v-model="item.approaches"
          />
          <q-input
            style="flex-grow: 1;"
            label="Повторения"
            type="number"
            dense
            v-model="item.repetitions"
          />
          <q-input
            style="flex-grow: 1;"
            label="Вес, кг"
            type="number"
            dense
            v-model="item.weight"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-btn
      class="full-width"
      label="Добавить упражнение"
      color="primary"
      dense
      @click="addExercise()"
    />
    <q-btn
      class="full-width q-mt-sm"
      label="Сохранить"
      color="secondary"
      dense
      :disable="!mainStore.currentTraining.exercises.length"
      @click="saveTraining()"
    />
  </q-page>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import ExerciseModel from 'src/core/entities/training/ExerciseModel';
import { computed } from 'vue';
import { useMainStore } from 'stores/main-store';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'TrainingPage',
});

const router = useRouter();
const mainStore = useMainStore();

const moveTrainings = () => {
  router.push({ name: 'Trainings' });
};

const dateTime = computed({
  get() {
    return mainStore.currentTraining ? date.formatDate(mainStore.currentTraining.date, 'YYYY-MM-DDTHH:mm') : '';
  },
  set(value) {
    if (mainStore.currentTraining) {
      mainStore.currentTraining.date = date.extractDate(value, 'YYYY-MM-DDTHH:mm').getTime();
    }
  },
});

const addExercise = () => {
  if (mainStore.currentTraining) {
    mainStore.currentTraining.exercises.push(new ExerciseModel());
  }
};

const delExercise = (index: number) => {
  if (mainStore.currentTraining) {
    mainStore.currentTraining.exercises.splice(index, 1);
  }
};

const saveTraining = () => {
  if (!mainStore.currentTraining) {
    return;
  }

  if (!mainStore.trainings.includes(mainStore.currentTraining)) {
    mainStore.trainings.push(mainStore.currentTraining);
  }

  mainStore.saveTrainings();
  moveTrainings();
};
</script>
