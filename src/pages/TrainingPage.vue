<template>
  <q-page padding>
    <q-input
      class="q-mb-sm"
      label="Название тренировки"
      standout
      v-model.lazy.trim="currentTraining.name"
    />
    <q-input
      class="q-mb-sm"
      label="Дата и время тренировки"
      type="datetime-local"
      standout
      v-model="dateTime"
      @change="dateTimeInput()"
    />
    <q-input
      class="q-mb-sm"
      label="Комментарий к тренировке"
      type="textarea"
      autogrow
      standout
      v-model.lazy.trim="currentTraining.comment"
    />
    <TrainingExerciseCard
      v-for="(item, index) in currentTraining.exercises"
      :key="item.id"
      :class="!item.bind_prev ? 'q-mt-sm' : ''"
      :has-prev="index !== 0"
      :has-next="index !== currentTraining.exercises.length - 1"
      :item="item"
      @bind-next="bindExerciseNext(item.id)"
      @unbind-next="unbindExerciseNext(item.id)"
      @bind-prev="bindExercisePrev(item.id)"
      @unbind-prev="unbindExercisePrev(item.id)"
      @delete="delExercise(item.id)"
    />
    <q-btn
      class="full-width"
      label="Сохранить"
      color="secondary"
      @click="saveTraining()"
    />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="dialogExercise = true"
      />
    </q-page-sticky>
    <TrainingExerciseDialog
      v-model="dialogExercise"
      @send="addExercise($event)"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { date, is, Notify } from 'quasar';
import { DATE_TIME_MASK } from 'src/core/dictionaries/dates';
import TrainingExerciseModel from 'src/core/entities/training/TrainingExerciseModel';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { useMainStore } from 'stores/main-store';
import TrainingExerciseDialog from 'components/TrainingExerciseDialog.vue';
import TrainingExerciseCard from 'components/TrainingExerciseCard.vue';

defineOptions({
  name: 'TrainingPage',
});

const route = useRoute();
const mainStore = useMainStore();

const dialogExercise = ref(false);

const reserveTraining = ref<TrainingModel>(new TrainingModel(mainStore.trainings.find((e) => e.id === +route.params.id)?.getStruct()));
const currentTraining = ref<TrainingModel>(new TrainingModel(mainStore.trainings.find((e) => e.id === +route.params.id)?.getStruct()));

const dateTime = ref(date.formatDate(currentTraining.value.date, DATE_TIME_MASK));
const dateTimeInput = () => {
  if (dateTime.value) {
    currentTraining.value.date = date.extractDate(dateTime.value, DATE_TIME_MASK).getTime();
  }
};

const addExercise = (id: number) => {
  const newExercise = new TrainingExerciseModel();
  const ids = currentTraining.value.exercises.map((e) => e.id);

  newExercise.id = Math.max(...ids, 0) + 1;
  newExercise.exercise_id = id;
  currentTraining.value.exercises.push(newExercise);
};

const delExercise = (id: number) => {
  currentTraining.value.exercises = currentTraining.value.exercises.filter((e) => e.id !== id);
};

const bindExerciseNext = (id: number) => {
  const curIndex = currentTraining.value.exercises.findIndex((e) => e.id === id);
  const curExercise = currentTraining.value.exercises[curIndex];
  const nextExercise = currentTraining.value.exercises[curIndex + 1];

  if (!nextExercise || !curExercise) return;

  curExercise.bind_next = nextExercise.id;
  nextExercise.bind_prev = id;
};

const unbindExerciseNext = (id: number) => {
  const curIndex = currentTraining.value.exercises.findIndex((e) => e.id === id);
  const curExercise = currentTraining.value.exercises[curIndex];
  const nextExercise = currentTraining.value.exercises[curIndex + 1];

  if (!nextExercise || !curExercise) return;

  curExercise.bind_next = 0;
  nextExercise.bind_prev = 0;
};

const bindExercisePrev = (id: number) => {
  const curIndex = currentTraining.value.exercises.findIndex((e) => e.id === id);
  const curExercise = currentTraining.value.exercises[curIndex];
  const prevExercise = currentTraining.value.exercises[curIndex - 1];

  if (!prevExercise || !curExercise) return;

  curExercise.bind_prev = prevExercise.id;
  prevExercise.bind_next = id;
};

const unbindExercisePrev = (id: number) => {
  const curIndex = currentTraining.value.exercises.findIndex((e) => e.id === id);
  const curExercise = currentTraining.value.exercises[curIndex];
  const prevExercise = currentTraining.value.exercises[curIndex - 1];

  if (!prevExercise || !curExercise) return;

  curExercise.bind_prev = 0;
  prevExercise.bind_next = 0;
};

const saveTraining = async () => {
  const index = mainStore.trainings.findIndex((e) => e.id === currentTraining.value.id);

  if (index !== -1) {
    reserveTraining.value = new TrainingModel(currentTraining.value.getStruct());
    mainStore.trainings.splice(index, 1, new TrainingModel(currentTraining.value.getStruct()));
    await mainStore.saveTrainings();
    Notify.create('Успешно сохранено');
    return true;
  }

  return false;
};

onBeforeRouteLeave(async () => {
  if (is.deepEqual(reserveTraining.value, currentTraining.value)) return true;
  return saveTraining();
});
</script>
