<template>
  <router-view />
</template>

<script setup lang="ts">
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'App',
});

const mainStore = useMainStore();

const init = async () => {
  await mainStore.loadTrainings();
  await mainStore.migrationDB();
};

init();
</script>
