<template>
  <q-page>
    <EmptyPage v-if="isEmpty" />
    <q-list v-else>
      <q-slide-item
        v-for="item in list"
        :key="item.id"
        left-color="red"
        @left="delItem($event, item.id)"
        @click="moveItem(item.id)"
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
        @click="addItem()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { Notify, useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { sortByFields } from 'src/core/utils/arrays';
import { useMainStore } from 'stores/main-store';
import EmptyPage from 'components/EmptyPage.vue';

defineOptions({
  name: 'MusclesPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const isEmpty = computed(() => !mainStore.muscles.length);
const list = computed(() => (sortByFields(mainStore.muscles, ['name'])));

const moveItem = (id: number) => {
  router.push({ name: 'Muscle', params: { id } });
};

const addItem = async () => {
  const id = mainStore.addMuscle();
  await mainStore.saveTrainings();
  moveItem(id);
  Notify.create('Успешно добавлено');
};

const delItem = (event: { reset: () => void }, id: number) => {
  $q.dialog({ message: 'Действительно удалить?', cancel: true })
    .onOk(async () => {
      mainStore.delMuscle(id);
      await mainStore.saveTrainings();
      Notify.create('Успешно удалено');
    })
    .onDismiss(() => { event.reset(); });
};
</script>
