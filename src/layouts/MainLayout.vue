<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.name !== 'Trainings'"
          flat
          dense
          round
          icon="arrow_back"
          aria-label="Settings"
          @click="$router.back()"
        />
        <q-toolbar-title>
          {{ productName }}
        </q-toolbar-title>
        <q-btn
          flat
          dense
          round
          icon="settings"
          aria-label="Settings"
          @click="$router.push({ name: 'Settings' })"
        />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
    >
      <div class="q-pa-sm">
        <q-file
          class="q-mb-sm"
          label="Загрузить данные"
          type="file"
          dense
          v-model="fileDB"
          @update:model-value="readFile()"
        />
        <q-btn
          class="full-width"
          label="Выгрузить данные"
          color="primary"
          @click="download()"
        />
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { ref } from 'vue';
import { fileToJson } from 'src/core/utils/files';
import { IStorageTraining, useMainStore } from 'stores/main-store';
import { productName } from '../../package.json';

defineOptions({
  name: 'MainLayout',
});

const mainStore = useMainStore();

const leftDrawerOpen = ref(false);

// const toggleLeftDrawer = () => {
//   leftDrawerOpen.value = !leftDrawerOpen.value;
// };

const fileDB = ref<File>();

const download = () => {
  const encodedUri = encodeURIComponent(JSON.stringify({
    version: 1,
    trainings: mainStore.trainings.map((e) => e.getStruct()),
  }));
  const link = document.createElement('a');

  link.setAttribute('href', `data:text/json;charset=utf-8,${encodedUri}`);
  link.setAttribute('download', 'trainings.json');
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link); // Required for FF
};

const readFile = async () => {
  if (!fileDB.value) return;

  const result = await fileToJson<IStorageTraining>(fileDB.value);

  mainStore.trainings = result.trainings.map((e) => new TrainingModel(e));
  mainStore.saveTrainings();
};
</script>
