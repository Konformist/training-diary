<template>
  <q-page>
    <div class="q-pa-sm">
    <q-date
      class="full-width"
      style="height: 500px;"
      flat
      bordered
      minimal
      :mask="DATE_MASK"
      v-model="selectDate"
      @update:model-value="addTraining()"
    />
    </div>
    <q-list separator bordered>
      <q-slide-item
        v-for="item in mainStore.trainings"
        :key="item.id"
        left-color="red"
        right-color="green"
        @left="delTraining($event, item.id)"
        @click="editTraining(item.id)"
      >
        <template #left>
          <q-icon name="delete" />
        </template>
        <TrainingCard
          :item="item"
        />
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { date, useQuasar } from 'quasar';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'MainPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const selectDate = ref(date.formatDate(new Date(), DATE_MASK));

const addTraining = () => {
  // eslint-disable-next-line no-console
  console.log(selectDate.value);
  const newTraining = new TrainingModel();
  const lastTraining = mainStore.trainings[mainStore.trainings.length - 1];

  newTraining.id = lastTraining ? lastTraining.id + 1 : 1;
  newTraining.date = (selectDate.value ? date.extractDate(selectDate.value, DATE_MASK) : new Date()).getTime();
  mainStore.trainings.push(newTraining);
  mainStore.saveTrainings();
  router.push({ name: 'Training', params: { id: newTraining.id } });
};

const editTraining = (id: number) => {
  router.push({ name: 'Training', params: { id } });
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
