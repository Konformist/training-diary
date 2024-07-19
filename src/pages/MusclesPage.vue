<template>
  <q-page>
    <q-list>
      <q-slide-item
        v-for="item in listMuscles"
        :key="item.id"
        left-color="red"
        right-color="green"
        @left="delMuscle($event, item.id)"
        @click="moveMuscle(item.id)"
      >
        <template #left>
          <q-icon name="sym_r_delete" />
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
        icon="sym_r_add"
        color="primary"
        @click="addMuscle()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { Notify, useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from 'stores/main-store';

defineOptions({
  name: 'MusclesPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const listMuscles = computed(() => (
  [...mainStore.muscles].sort((a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  })
));

const moveMuscle = (id: number) => {
  router.push({ name: 'Muscle', params: { id } });
};

const addMuscle = async () => {
  const id = mainStore.addMuscle();
  await mainStore.saveTrainings();
  moveMuscle(id);
  Notify.create('Успешно добавлено');
};

const delMuscle = (event: { reset: () => void }, id: number) => {
  $q.dialog({
    message: 'Вы действительно хотите удалить мышечную группу?',
    cancel: true,
  }).onOk(async () => {
    mainStore.delMuscle(id);
    await mainStore.saveTrainings();
    Notify.create('Успешно удалено');
  }).onDismiss(() => {
    event.reset();
  });
};
</script>
