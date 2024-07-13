<template>
  <q-item>
    <q-item-section>
      <q-item-label>
        Тренировка за {{ date.formatDate(item.date, 'DD.MM.YYYY') }}
      </q-item-label>
      <q-item-label
        class="q-my-none flex no-wrap"
        caption
      >
        <div class="item-list--caption text-bold ellipsis">Упражнение</div>
        <div class="item-list--size text-right text-bold">Подходы</div>
        <div class="item-list--size text-right text-bold">Повторы</div>
        <div class="item-list--size text-right text-bold">Вес, кг</div>
      </q-item-label>
      <q-item-label
        v-for="(subitem, subindex) in item.exercises"
        :key="subindex"
        class="q-my-none flex no-wrap"
        caption
      >
        <div class="item-list--caption ellipsis">{{ subitem.name }}</div>
        <div class="item-list--size text-right">{{ subitem.approaches || '-' }}</div>
        <div class="item-list--size text-right">{{ subitem.repetitions || '-' }}</div>
        <div class="item-list--size text-right">{{ subitem.weight || '-' }}</div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import TrainingModel from 'src/core/entities/training/TrainingModel';

defineOptions({
  name: 'TrainingCard',
});

defineProps<{
  item: TrainingModel
}>();
</script>

<style lang="scss" scoped>
.item-list--caption {
  min-width: 0;
  flex-grow: 1;
}

.item-list--size {
  width: 64px;
  flex-shrink: 0;
}
</style>
