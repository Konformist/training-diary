<template>
  <q-page>
    <EmptyPage v-if="isEmpty" />
    <template v-else>
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
            <TrainingCard :training-id="subItem.id" />
          </q-slide-item>
        </template>
      </q-list>
    </template>
    <TdFooter
      :buttons="[
        { icon: 'filter_list', text: 'Фильтры', emit: 'filter' },
        { icon: 'add', text: 'Добавить', emit: 'add' },
      ]"
      @filter="dialogFilter = true"
      @add="addItem()"
    />
    <q-dialog
      position="bottom"
      v-model="dialogFilter"
    >
      <q-card>
        <q-card-section>
          <TdSelect
            :options="tagsItems"
            v-model="trainingsPageStore.options.tagId"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import TdFooter from 'components/UI/TdFooter.vue';
import { date, Notify, useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { DATE_MASK_LOCAL } from 'src/core/dictionaries/dates';
import { groupByField, sortByFields } from 'src/core/utils/arrays';
import { useMainStore } from 'stores/main-store';
import TdSelect from 'components/UI/TdSelect.vue';
import EmptyPage from 'components/EmptyPage.vue';
import TrainingCard from 'components/TrainingCard.vue';
import useTrainingsPageStore from 'pages/trainings-page/useTrainingsPageStore';

defineOptions({
  name: 'TrainingsPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();
const trainingsPageStore = useTrainingsPageStore();

const dialogFilter = ref(false);

const tagsItems = computed(() => [
  { id: 0, name: 'Все' },
  ...mainStore.tags,
]);

const isEmpty = computed(() => !mainStore.trainings.length);
const list = computed(() => {
  let arr = mainStore.trainings.filter((e) => (
    !trainingsPageStore.options.tagId || e.tag_id === trainingsPageStore.options.tagId
  ));
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
