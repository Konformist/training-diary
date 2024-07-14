<template>
  <q-page>
    <q-list>
      <q-slide-item
        v-for="item in mainStore.muscles"
        :key="item.id"
        left-color="red"
        right-color="green"
        @left="delMuscle($event, item.id)"
        @click="moveMuscle(item.id)"
      >
        <template #left>
          <q-icon name="delete" />
        </template>
        <q-item>
          <q-item-section>
            {{ item.name }}
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="addMuscle()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useMainStore } from 'stores/main-store';
import MuscleModel from 'src/core/entities/muscle/MuscleModel';

defineOptions({
  name: 'MusclesPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const moveMuscle = (id: number) => {
  router.push({ name: 'Muscle', params: { id } });
};

const addMuscle = () => {
  const newItem = new MuscleModel();
  const lastItem = mainStore.muscles[mainStore.muscles.length - 1];

  newItem.id = lastItem ? lastItem.id + 1 : 1;
  mainStore.muscles.push(newItem);
  mainStore.saveTrainings();
  moveMuscle(newItem.id);
};

const delMuscle = (event: { reset: () => void }, id: number) => {
  $q.dialog({
    message: 'Вы действительно хотите удалить мышцу?',
    cancel: true,
  }).onOk(() => {
    mainStore.muscles = mainStore.muscles.filter((e) => e.id !== id);
    mainStore.saveTrainings();
  }).onDismiss(() => {
    event.reset();
  });
};
</script>
