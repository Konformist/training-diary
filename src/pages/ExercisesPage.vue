<template>
  <q-page>
    <EmptyPage v-if="isEmpty" />
    <q-list v-else>
      <template
        v-for="item in list"
        :key="item[0]"
      >
        <q-item-label
          v-if="item[0]"
          header
        >
          {{ getMuscleName(item[0]) }}
        </q-item-label>
        <q-slide-item
          v-for="subitem in item[1]"
          :key="subitem.id"
          left-color="red"
          @left="delItem($event, subitem.id)"
          @click="moveItem(subitem.id)"
        >
          <template #left>
            <q-icon name="delete" />
          </template>
          <q-item>
            <q-item-section>
              {{ subitem.name }}
            </q-item-section>
          </q-item>
        </q-slide-item>
      </template>
    </q-list>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="addItem()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { Notify, useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { groupByField, sortByFields } from 'src/core/utils/arrays';
import { useMainStore } from 'stores/main-store';
import EmptyPage from 'components/EmptyPage.vue';

defineOptions({
  name: 'ExercisesPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const getMuscleName = (value: number) => (mainStore.muscles.find((e) => e.id === value)?.name || '');

const isEmpty = computed(() => !mainStore.exercises.length);
const list = computed(() => {
  const arr = sortByFields(mainStore.exercises, ['muscle_group_id', 'name']);

  return groupByField(arr, 'muscle_group_id');
});

const moveItem = (id: number) => {
  router.push({ name: 'Exercise', params: { id } });
};

const addItem = async () => {
  const id = mainStore.addExercise();
  await mainStore.saveTrainings();
  moveItem(id);
  Notify.create('Успешно добавлено');
};

const delItem = (event: { reset: () => void }, id: number) => {
  $q.dialog({ message: 'Действительно удалить?', cancel: true })
    .onOk(async () => {
      mainStore.delExercise(id);
      await mainStore.saveTrainings();
      Notify.create('Успешно удалено');
    })
    .onDismiss(() => { event.reset(); });
};
</script>
