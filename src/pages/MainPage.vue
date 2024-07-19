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
          <q-icon name="sym_r_delete" />
        </template>
        <TrainingCard :item="item" />
      </q-slide-item>
    </q-list>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="sym_r_add"
        color="primary"
        @click="addTraining()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { date, Notify, useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { DATE_MASK } from 'src/core/dictionaries/dates';
import TrainingCard from 'components/TrainingCard.vue';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'MainPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const trainingDates = computed(() => mainStore.trainingDates.map((e) => date.formatDate(e, 'YYYY/MM/DD')));

const listTrainings = computed(() => (
  mainStore.trainings
    .filter((e) => (date.formatDate(e.date, DATE_MASK) === mainStore.selectDate))
    .sort((a, b) => b.date - a.date)
));

const moveTraining = (id: number) => {
  router.push({ name: 'Training', params: { id } });
};

const addTraining = async () => {
  const id = mainStore.addTraining(date.extractDate(mainStore.selectDate, DATE_MASK));
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
