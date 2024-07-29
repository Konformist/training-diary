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
  actions: [{ icon: 'close', color: 'white' }],
});

const mainStore = useMainStore();

const init = async () => {
  mainStore.loadSettings();
  await mainStore.loadTrainings();
  await mainStore.migrationDB();
};

init();
</script>
