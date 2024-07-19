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
import { DATE_MASK_LOCAL } from 'src/core/dictionaries/dates';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { date, Notify, useQuasar } from 'quasar';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'TrainingsPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const listTrainings = computed(() => {
  const list = [...mainStore.trainings].sort((a, b) => b.date - a.date);

  let dateSave: string;

  return list.reduce((acc, cur) => {
    const curDate = date.formatDate(cur.date, DATE_MASK_LOCAL);

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

const addTraining = async () => {
  const id = mainStore.addTraining();
  await mainStore.saveTrainings();
  moveTraining(id);
  Notify.create('Успешно добавлено');
};

const delTraining = (event: { reset: () => void }, id: number) => {
  $q.dialog({
    message: 'Вы действительно хотите удалить тренировку?',
    cancel: true,
  }).onOk(async () => {
    mainStore.delTraining(id);
    await mainStore.saveTrainings();
    Notify.create('Успешно удалено');
  }).onDismiss(() => {
    event.reset();
  });
};
</script>
