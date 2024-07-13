<template>
  <q-card flat bordered>
    <q-card-section class="flex no-wrap q-gutter-sm">
      <q-select
        style="flex-grow: 1; min-width: 0;"
        label="Название упражнения"
        :options="mainStore.combos.exercises"
        dense
        use-input
        fill-input
        hide-selected
        hide-dropdown-icon
        emit-value
        map-options
        new-value-mode="add-unique"
        v-model="insertItem.name"
        @update:model-value="mainStore.saveTrainings()"
      />
      <q-select
        style="width: 80px; flex-shrink: 0;"
        label="Мышцы"
        :options="mainStore.combos.muscle_group"
        dense
        emit-value
        map-options
        v-model="insertItem.muscle_group"
        @update:model-value="mainStore.saveTrainings()"
      />
      <q-input
        style="width: 52px; flex-shrink: 0;"
        label="Подходы"
        type="number"
        dense
        v-model="insertItem.approaches"
        @change="mainStore.saveTrainings()"
      />
      <q-input
        style="width: 52px; flex-shrink: 0;"
        label="Повтор."
        type="number"
        dense
        v-model="insertItem.repetitions"
        @change="mainStore.saveTrainings()"
      />
      <q-input
        style="width: 52px; flex-shrink: 0;"
        label="Вес, кг"
        type="number"
        dense
        v-model="insertItem.weight"
        @change="mainStore.saveTrainings()"
      />
      <q-btn
        class="self-center"
        icon="clear"
        round
        dense
        flat
        color="negative"
        @click="$emit('delete')"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMainStore } from 'stores/main-store';
import type ExerciseModel from 'src/core/entities/training/ExerciseModel';

const mainStore = useMainStore();

defineOptions({
  name: 'ExerciseCard',
});

defineEmits<{
  delete: [void]
}>();

const props = defineProps<{
  item: ExerciseModel
}>();

const insertItem = ref(props.item);
</script>
