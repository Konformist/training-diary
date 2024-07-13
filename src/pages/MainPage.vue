<template>
  <q-page>
    <div class="q-pa-sm">
    <q-date
      class="full-width"
      style="height: 400px;"
      minimal
      :mask="DATE_MASK"
      :events="trainingDates"
      event-color="red"
      v-model="selectDate"
    />
    </div>
    <q-list separator>
      <q-slide-item
        v-for="item in listTrainings"
        :key="item.id"
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
  name: 'MainPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const trainingDates = computed(() => mainStore.trainingDates.map((e) => date.formatDate(e, 'YYYY/MM/DD')));

const listTrainings = computed(() => (
  mainStore.trainings.filter((e) => (date.formatDate(e.date, DATE_MASK) === mainStore.selectDate))
));

const moveTraining = (id: number) => {
  router.push({ name: 'Training', params: { id } });
};

const addTraining = () => {
  const newTraining = new TrainingModel();
  const lastTraining = mainStore.trainings[mainStore.trainings.length - 1];

  newTraining.id = lastTraining ? lastTraining.id + 1 : 1;
  newTraining.date = date.extractDate(mainStore.selectDate, DATE_MASK).getTime();
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

const selectDate = computed({
  get() {
    return mainStore.selectDate;
  },
  set(value) {
    if (value) {
      mainStore.selectDate = value;
    }
  },
});
</script>
