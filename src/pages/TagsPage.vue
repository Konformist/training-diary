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
          <q-item-section thumbnail>
            <q-avatar
              class="q-ml-md"
              :color="palette[item.color]"
              size="xs"
            />
          </q-item-section>
          <q-item-section>
            {{ item.name }}
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
    <TdFooter
      :buttons="[{ icon: 'add', text: 'Добавить', emit: 'add' }]"
      @add="addItem()"
    />
  </q-page>
</template>

<script setup lang="ts">
import { Notify, useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { palette } from 'src/core/dictionaries/colors';
import { sortByFields } from 'src/core/utils/arrays';
import { useMainStore } from 'stores/main-store';
import TdFooter from 'components/UI/TdFooter.vue';
import EmptyPage from 'components/EmptyPage.vue';

defineOptions({
  name: 'TagsPage',
});

const $q = useQuasar();
const router = useRouter();
const mainStore = useMainStore();

const isEmpty = computed(() => !mainStore.tags.length);
const list = computed(() => (sortByFields(mainStore.tags, ['name'])));

const moveItem = (id: number) => {
  router.push({ name: 'Tag', params: { id } });
};

const addItem = async () => {
  const id = mainStore.addTag();
  await mainStore.saveTrainings();
  moveItem(id);
  Notify.create('Успешно добавлено');
};

const delItem = (event: { reset: () => void }, id: number) => {
  $q.dialog({ message: 'Действительно удалить?', cancel: true })
    .onOk(async () => {
      mainStore.delTag(id);
      await mainStore.saveTrainings();
      Notify.create('Успешно удалено');
    })
    .onDismiss(() => { event.reset(); });
};
</script>
