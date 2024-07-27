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
          class="q-ml-auto"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawerRight = !drawerRight"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          mode="out-in"
          enter-active-class="animated slideInLeft"
        >
          <component :is="Component" />
        </transition>
      </router-view>
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
