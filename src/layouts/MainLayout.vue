<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.name !== 'Main'"
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
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { productName } from '../../package.json';

defineOptions({
  name: 'MainLayout',
});
</script>
