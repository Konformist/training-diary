<template>
  <q-page padding>
    <q-input
      class="q-mb-sm"
      standout
      v-model="currentMuscle.name"
    />
    <q-btn
      class="full-width"
      label="Сохранить"
      color="secondary"
      @click="saveMuscle()"
    />
  </q-page>
</template>

<script setup lang="ts">
import { is, useQuasar } from 'quasar';
import { ref } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import MuscleModel from 'src/core/entities/muscle/MuscleModel';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'MusclePage',
});

const $q = useQuasar();
const route = useRoute();
const mainStore = useMainStore();

const reserveMuscle = ref(new MuscleModel(mainStore.muscles.find((e) => e.id.toString() === route.params?.id)?.getStruct()));
const currentMuscle = ref(new MuscleModel(mainStore.muscles.find((e) => e.id.toString() === route.params?.id)?.getStruct()));

const saveMuscle = () => {
  const index = mainStore.muscles.findIndex((e) => e.id === currentMuscle.value.id);

  if (index !== -1) {
    reserveMuscle.value = new MuscleModel(currentMuscle.value.getStruct());
    mainStore.muscles.splice(index, 1, new MuscleModel(currentMuscle.value.getStruct()));
    mainStore.saveTrainings();
  }
};

onBeforeRouteLeave(async () => {
  if (is.deepEqual(reserveMuscle.value, currentMuscle.value)) {
    return true;
  }

  return new Promise((resolve) => {
    $q.dialog({
      message: 'Есть несохранённые данные',
      persistent: true,
      ok: 'Сохранить',
      cancel: 'Не сохранять',
      color: 'primary',
    }).onOk(() => {
      saveMuscle();
      resolve(true);
    }).onCancel(() => {
      resolve(true);
    });
  });
});
</script>
