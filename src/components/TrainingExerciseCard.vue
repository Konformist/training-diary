<template>
  <q-item :to="{ name: 'TrainingExercise', params: { id: current.id } }">
    <q-item-section>
      <div class="full-width ellipsis">
        {{ exerciseName || 'Не выбрано' }}
      </div>
      <div v-if="exerciseStat">
        {{ exerciseInfo }}
      </div>
    </q-item-section>
    <q-item-section side>
      <q-btn-dropdown
        class="q-ml-sm"
        round
        dense
        flat
        size="small"
        dropdown-icon="sym_r_more_vert"
        no-icon-animation
        @click.prevent
      >
        <q-list v-close-popup>
          <q-item
            clickable
            v-ripple
            :disable="!hasPrev"
            @click="setBindPrev()"
          >
            <q-item-section>
              {{ current.bind_prev ? 'Отвязать от суперсета с предыдущим' : 'Связать в суперсет с предыдущим' }}
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            :disable="!hasNext"
            @click="setBindNext()"
          >
            <q-item-section>
              {{ current.bind_next ? 'Отвязать от суперсета со следующим' : 'Связать в суперсет со следующим' }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMainStore } from 'stores/main-store';
import TrainingExerciseModel from 'src/core/entities/training-exercise/TrainingExerciseModel';

defineOptions({
  name: 'TrainingExerciseCard',
});

const emit = defineEmits<{
  'bind-next': [void]
  'unbind-next': [void]
  'bind-prev': [void]
  'unbind-prev': [void]
}>();

const props = defineProps<{
  hasNext?: boolean
  hasPrev?: boolean
  exerciseId: number
}>();

const mainStore = useMainStore();

const current = computed(() => (
  mainStore.trainingExercises.find((e) => e.id === props.exerciseId)
  || new TrainingExerciseModel()
));

const exerciseName = computed(() => (
  mainStore.exercises.find((e) => e.id === current.value.exercise_id)?.name || ''
));

const exerciseStat = computed(() => ([
  current.value.approaches,
  current.value.repetitions,
  current.value.weight,
].join('x')));

const exerciseInfo = computed(() => {
  const ret = [];
  if (current.value.bind_prev || current.value.bind_next) ret.push('Суперсет');
  if (current.value.rest_time) ret.push(current.value.rest_time);
  ret.push(exerciseStat.value);
  return ret.join(' ');
});

const setBindPrev = () => {
  if (current.value.bind_prev) {
    emit('unbind-prev');
  } else {
    emit('bind-prev');
  }
};

const setBindNext = () => {
  if (current.value.bind_next) {
    emit('unbind-next');
  } else {
    emit('bind-next');
  }
};
</script>
