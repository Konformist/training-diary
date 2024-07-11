<template>
  <q-page padding>
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
      color="secondary"
      dense
      @click="backup()"
    />
  </q-page>
</template>

<script setup lang="ts">
import { Notify, Platform } from 'quasar';
import { StoreNames } from 'src/core/dictionaries/storeNames';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { fileToJson } from 'src/core/utils/files';
import { IStorageTraining, useMainStore } from 'stores/main-store';
import { ref } from 'vue';
// eslint-disable-next-line import/no-relative-packages
import { Directory, Filesystem, Encoding } from '../../src-capacitor/node_modules/@capacitor/filesystem';

defineOptions({
  name: 'SettingsPage',
});

const mainStore = useMainStore();

const fileDB = ref<File>();

const readFile = async () => {
  if (!fileDB.value) return;

  const result = await fileToJson<IStorageTraining>(fileDB.value);

  mainStore.trainings = result.trainings.map((e) => new TrainingModel(e));
  mainStore.saveTrainings();
};

const backupWeb = () => {
  const encodedUri = encodeURIComponent(JSON.stringify(mainStore.savedData));
  const link = document.createElement('a');

  link.setAttribute('href', `data:text/json;charset=utf-8,${encodedUri}`);
  link.setAttribute('download', 'trainings.json');
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link); // Required for FF
};

const backupFile = async () => {
  try {
    await Filesystem.writeFile({
      directory: Directory.Documents,
      path: `Training Diary/${StoreNames.TRAININGS}.json`,
      recursive: true,
      encoding: Encoding.UTF8,
      data: JSON.stringify(mainStore.savedData),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    Notify.create({
      caption: 'Не удалось сохранить данные',
      message: e,
      type: 'negative',
    });
  }
};

const backup = () => {
  if (Platform.is.capacitor) backupFile();
  else backupWeb();
};
</script>
