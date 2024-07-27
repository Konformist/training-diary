<template>
  <q-page padding>
    <q-input
      class="q-mb-sm"
      standout
      v-model="current.name"
      @update:model-value="changed = true"
    />
    <q-btn
      class="full-width"
      label="Сохранить"
      color="secondary"
      @click="save()"
    />
  </q-page>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { computed, ref } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { useMainStore } from 'stores/main-store';
import EquipmentModel from 'src/core/entities/equipment/EquipmentModel';

defineOptions({
  name: 'EquipmentPage',
});

const route = useRoute();
const mainStore = useMainStore();

const changed = ref(false);
const current = computed(() => (
  mainStore.equipments.find((e) => e.id.toString() === route.params?.id)
  || new EquipmentModel()
));

const save = async () => {
  await mainStore.saveTrainings();
  changed.value = false;
  Notify.create('Успешно сохранено');
  return true;
};

onBeforeRouteLeave(async () => !changed.value || save());
</script>
