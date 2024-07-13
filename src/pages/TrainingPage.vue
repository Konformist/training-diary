<template>
  <q-page padding>
    <q-input
      class="q-mb-sm"
      label="Название тренировки"
      standout
      v-model.lazy.trim="currentTraining.name"
      @change="mainStore.saveTrainings()"
    />
    <q-input
      class="q-mb-sm"
      label="Дата и время тренировки"
      type="datetime-local"
      standout
      v-model="dateTime"
      @change="dateTimeInput()"
    >
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="dateTime" :mask="DATE_TIME_MASK" />
          </q-popup-proxy>
        </q-icon>
      </template>
      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="dateTime" :mask="DATE_TIME_MASK" format24h />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      class="q-mb-sm"
      label="Комментарий к тренировке"
      type="textarea"
      autogrow
      standout
      v-model.lazy.trim="currentTraining.comment"
      @change="mainStore.saveTrainings()"
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
import { DATE_TIME_MASK } from 'src/core/dictionaries/dates';
import { computed, ref } from 'vue';
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

const dateTime = ref(date.formatDate(currentTraining.value.date, DATE_TIME_MASK));
const dateTimeInput = () => {
  if (dateTime.value) {
    currentTraining.value.date = date.extractDate(dateTime.value, DATE_TIME_MASK).getTime();
    mainStore.saveTrainings();
  }
};

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
