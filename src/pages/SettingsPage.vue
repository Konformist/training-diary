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
import {
  Dark, date, exportFile, Notify, Platform,
} from 'quasar';
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
  await mainStore.saveTrainings();
  Notify.create('Данные успешно импортированы');
};

const fileName = `${StoreNames.TRAININGS}-${date.formatDate(new Date(), 'YYYY-MM-DD')}.json`;

const backupWeb = () => {
  exportFile(fileName, JSON.stringify(mainStore.savedData));
};

const backupFile = () => (
  Filesystem.writeFile({
    directory: Directory.Documents,
    path: `Training Diary/${fileName}`,
    recursive: true,
    encoding: Encoding.UTF8,
    data: JSON.stringify(mainStore.savedData),
  })
);

const backup = async () => {
  try {
    if (Platform.is.capacitor) await backupFile();
    else backupWeb();
    Notify.create('Данные успешно выгружены');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    Notify.create({ color: 'negative', caption: 'Не удалось выгрузить данные', timeout: 1000 });
  }
};

const setDarkMode = (value: boolean|'auto') => {
  Dark.set(value);
  mainStore.darkMode = value;
  mainStore.saveSettings();
};
</script>
