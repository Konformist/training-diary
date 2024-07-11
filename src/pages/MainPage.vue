<template>
  <q-page>
    <q-list separator>
      <q-slide-item
        v-for="(item, index) in mainStore.trainings"
        :key="index"
        left-color="red"
        right-color="green"
        @left="delTraining($event, index)"
        @right="editTraining(item)"
      >
        <template #left>
          <q-icon name="delete" />
        </template>
        <template #right>
          <q-icon name="edit" />
        </template>
        <q-item>
          <q-item-section>
            <q-item-label>
              Тренировка за {{ date.formatDate(item.date, 'DD.MM.YYYY') }}
            </q-item-label>
            <q-item-label
              v-for="(subitem, subindex) in item.exercises"
              :key="subindex"
              class="q-my-none"
              caption
            >
              {{ subitem.name }}: {{ subitem.approaches }}x{{ subitem.repetitions }}x{{ subitem.weight }}
            </q-item-label>
          </q-item-section>
        </q-item>
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
import { useRouter } from 'vue-router';
import { date, useQuasar } from 'quasar';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'MainPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const addTraining = () => {
  mainStore.currentTraining = new TrainingModel();
  router.push({ name: 'Training' });
};

const editTraining = (item: TrainingModel) => {
  mainStore.currentTraining = item;
  router.push({ name: 'Training' });
};

const delTraining = (event: { reset: () => void }, index: number) => {
  $q.dialog({
    message: 'Вы действительно хотите удалить тренировку?',
    cancel: true,
  }).onOk(() => {
    mainStore.trainings.splice(index, 1);
    mainStore.saveTrainings();
  }).onDismiss(() => {
    event.reset();
  });
};
</script>
