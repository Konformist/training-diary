<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.name !== 'Main'"
          flat
          dense
          round
          icon="sym_r_arrow_back"
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
          icon="sym_r_menu"
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
    <q-drawer
      elevated
      side="right"
      v-model="drawerRight"
    >
      <q-list>
        <q-item :to="{ name: 'Trainings' }">
          <q-item-section avatar>
            <q-icon name="sym_r_format_list_bulleted" />
          </q-item-section>
          <q-item-section avatar>
            Все тренировки
          </q-item-section>
        </q-item>
        <q-item :to="{ name: 'Exercises' }">
          <q-item-section avatar>
            <q-icon name="sym_r_exercise" />
          </q-item-section>
          <q-item-section avatar>
            Все упражнения
          </q-item-section>
        </q-item>
        <q-item :to="{ name: 'Muscles' }">
          <q-item-section avatar>
            <q-icon name="sym_r_attribution" />
          </q-item-section>
          <q-item-section avatar>
            Все группы мышц
          </q-item-section>
        </q-item>
        <q-item :to="{ name: 'Statistics' }">
          <q-item-section avatar>
            <q-icon name="sym_r_show_chart" />
          </q-item-section>
          <q-item-section avatar>
            Статистика
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item :to="{ name: 'Settings' }">
          <q-item-section avatar>
            <q-icon name="sym_r_settings" />
          </q-item-section>
          <q-item-section avatar>
            Настройки
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { productName } from '../../package.json';

defineOptions({
  name: 'MainLayout',
});

const drawerRight = ref(false);
</script>
