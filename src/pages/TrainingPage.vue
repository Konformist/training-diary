<template>
  <q-page padding>
    <q-input
      class="q-mb-sm"
      label="Название тренировки"
      outlined
      v-model.trim="currentTraining.name"
    />
    <q-input
      class="q-mb-sm"
      label="Дата и время тренировки"
      type="datetime-local"
      outlined
      v-model.lazy="dateTime"
    />
    <q-input
      class="q-mb-sm"
      label="Комментарий к тренировке"
      outlined
      type="textarea"
      rows="3"
      v-model.trim="currentTraining.comment"
    />
    <ExerciseCard
      v-for="item in currentTraining.exercises"
      :key="item.id"
      class="q-mb-sm"
      :item="item"
      @delete="delExercise(item.id)"
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
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { date } from 'quasar';
import ExerciseModel from 'src/core/entities/training/ExerciseModel';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import ExerciseCard from 'components/ExerciseCard.vue';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'TrainingPage',
});

const route = useRoute();
const mainStore = useMainStore();

const currentTraining = computed<TrainingModel>(() => (
  mainStore.trainings.find((e) => e.id === +route.params.id)
   || new TrainingModel()
));

const dateTime = computed({
  get() {
    return date.formatDate(currentTraining.value.date, 'YYYY-MM-DDTHH:mm');
  },
  set(value) {
    currentTraining.value.date = date.extractDate(value, 'YYYY-MM-DDTHH:mm').getTime();
  },
});

const addExercise = () => {
  const newExercise = new ExerciseModel();
  const lastExercise = currentTraining.value.exercises[currentTraining.value.exercises.length - 1];

  newExercise.id = lastExercise ? lastExercise.id + 1 : 1;
  currentTraining.value.exercises.push(newExercise);
  mainStore.saveTrainings();
};

const delExercise = (id: number) => {
  currentTraining.value.exercises = currentTraining.value.exercises.filter((e) => e.id !== id);
  mainStore.saveTrainings();
};
</script>
