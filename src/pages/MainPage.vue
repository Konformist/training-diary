<template>
  <q-page>
    <q-list separator>
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
        <q-item>
          <q-item-section>
            <q-item-label>
              Тренировка за {{ date.formatDate(item.date, 'DD.MM.YYYY') }}
            </q-item-label>
            <q-item-label
              class="q-my-none flex"
              caption
            >
              <div class="text-bold">Упражнение</div>
              <div class="col-grow" />
              <div class="item-list--size text-right text-bold">Подходы</div>
              <div class="item-list--size text-right text-bold">Повторы</div>
              <div class="item-list--size text-right text-bold">Вес, кг</div>
            </q-item-label>
            <q-item-label
              v-for="(subitem, subindex) in item.exercises"
              :key="subindex"
              class="q-my-none flex"
              caption
            >
              <div>{{ subitem.name }}:</div>
              <div class="col-grow" />
              <div class="item-list--size text-right">{{ subitem.approaches || '-' }}</div>
              <div class="item-list--size text-right">{{ subitem.repetitions || '-' }}</div>
              <div class="item-list--size text-right">{{ subitem.weight || '-' }}</div>
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
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { useRouter } from 'vue-router';
import { date, useQuasar } from 'quasar';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'MainPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const addTraining = () => {
  const newTraining = new TrainingModel();
  const lastTraining = mainStore.trainings[mainStore.trainings.length - 1];

  newTraining.id = lastTraining ? lastTraining.id + 1 : 1;
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

<style lang="scss" scoped>
.item-list--size {
  width: 64px;
}
</style>
