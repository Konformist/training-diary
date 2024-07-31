<template>
  <q-drawer
    elevated
    side="left"
    show-if-above
    v-model="modelValue"
  >
    <q-list>
      <template
        v-for="item in menuItems"
        :key="item.text"
      >
        <q-separator v-if="item.separator" />
        <q-item-label
          v-if="!item.to"
          header
        >
          {{ item.text }}
        </q-item-label>
        <q-item
          v-else
          clickable
          v-ripple
          :to="item.to"
        >
          <q-item-section
            v-if="item.icon"
            avatar
          >
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section avatar>
            {{ item.text }}
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router';

defineOptions({
  name: 'DrawerMenu',
});

const modelValue = defineModel<boolean>({ default: false });

interface IMenuItem {
  text: string
  icon?: string
  to?: RouteLocationRaw
  separator?: boolean
}

const menuItems: IMenuItem[] = [
  { text: 'Список тренировок', icon: 'format_list_bulleted', to: { name: 'Trainings' } },
  { text: 'Статистика', icon: 'show_chart', to: { name: 'Statistics' } },
  {
    text: 'Справочники', separator: true,
  },
  { text: 'Справочник меток', icon: 'label', to: { name: 'Tags' } },
  { text: 'Справочник мышц', icon: 'attribution', to: { name: 'Muscles' } },
  { text: 'Справочник экипировки', icon: 'attribution', to: { name: 'Equipments' } },
  { text: 'Справочник упражнений', icon: 'fitness_center', to: { name: 'Exercises' } },
  {
    text: 'Настройки', icon: 'settings', to: { name: 'Settings' }, separator: true,
  },
  { text: 'О приложении', icon: 'info', to: { name: 'About' } },
];
</script>
