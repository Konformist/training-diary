<template>
  <q-page>
    <q-list separator>
      <template
        v-for="item in items"
        :key="item"
      >
        <q-item>
          <q-item-section>
            {{ item.key }}
          </q-item-section>
          <q-item-section side>
            {{ item.value }}
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'AboutPage',
});

const mainStore = useMainStore();

const items = computed(() => {
  const arr = [
    { key: 'Версия Web', value: mainStore.appInfo.frontVersion },
  ];

  if (mainStore.appInfo.platform) {
    arr.push({
      key: 'Версия приложения',
      value: mainStore.appInfo.platformAppVersion,
    });
  }

  return arr;
});
</script>
