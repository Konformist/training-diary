<template>
  <q-page padding>
    <q-input
      class="q-mb-sm"
      standout
      v-model="current.name"
      @update:model-value="changed = true"
    />
    <q-select
      class="q-mb-sm"
      :options="mainStore.muscles"
      option-value="id"
      option-label="name"
      standout
      emit-value
      map-options
      v-model="current.muscle_group_id"
      @update:model-value="changed = true"
    />
    <q-select
      class="q-mb-sm"
      :options="mainStore.equipments"
      option-value="id"
      option-label="name"
      standout
      emit-value
      map-options
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
import { ref } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import ExerciseModel from 'src/core/entities/exercise/ExerciseModel';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'ExercisePage',
});

const route = useRoute();
const mainStore = useMainStore();

const changed = ref(false);
const current = ref(new ExerciseModel(mainStore.exercises.find((e) => e.id.toString() === route.params?.id)?.getStruct()));

const save = async () => {
  const index = mainStore.exercises.findIndex((e) => e.id === current.value.id);

  if (index !== -1) {
    mainStore.exercises.splice(index, 1, new ExerciseModel(current.value.getStruct()));
    await mainStore.saveTrainings();
    changed.value = false;
    Notify.create('Успешно сохранено');
    return true;
  }

  return false;
};

onBeforeRouteLeave(async () => !changed.value || save());
</script>
