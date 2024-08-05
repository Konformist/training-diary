<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawerNav"
      border="none"
      width="300"
    >
      <v-list class="py-0 px-1" density="default">
        <v-list-item class="text-h6 font-weight-regular mb-1">
          {{ appStore.appInfo.name }}
        </v-list-item>
        <v-divider class="mb-1" />
        <template
          v-for="item in menuItems"
          :key="item.text"
        >
          <v-divider v-if="item.separator" class="mb-1" />
          <v-list-subheader v-if="!item.to" class="mb-1" :title="item.text" />
          <v-list-item
            v-else
            class="mb-1"
            :prepend-icon="item.icon"
            rounded="xl"
            :title="item.text"
            :to="item.to"
          />
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar elevation="2" :extension-height="!isHeader ? 0 : undefined">
      <v-app-bar-nav-icon
        v-if="isBack"
        icon="$arrow-left"
        @click="router.back()"
      />
      <v-app-bar-nav-icon
        v-else
        icon="$menu"
        @click="drawerNav = !drawerNav"
      />
      <v-app-bar-title>
        {{ title }}
      </v-app-bar-title>
      <template #extension>
        <slot name="header" />
      </template>
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>
    <v-bottom-navigation grow tag="footer">
      <v-btn class="w-0" :to="{ name: '/' }">
        <v-icon icon="$home" />
        <span class="text-caption">Главная</span>
      </v-btn>
      <v-btn class="w-0" :to="{ name: '/trainings/' }">
        <v-icon icon="$format-list-bulleted" />
        <span class="text-caption">Тренировки</span>
      </v-btn>
      <v-btn class="w-0" :to="{ name: '/settings' }">
        <v-icon icon="$cog" />
        <span class="text-caption">Настройки</span>
      </v-btn>
    </v-bottom-navigation>
    <slot name="footer" />
  </v-app>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/stores/app'
  import { RouteLocationRaw } from 'vue-router'

  defineProps<{
    title?: string
    isBack?: boolean
  }>()

  const slots = useSlots()
  const router = useRouter()
  const appStore = useAppStore()

  const isHeader = computed(() => !!(slots.header && slots.header().length))

  const drawerNav = ref(false)

  interface IMenuItem {
    text: string
    icon?: string
    to?: RouteLocationRaw
    separator?: boolean
  }

  const menuItems: IMenuItem[] = [
    { text: 'Список тренировок', icon: '$format-list-bulleted', to: { name: '/trainings/' } },
    { text: 'Справочники', separator: true },
    { text: 'Справочник меток', icon: '$list-box', to: { name: '/tags/' } },
    { text: 'Справочник мышц', icon: '$list-box', to: { name: '/muscles/' } },
    { text: 'Справочник экипировки', icon: '$list-box', to: { name: '/equipments/' } },
    { text: 'Справочник упражнений', icon: '$list-box', to: { name: '/exercises/' } },
    { text: 'Настройки', icon: '$cog', to: { name: '/settings' }, separator: true },
    { text: 'О приложении', icon: '$information', to: { name: '/about' } },
  ]
</script>
