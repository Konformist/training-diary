<template>
  <router-view />
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'App',
});

Notify.setDefaults({
  color: 'green',
  actions: [{ icon: 'sym_r_close', color: 'white' }],
});

const mainStore = useMainStore();

const init = async () => {
  await mainStore.getPlatformInfo();
  mainStore.loadSettings();
  await mainStore.loadTrainings();
  await mainStore.migrationDB();
  mainStore.checkVersion();
};

init();
</script>
