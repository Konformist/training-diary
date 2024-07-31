<template>
  <q-page>
    <div class="q-pa-sm">
      <q-date
        class="full-width"
        style="height: 400px;"
        minimal
        :mask="DATE_MASK"
        :events="trainingDates"
        :event-color="eventColor"
        v-model="selectDate"
      />
    </div>
    <q-list separator>
      <q-slide-item
        v-for="item in list"
        :key="item.id"
        left-color="red"
        @left="delItem($event, item.id)"
        @click="moveItem(item.id)"
      >
        <template #left>
          <q-icon name="delete" />
        </template>
        <TrainingCard :training-id="item.id" />
      </q-slide-item>
    </q-list>
    <TdFooter
      :buttons="[{ icon: 'add', text: 'Добавить', emit: 'add' }]"
      @add="addItem()"
    />
  </q-page>
</template>

<script setup lang="ts">
import { date, Notify, useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { palette } from 'src/core/dictionaries/colors';
import { sortByFields } from 'src/core/utils/arrays';
import { DATE_MASK } from 'src/core/dictionaries/dates';
import { useMainStore } from 'stores/main-store';
import TdFooter from 'components/UI/TdFooter.vue';
import TrainingCard from 'components/TrainingCard.vue';

defineOptions({
  name: 'MainPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const trainingDates = computed(() => mainStore.trainingDates.map((e) => date.formatDate(e, 'YYYY/MM/DD')));
const datesColors = computed(() => mainStore.trainings.reduce((acc, cur) => {
  const curDate = date.formatDate(cur.date, 'YYYY/MM/DD');
  const curTag = mainStore.tags.find((e) => e.id === cur.tag_id)?.color || 0;

  acc[curDate] = palette[curTag];

  return acc;
}, {} as { [key: string]: string }));

const eventColor = (event: string) => (datesColors.value[event] || 'primary');

const list = computed(() => {
  const arr = mainStore.trainings.filter((e) => (date.formatDate(e.date, DATE_MASK) === mainStore.selectDate));

  return sortByFields(arr, ['date'], true);
});

const moveItem = (id: number) => {
  router.push({ name: 'Training', params: { id } });
};

const addItem = async () => {
  const id = mainStore.addTraining(date.extractDate(mainStore.selectDate, DATE_MASK));
  await mainStore.saveTrainings();
  moveItem(id);
  Notify.create('Успешно добавлено');
};

const delItem = (event: { reset: () => void }, id: number) => {
  $q.dialog({ message: 'Действительно удалить?', cancel: true })
    .onOk(async () => {
      mainStore.delTraining(id);
      await mainStore.saveTrainings();
      Notify.create('Успешно удалено');
    })
    .onDismiss(() => { event.reset(); });
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
