<template>
  <q-page>
    <q-list>
      <template
        v-for="item in listExercises"
        :key="typeof item === 'string' ? item : item.id"
      >
        <q-item-label
          v-if="typeof item === 'string'"
          header
        >
          {{ item }}
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
import { Notify, useQuasar } from 'quasar';
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

const getMuscleName = (value: number) => (mainStore.muscles.find((e) => e.id === value)?.name || '');

const listExercises = computed(() => {
  const list = [...mainStore.exercises]
    .map((e) => ({
      ...e,
      muscle_group: getMuscleName(e.muscle_group_id),
    }))
    .sort((a, b) => {
      if (a.muscle_group > b.muscle_group) return 1;
      if (a.muscle_group < b.muscle_group) return -1;
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

  let muscleSave: number;

  return list.reduce((acc, cur) => {
    if (cur.muscle_group_id !== muscleSave) {
      muscleSave = cur.muscle_group_id;
      acc.push(cur.muscle_group);
    }

    acc.push(cur);

    return acc;
  }, [] as Array<ExerciseModel|string>);
});

const moveExercise = (id: number) => {
  router.push({ name: 'Exercise', params: { id } });
};

const addExercise = async () => {
  const id = mainStore.addExercise();
  await mainStore.saveTrainings();
  moveExercise(id);
  Notify.create('Успешно добавлено');
};

const delExercise = (event: { reset: () => void }, id: number) => {
  $q.dialog({
    message: 'Вы действительно хотите удалить упражнение?',
    cancel: true,
  }).onOk(async () => {
    mainStore.delExercise(id);
    await mainStore.saveTrainings();
    Notify.create('Успешно удалено');
  }).onDismiss(() => {
    event.reset();
  });
};
</script>
