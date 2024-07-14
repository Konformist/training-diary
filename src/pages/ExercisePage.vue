<template>
  <q-page padding>
    <q-input
      class="q-mb-sm"
      standout
      v-model="currentExercise.name"
    />
    <q-select
      class="q-mb-sm"
      :options="mainStore.muscles"
      option-value="id"
      option-label="name"
      standout
      emit-value
      map-options
      v-model="currentExercise.muscle_group_id"
    />
    <q-btn
      class="full-width"
      label="Сохранить"
      color="secondary"
      @click="saveExercise()"
    />
  </q-page>
</template>

<script setup lang="ts">
import { is, useQuasar } from 'quasar';
import ExerciseModel from 'src/core/entities/exercise/ExerciseModel';
import { useMainStore } from 'stores/main-store';
import { ref } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

defineOptions({
  name: 'ExercisePage',
});

const $q = useQuasar();
const route = useRoute();
const mainStore = useMainStore();

const reserveExercise = ref(new ExerciseModel(mainStore.exercises.find((e) => e.id.toString() === route.params?.id)?.getStruct()));
const currentExercise = ref(new ExerciseModel(mainStore.exercises.find((e) => e.id.toString() === route.params?.id)?.getStruct()));

const saveExercise = () => {
  const index = mainStore.exercises.findIndex((e) => e.id === currentExercise.value.id);

  if (index !== -1) {
    reserveExercise.value = new ExerciseModel(currentExercise.value.getStruct());
    mainStore.exercises.splice(index, 1, new ExerciseModel(currentExercise.value.getStruct()));
    mainStore.saveTrainings();
  }
};

onBeforeRouteLeave(async () => {
  if (is.deepEqual(reserveExercise.value, currentExercise.value)) {
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
      saveExercise();
      resolve(true);
    }).onCancel(() => {
      resolve(true);
    });
  });
});
</script>
