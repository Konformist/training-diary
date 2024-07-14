<template>
  <q-page>
    <q-list>
      <template
        v-for="item in listExercises"
        :key="typeof item === 'number' ? item : item.id"
      >
        <q-item-label
          v-if="typeof item === 'number'"
          header
        >
          {{ getMuscleName(item) }}
        </q-item-label>
        <q-slide-item
          v-else
          left-color="red"
          right-color="green"
          @left="delExercise($event, item.id)"
          @click="moveExercise(item.id)"
        >
          <template #left>
            <q-icon name="delete" />
          </template>
          <q-item>
            <q-item-section>
              {{ item.name }}
            </q-item-section>
          </q-item>
        </q-slide-item>
      </template>
    </q-list>
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
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from 'stores/main-store';
import ExerciseModel from 'src/core/entities/exercise/ExerciseModel';

defineOptions({
  name: 'ExercisesPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const getMuscleName = (value: number) => (
  mainStore.muscles.find((e) => e.id === value)?.name
);

const listExercises = computed(() => {
  let muscleSave: number;

  return mainStore.exercises.reduce((acc, cur) => {
    if (cur.muscle_group_id !== muscleSave) {
      muscleSave = cur.muscle_group_id;
      acc.push(cur.muscle_group_id);
    }

    acc.push(cur);

    return acc;
  }, [] as Array<ExerciseModel|number>);
});

const moveExercise = (id: number) => {
  router.push({ name: 'Exercise', params: { id } });
};

const addExercise = () => {
  const newItem = new ExerciseModel();
  const lastItem = mainStore.exercises[mainStore.exercises.length - 1];

  newItem.id = lastItem ? lastItem.id + 1 : 1;
  mainStore.exercises.push(newItem);
  mainStore.saveTrainings();
  moveExercise(newItem.id);
};

const delExercise = (event: { reset: () => void }, id: number) => {
  $q.dialog({
    message: 'Вы действительно хотите удалить упражнение?',
    cancel: true,
  }).onOk(() => {
    mainStore.exercises = mainStore.exercises.filter((e) => e.id !== id);
    mainStore.saveTrainings();
  }).onDismiss(() => {
    event.reset();
  });
};
</script>
