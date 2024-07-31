<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.name === 'Main'"
          flat
          dense
          round
          icon="menu"
          @click="drawerRight = !drawerRight"
        />
        <q-btn
          v-else
          flat
          dense
          round
          icon="arrow_back"
          @click="$router.back()"
        />
        <q-toolbar-title>
          {{ $route.meta.page || mainStore.appInfo.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <DrawerMenu
      v-model="drawerRight"
    />
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMainStore } from 'stores/main-store';
import DrawerMenu from 'components/DrawerMenu.vue';

defineOptions({
  name: 'MainLayout',
});

const mainStore = useMainStore();

const drawerRight = ref(false);
</script>
