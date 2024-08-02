<template>
  <q-page class="q-pa-md">
    <EmptyPage v-if="isEmpty" />
    <transition-group
      v-else
      enter-active-class="animated slideInLeft"
    >
      <TrainingCard
        v-for="(item, index) in list"
        :key="item.id"
        :class="index ? 'q-mt-md' : ''"
        :training="item"
        @delete="delItem($event)"
        @change="moveItem($event)"
      />
    </transition-group>
    <TdFooter
      :buttons="[
        { icon: 'sym_r_filter_list', text: 'Фильтры', emit: 'filter' },
        { icon: 'sym_r_add', text: 'Добавить', emit: 'add' },
      ]"
      @filter="dialogFilter = true"
      @add="addItem()"
    />
    <q-dialog
      position="bottom"
      v-model="dialogFilter"
    >
      <q-card>
        <q-list>
          <q-item-label header>
            Метка
          </q-item-label>
          <q-item
            v-for="tag in tagsItems"
            :key="tag.id"
            clickable
            v-ripple
            @click="trainingsPageStore.options.tagId = tag.id"
          >
            <q-item-section side>
              <q-radio
                :val="tag.id"
                :model-value="trainingsPageStore.options.tagId"
              />
            </q-item-section>
            <q-item-section>
              {{ tag.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { Notify, useQuasar } from 'quasar';
import { withZero } from 'src/core/utils/items';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { sortByFields } from 'src/core/utils/arrays';
import { useMainStore } from 'stores/main-store';
import TrainingCard from 'components/TrainingCard.vue';
import TdFooter from 'components/UI/TdFooter.vue';
import EmptyPage from 'components/EmptyPage.vue';
import useTrainingsPageStore from 'pages/trainings-page/useTrainingsPageStore';

defineOptions({
  name: 'TrainingsPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();
const trainingsPageStore = useTrainingsPageStore();

const dialogFilter = ref(false);

const tagsItems = computed(() => withZero(mainStore.tags, true));

const isEmpty = computed(() => !mainStore.trainings.length);
const list = computed(() => {
  const arr = mainStore.trainings.filter((e) => (
    !trainingsPageStore.options.tagId
    || e.tag_id === trainingsPageStore.options.tagId
  ));

  return sortByFields(arr, ['date'], true);
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

const delItem = (id: number) => {
  $q.dialog({ message: 'Действительно удалить?', cancel: true })
    .onOk(async () => {
      mainStore.delTraining(id);
      await mainStore.saveTrainings();
      Notify.create('Успешно удалено');
    });
};
</script>
