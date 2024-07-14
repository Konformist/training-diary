<template>
  <q-card>
    <q-card-section class="flex no-wrap">
      <q-select
        ref="exerciseRef"
        class="q-mr-sm"
        style="flex-grow: 1; min-width: 0;"
        label="Название упражнения"
        :options="comboExercises"
        option-value="id"
        option-label="name"
        dense
        use-input
        fill-input
        hide-selected
        hide-dropdown-icon
        emit-value
        map-options
        @new-value="newExerciseValue($event)"
        v-model="insertItem.exercise_id"
        @filter="comboExercisesFilter"
      />
      <q-input
        class="item-card--size q-mr-sm"
        label="Подходы"
        type="number"
        dense
        v-model.number="insertItem.approaches"
      />
      <q-input
        class="item-card--size q-mr-sm"
        label="Повтор."
        type="number"
        dense
        v-model.number="insertItem.repetitions"
      />
      <q-input
        class="item-card--size q-mr-sm"
        label="Вес, кг"
        type="number"
        dense
        v-model.number="insertItem.weight"
      />
      <q-btn
        class="self-center"
        icon="clear"
        round
        dense
        flat
        size="small"
        color="negative"
        @click="$emit('delete')"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { QSelect } from 'quasar';
import ExerciseModel from 'src/core/entities/exercise/ExerciseModel';
import { computed, ref } from 'vue';
import { useMainStore } from 'stores/main-store';
import type TrainingExerciseModel from 'src/core/entities/training/TrainingExerciseModel';

const mainStore = useMainStore();

defineOptions({
  name: 'TrainingExerciseCard',
});

defineEmits<{
  delete: [void]
}>();

const props = defineProps<{
  item: TrainingExerciseModel
}>();

const insertItem = ref(props.item);

const isIncludeString = (value: string, search: string) => (
  value.toLowerCase().trim().includes(search.toLowerCase().trim())
);

const searchExercises = ref('');
const comboExercises = computed(() => (
  mainStore.exercises.filter((e) => isIncludeString(e.name, searchExercises.value))
));

const exerciseRef = ref<typeof QSelect>();
const newExerciseValue = (value: string) => {
  const item = mainStore.exercises.find((e) => isIncludeString(e.name, value));

  if (item) {
    return;
  }

  const exercise = new ExerciseModel({
    id: (mainStore.exercises[mainStore.exercises.length - 1]?.id || 0) + 1,
    name: value,
    muscle_group_id: 0,
  });

  mainStore.exercises.push(exercise);
  insertItem.value.exercise_id = exercise.id;
  exerciseRef.value?.hidePopup();
};

const comboExercisesFilter = (value: string, update: (fn: () => void) => void) => {
  update(() => { searchExercises.value = value; });
};
</script>

<style lang="scss" scoped>
.item-card--size {
  width: 42px;
  flex-shrink: 0;
}
</style>
