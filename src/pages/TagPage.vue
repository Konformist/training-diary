<template>
  <q-page padding>
    <q-input
      class="q-mb-lg"
      label="Имя"
      standout
      v-model.lazy.trim="current.name"
      @update:model-value="changed = true"
    />
    <p class="q-mb-sm">
      Цвет метки
    </p>
    <div class="q-mb-lg">
      <q-radio
        v-for="item in paletteItems"
        :key="item.id"
        :color="item.color"
        :val="item.id"
        keep-color
        v-model="current.color"
      />
    </div>
    <TdFooter
      :buttons="[{ icon: 'save', text: 'Сохранить', emit: 'save' }]"
      @save="save()"
    />
  </q-page>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { palette } from 'src/core/dictionaries/colors';
import { computed, ref } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import TagModel from 'src/core/entities/tag/TagModel';
import { useMainStore } from 'stores/main-store';
import TdFooter from 'components/UI/TdFooter.vue';

defineOptions({
  name: 'TagPage',
});

const route = useRoute();
const mainStore = useMainStore();

const paletteItems = palette.map((e, i) => ({
  id: i,
  name: e,
  color: e,
}));

const changed = ref(false);
const current = computed(() => (
  mainStore.tags.find((e) => e.id.toString() === route.params?.id)
  || new TagModel()
));

const save = async () => {
  await mainStore.saveTrainings();
  changed.value = false;
  Notify.create('Успешно сохранено');
  return true;
};

onBeforeRouteLeave(async () => !changed.value || save());
</script>
