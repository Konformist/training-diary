<template>
  <q-page>
    <q-list separator>
      <template
        v-for="item in listTrainings"
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
          @left="delTraining($event, item.id)"
          @click="moveTraining(item.id)"
        >
          <template #left>
            <q-icon name="delete" />
          </template>
          <TrainingCard :item="item" />
        </q-slide-item>
      </template>
    </q-list>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="addTraining()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import TrainingCard from 'components/TrainingCard.vue';
import { DATE_MASK } from 'src/core/dictionaries/dates';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { date, useQuasar } from 'quasar';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'TrainingsPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const listTrainings = computed(() => {
  let dateSave: string;

  return [...mainStore.trainings]
    .reverse()
    .reduce((acc, cur) => {
      const curDate = date.formatDate(cur.date, DATE_MASK);

      if (curDate !== dateSave) {
        dateSave = curDate;
        acc.push(curDate);
      }

      acc.push(cur);

      return acc;
    }, [] as Array<TrainingModel|string>);
});

const moveTraining = (id: number) => {
  router.push({ name: 'Training', params: { id } });
};

const addTraining = () => {
  const newTraining = new TrainingModel();
  const lastTraining = mainStore.trainings[mainStore.trainings.length - 1];

  newTraining.id = lastTraining ? lastTraining.id + 1 : 1;
  newTraining.date = (new Date()).getTime();
  mainStore.trainings.push(newTraining);
  mainStore.saveTrainings();
  moveTraining(newTraining.id);
};

const delTraining = (event: { reset: () => void }, id: number) => {
  $q.dialog({
    message: 'Вы действительно хотите удалить тренировку?',
    cancel: true,
  }).onOk(() => {
    mainStore.trainings = mainStore.trainings.filter((e) => e.id !== id);
    mainStore.saveTrainings();
  }).onDismiss(() => {
    event.reset();
  });
};
</script>
