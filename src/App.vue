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
        v-if="route.meta.isBack"
        icon="$arrow-left"
        @click="router.back()"
      />
      <v-app-bar-nav-icon
        v-else
        icon="$menu"
        @click="drawerNav = !drawerNav"
      />
      <v-app-bar-title>
        {{ route.meta.title }}
      </v-app-bar-title>
      <template #extension>
        <router-view name="header" />
      </template>
    </v-app-bar>
    <v-bottom-navigation grow tag="footer">
      <v-btn
        v-for="btn in footerItems"
        :key="btn.text"
        class="w-0"
        :to="btn.to"
      >
        <v-icon :icon="btn.icon" />
        <span class="text-caption">{{ btn.text }}</span>
      </v-btn>
    </v-bottom-navigation>
    <router-view v-slot="{ Component, route: routeLocal }">
      <v-slide-x-transition leave-absolute>
        <component :is="Component" :key="routeLocal.path" />
      </v-slide-x-transition>
    </router-view>
    <v-snackbar-queue
      v-model="appStore.toasts"
      close-on-content-click
      color="success"
      :timeout="2000"
    >
      <template #actions>
        <v-icon class="mr-2" icon="$window-close" />
      </template>
    </v-snackbar-queue>
    <DialogVersion v-model="dialog" :link="fileVersionLink" />
  </v-app>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/stores/app'
  import { RouteLocationRaw } from 'vue-router'
  import { useTheme } from 'vuetify'

  const theme = useTheme()
  const route = useRoute()
  const router = useRouter()
  const appStore = useAppStore()

  window.addEventListener('popstate', evt => {
    if (evt.state.current !== '/' && !route.name.includes('[id]')) {
      router.push({ name: '/' })
    }
  })

  const dialog = ref(false)
  const fileVersionLink = ref('')

  const init = async () => {
    await appStore.getPlatformInfo()
    await appStore.loadSettings()

    theme.global.name.value = appStore.darkMode

    await appStore.loadTrainings()
    await appStore.migrationDB()

    fileVersionLink.value = await appStore.checkVersion()
    dialog.value = !!fileVersionLink.value
  }

  init()

  const isHeader = computed(() => (route.matched[route.matched.length - 1]?.components?.header))

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

  interface IFooterItem {
    text: string
    icon: string
    to: RouteLocationRaw
  }

  const footerItems: IFooterItem[] = [
    { to: { name: '/' }, icon: '$home', text: 'Главная' },
    { to: { name: '/trainings/' }, icon: '$format-list-bulleted', text: 'Тренировки' },
    { to: { name: '/settings' }, icon: '$cog', text: 'Настройки' },
  ]
</script>
