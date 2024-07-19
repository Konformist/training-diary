<template>
  <q-page>
    <q-list>
      <q-item-label header>
        Тема приложения
      </q-item-label>
      <q-item>
        <q-btn-toggle
          class="full-width"
          :options="[
            { value: 'auto', label: 'Системная' },
            { value: false, label: 'Светлая' },
            { value: true, label: 'Темная' },
          ]"
          toggle-color="secondary"
          spread
          :model-value="mainStore.darkMode"
          @update:model-value="setDarkMode($event)"
        />
      </q-item>
      <q-separator spaced />
      <q-item-label header>
        Экспорт и импорт данных
      </q-item-label>
      <q-item>
        <q-file
          class="q-space"
          label="Импорт данных из файла"
          type="file"
          standout
          v-model="fileDB"
          @update:model-value="readFile()"
        />
      </q-item>
      <q-item>
        <q-btn
          class="q-space"
          label="Экспорт данных в файл"
          color="secondary"
          @click="backup()"
        />
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { Dark, Notify, Platform } from 'quasar';
import { ref } from 'vue';
import { StoreNames } from 'src/core/dictionaries/storeNames';
import { fileToJson } from 'src/core/utils/files';
import { IStorageTraining, useMainStore } from 'stores/main-store';
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

  mainStore.setSavedData(result);
  await mainStore.migrationDB();
};

const backupWeb = () => {
  const encodedUri = encodeURIComponent(JSON.stringify(mainStore.savedData));
  const link = document.createElement('a');

  link.setAttribute('href', `data:text/json;charset=utf-8,${encodedUri}`);
  link.setAttribute('download', 'trainings.json');
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link); // Required for FF
  Notify.create({
    caption: 'Данные успешно выгружены',
    type: 'positive',
    timeout: 1000,
  });
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
    Notify.create({
      caption: 'Данные успешно выгружены',
      type: 'positive',
      timeout: 1000,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    Notify.create({
      caption: 'Не удалось выгрузить данные',
      message: e,
      type: 'negative',
    });
  }
};

const backup = () => {
  if (Platform.is.capacitor) backupFile();
  else backupWeb();
};

const setDarkMode = (value: boolean|'auto') => {
  Dark.set(value);
  mainStore.darkMode = value;
  mainStore.saveSettings();
};
</script>
