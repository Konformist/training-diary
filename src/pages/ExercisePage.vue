<template>
  <q-page padding>
    <q-input
      class="q-mb-sm"
      standout
      v-model="current.name"
      @update:model-value="changed = true"
    />
    <TdSelect
      class="q-mb-sm"
      :options="musclesItems"
      v-model="current.muscle_group_id"
      @update:model-value="changed = true"
    />
    <TdSelect
      class="q-mb-sm"
      :options="equipmentsItems"
      v-model="current.equipment_id"
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
import ExerciseModel from 'src/core/entities/exercise/ExerciseModel';
import { useMainStore } from 'stores/main-store';
import TdSelect from 'components/UI/TdSelect.vue';

defineOptions({
  name: 'ExercisePage',
});

const route = useRoute();
const mainStore = useMainStore();

const musclesItems = computed(() => [
  { id: 0, name: 'Не выбрано' },
  ...mainStore.muscles,
]);

const equipmentsItems = computed(() => [
  { id: 0, name: 'Не выбрано' },
  ...mainStore.equipments,
]);

const changed = ref(false);
const current = computed(() => (
  mainStore.exercises.find((e) => e.id.toString() === route.params?.id)
  || new ExerciseModel()
));

const save = async () => {
  await mainStore.saveTrainings();
  changed.value = false;
  Notify.create('Успешно сохранено');
  return true;
};

onBeforeRouteLeave(async () => !changed.value || save());
</script>
