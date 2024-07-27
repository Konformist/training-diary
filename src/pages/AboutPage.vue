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
import { computed, ref } from 'vue';
import { Platform } from 'quasar';
// eslint-disable-next-line import/no-relative-packages
import { App, AppInfo } from '../../src-capacitor/node_modules/@capacitor/app';
import { version } from '../../package.json';

defineOptions({
  name: 'AboutPage',
});

const capAppInfo = ref<AppInfo>();

const init = async () => {
  if (Platform.is.capacitor) {
    capAppInfo.value = await App.getInfo();
  }
};

init();

const items = computed(() => {
  const arr = [
    { key: 'Версия Web', value: version },
  ];

  if (capAppInfo.value) {
    arr.push({ key: 'Версия Android', value: capAppInfo.value.version });
  }

  return arr;
});
</script>
