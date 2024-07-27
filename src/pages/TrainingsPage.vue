<template>
  <q-page>
    <EmptyPage v-if="isEmpty" />
    <template v-else>
      <TdSelect
        class="q-ma-sm"
        :options="tagsItems"
        v-model="options.tag_id"
      />
      <q-separator />
      <q-list>
        <template
          v-for="item in list"
          :key="item[0]"
        >
          <q-item-label
            v-if="item[0]"
            header
          >
            {{ date.formatDate(item[0], DATE_MASK_LOCAL) }}
          </q-item-label>
          <q-slide-item
            v-for="subItem in item[1]"
            :key="subItem.id"
            left-color="red"
            @left="delItem($event, subItem.id)"
            @click="moveItem(subItem.id)"
          >
            <template #left>
              <q-icon name="delete" />
            </template>
            <TrainingCard :item="subItem" />
          </q-slide-item>
        </template>
      </q-list>
    </template>
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
import { date, Notify, useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { DATE_MASK_LOCAL } from 'src/core/dictionaries/dates';
import { groupByField, sortByFields } from 'src/core/utils/arrays';
import { useMainStore } from 'stores/main-store';
import TdSelect from 'components/UI/TdSelect.vue';
import EmptyPage from 'components/EmptyPage.vue';
import TrainingCard from 'components/TrainingCard.vue';

defineOptions({
  name: 'TrainingsPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const tagsItems = computed(() => [
  { id: 0, name: 'Все' },
  ...mainStore.tags,
]);

const options = ref({
  tag_id: 0,
});

const isEmpty = computed(() => !mainStore.trainings.length);
const list = computed(() => {
  let arr = mainStore.trainings.filter((e) => !options.value.tag_id || e.tag_id === options.value.tag_id);
  arr = sortByFields(arr, ['date'], true);
  return groupByField(arr, 'date');
});

const moveItem = (id: number) => {
  router.push({ name: 'Training', params: { id } });
};

const addItem = async () => {
  const id = mainStore.addTraining();
  await mainStore.saveTrainings();
  moveItem(id);
  Notify.create('Успешно добавлено');
};

const delItem = (event: { reset: () => void }, id: number) => {
  $q.dialog({ message: 'Действительно удалить?', cancel: true })
    .onOk(async () => {
      mainStore.delTraining(id);
      await mainStore.saveTrainings();
      Notify.create('Успешно удалено');
    })
    .onDismiss(() => { event.reset(); });
};
</script>
