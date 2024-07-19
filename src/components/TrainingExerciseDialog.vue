<template>
  <q-dialog
    full-height
    v-model="modelValue"
  >
    <q-card class="flex column no-wrap" style="max-width: 100%; width: 400px;">
      <q-input
        label="Поиск"
        autofocus
        dense
        filled
        v-model="search"
      />
      <q-list class="full-height scroll-y">
        <template
          v-for="(item, index) in listExercises"
          :key="typeof item === 'string' ? item : item.id"
        >
          <template v-if="typeof item === 'string'">
            <q-separator v-if="index" spaced />
            <q-item-label header>
              {{ item }}
            </q-item-label>
          </template>
          <q-item
            v-else
            clickable
            v-ripple
            @click="send(item.id)"
          >
            <q-item-section>
              {{ item.name }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
      <q-card-actions align="between">
        <q-btn
          label="Закрыть"
          color="secondary"
          flat
          @click="modelValue = false"
        />
        <q-btn
          label="Добавить"
          color="primary"
          flat
          :disable="!search.trim()"
          @click="addExercise()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import ExerciseModel from 'src/core/entities/exercise/ExerciseModel';
import { isIncludeString } from 'src/core/utils/strings';
import { useMainStore } from 'stores/main-store';
import { computed, ref, watch } from 'vue';

defineOptions({
  name: 'TrainingExerciseDialog',
});

const mainStore = useMainStore();

const modelValue = defineModel({ default: false });
const emit = defineEmits<{
  send: [number]
}>();

const search = ref('');

const getMuscleName = (value: number) => (mainStore.muscles.find((e) => e.id === value)?.name || '');

const listExercises = computed(() => {
  const list = mainStore.exercises
    .filter((e) => isIncludeString(e.name, search.value))
    .map((e) => ({ ...e, muscle_group: getMuscleName(e.muscle_group_id) }))
    .sort((a, b) => {
      if (a.muscle_group > b.muscle_group) return 1;
      if (a.muscle_group < b.muscle_group) return -1;
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

  let muscleSave: number;

  return list.reduce((acc, cur) => {
    if (cur.muscle_group_id !== muscleSave) {
      muscleSave = cur.muscle_group_id;
      acc.push(cur.muscle_group);
    }

    acc.push(cur);

    return acc;
  }, [] as Array<ExerciseModel|string>);
});

const send = (id: number) => {
  emit('send', id);
  modelValue.value = false;
};

const addExercise = () => {
  const id = mainStore.addExercise(search.value);
  send(id);
  Notify.create('Добавлено новое упражнение');
};

watch(
  modelValue,
  (value) => {
    if (value) {
      search.value = '';
    }
  },
);
</script>
