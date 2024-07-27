<template>
  <q-page>
    <q-list v-if="mainStore.equipments.length">
      <q-slide-item
        v-for="item in list"
        :key="item.id"
        left-color="red"
        right-color="green"
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
    <EmptyPage v-else />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="addEquipment()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { Notify, useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from 'stores/main-store';
import EmptyPage from 'components/EmptyPage.vue';

defineOptions({
  name: 'EquipmentsPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const list = computed(() => (
  [...mainStore.equipments].sort((a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  })
));

const moveItem = (id: number) => {
  router.push({ name: 'Equipment', params: { id } });
};

const addEquipment = async () => {
  const id = mainStore.addEquipment();
  await mainStore.saveTrainings();
  moveItem(id);
  Notify.create('Успешно добавлено');
};

const delItem = (event: { reset: () => void }, id: number) => {
  $q.dialog({ message: 'Действительно удалить?', cancel: true })
    .onOk(async () => {
      mainStore.delEquipment(id);
      await mainStore.saveTrainings();
      Notify.create('Успешно удалено');
    })
    .onDismiss(() => { event.reset(); });
};
</script>
