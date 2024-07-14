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
      v-for="item in currentTraining.exercises"
      :key="item.id"
      class="q-mb-sm"
      :item="item"
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
        @click="addExercise()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { date, is, useQuasar } from 'quasar';
import { DATE_TIME_MASK } from 'src/core/dictionaries/dates';
import TrainingExerciseModel from 'src/core/entities/training/TrainingExerciseModel';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import TrainingExerciseCard from 'components/TrainingExerciseCard.vue';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'TrainingPage',
});

const $q = useQuasar();
const route = useRoute();
const mainStore = useMainStore();

const reserveTraining = ref<TrainingModel>(new TrainingModel(mainStore.trainings.find((e) => e.id === +route.params.id)?.getStruct()));
const currentTraining = ref<TrainingModel>(new TrainingModel(mainStore.trainings.find((e) => e.id === +route.params.id)?.getStruct()));

const dateTime = ref(date.formatDate(currentTraining.value.date, DATE_TIME_MASK));
const dateTimeInput = () => {
  if (dateTime.value) {
    currentTraining.value.date = date.extractDate(dateTime.value, DATE_TIME_MASK).getTime();
  }
};

const addExercise = () => {
  const newExercise = new TrainingExerciseModel();
  const lastExercise = currentTraining.value.exercises[currentTraining.value.exercises.length - 1];

  newExercise.id = lastExercise ? lastExercise.id + 1 : 1;
  currentTraining.value.exercises.push(newExercise);
};

const delExercise = (id: number) => {
  currentTraining.value.exercises = currentTraining.value.exercises.filter((e) => e.id !== id);
};

const saveTraining = () => {
  const index = mainStore.trainings.findIndex((e) => e.id === currentTraining.value.id);

  if (index !== -1) {
    reserveTraining.value = new TrainingModel(currentTraining.value.getStruct());
    mainStore.trainings.splice(index, 1, new TrainingModel(currentTraining.value.getStruct()));
    mainStore.saveTrainings();
  }
};

onBeforeRouteLeave(async () => {
  if (is.deepEqual(reserveTraining.value, currentTraining.value)) {
    return true;
  }

  return new Promise((resolve) => {
    $q.dialog({
      message: 'Есть несохранённые данные',
      persistent: true,
      ok: 'Сохранить',
      cancel: 'Не сохранять',
      color: 'primary',
    }).onOk(() => {
      saveTraining();
      resolve(true);
    }).onCancel(() => {
      resolve(true);
    });
  });
});
</script>
