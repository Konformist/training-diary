<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          {{ productName }}
        </q-toolbar-title>
        <q-btn
          class="q-ml-auto"
          flat
          dense
          round
          icon="menu"
          @click="drawerRight = !drawerRight"
        />
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
import DrawerMenu from 'components/DrawerMenu.vue';
import { productName } from '../../package.json';

defineOptions({
  name: 'MainLayout',
});

const drawerRight = ref(false);
</script>
