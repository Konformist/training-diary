<template>
  <q-item>
    <q-item-section>
      <q-item-label class="flex">
        <div style="flex-grow: 1;">{{ item.name }}</div>
        <div>{{ date.formatDate(item.date, 'HH:mm') }}</div>
      </q-item-label>
      <q-item-label
        class="q-my-none flex no-wrap"
        caption
      >
        <div class="q-space text-bold ellipsis">Упражнение</div>
        <div class="item-list--size text-right text-bold">Подх.</div>
        <div class="item-list--size text-right text-bold">Повт.</div>
        <div class="item-list--weight text-right text-bold">Вес, кг</div>
      </q-item-label>
      <q-item-label
        v-for="(subitem, subindex) in item.exercises"
        :key="subindex"
        class="q-my-none flex no-wrap"
        caption
      >
        <div class="q-space ellipsis">{{ getExercise(subitem.exercise_id) || '-' }}</div>
        <div class="item-list--size text-right">{{ subitem.approaches || '-' }}</div>
        <div class="item-list--size text-right">{{ subitem.repetitions || '-' }}</div>
        <div class="item-list--weight text-right">{{ subitem.weight || '-' }}</div>
      </q-item-label>
      <q-item-label
        class="q-my-none flex no-wrap"
        caption
      >
        <div class="q-space text-bold ellipsis">Тоннаж</div>
        <div class="item-list--weight text-right text-bold">{{ totalWeight }}</div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { useMainStore } from 'stores/main-store';
import { computed } from 'vue';
import TrainingModel from 'src/core/entities/training/TrainingModel';

const mainStore = useMainStore();

defineOptions({
  name: 'TrainingCard',
});

const props = defineProps<{
  item: TrainingModel
}>();

const getExercise = (value: number) => (mainStore.exercises.find((e) => e.id === value)?.name);

const totalWeight = computed(() => {
  const ret = props.item.exercises.reduce((acc, cur) => (
    acc + (cur.weight * cur.repetitions * cur.approaches)
  ), 0);

  return ret
    .toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    .replace(',', '.');
});
</script>

<style lang="scss" scoped>
.item-list--size {
  width: 52px;
  flex-shrink: 0;
}

.item-list--weight {
  width: 68px;
  flex-shrink: 0;
}
</style>
