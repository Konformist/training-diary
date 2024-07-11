<template>
  <q-page padding>
    <q-card
      v-for="(item, index) in mainStore.trainings"
      :key="index"
      class="q-mb-sm"
      flat
      @click="editTraining(item)"
    >
      <q-card-section>
        <p class="q-my-xs">
          Дата тренировки {{ date.formatDate(item.date, 'DD.MM.YYYY HH:mm') }}
        </p>
      </q-card-section>
      <q-card-section>
        <template
          v-for="(subitem, subindex) in item.exercises"
          :key="subindex"
        >
          <p class="q-my-xs">
            {{ subitem.name }}: {{ subitem.approaches }}x{{ subitem.repetitions }}x{{ subitem.weight }}
          </p>
        </template>
      </q-card-section>
      <q-card-section>
        <q-btn
          class="full-width"
          label="Удалить"
          color="negative"
          dense
          @click="delTraining(index)"
        />
      </q-card-section>
    </q-card>
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
import { date } from 'quasar';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'TrainingsPage',
});

const router = useRouter();
const mainStore = useMainStore();

const addTraining = () => {
  mainStore.currentTraining = new TrainingModel();
  router.push({ name: 'Training' });
};

const editTraining = (item:TrainingModel) => {
  mainStore.currentTraining = item;
  router.push({ name: 'Training' });
};

const delTraining = (index: number) => {
  mainStore.trainings.splice(index, 1);
  mainStore.saveTrainings();
};
</script>
