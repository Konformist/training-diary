<template>
  <q-card :class="classesCard">
    <q-card-section>
      <q-card-section class="q-mb-sm" horizontal>
        <div class="q-space q-mr-sm ellipsis self-center">
          {{ exerciseName }}
        </div>
        <q-icon
          v-if="insertItem.bind_prev || insertItem.bind_next"
          class="q-mr-sm self-center"
          name="link"
          size="24px"
        />
        <q-btn-dropdown
          round
          dense
          flat
          size="small"
          dropdown-icon="more_vert"
          no-icon-animation
        >
          <q-list>
            <q-item clickable v-ripple @click="dialogExercise = true">
              <q-item-section>
                Сменить упражнение
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :disable="!hasPrev"
              @click="setBindPrev()"
            >
              <q-item-section>
                {{ insertItem.bind_prev ? 'Отвязать от суперсета с предыдущим' : 'Связать в суперсет с предыдущим' }}
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :disable="!hasNext"
              @click="setBindNext()"
            >
              <q-item-section>
                {{ insertItem.bind_next ? 'Отвязать от суперсета со следующим' : 'Связать в суперсет со следующим' }}
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="$emit('delete')">
              <q-item-section class="text-negative">
                Удалить
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>
      <q-card-section horizontal>
        <q-input
          class="q-space q-mr-sm"
          label="Подходы"
          type="number"
          dense
          v-model.number="insertItem.approaches"
        />
        <q-input
          class="q-space q-mr-sm"
          label="Повтор."
          type="number"
          dense
          v-model.number="insertItem.repetitions"
        />
        <q-input
          class="q-space"
          label="Вес, кг"
          type="number"
          dense
          v-model.number="insertItem.weight"
        />
      </q-card-section>
    </q-card-section>
    <TrainingExerciseDialog
      v-model="dialogExercise"
      @send="setExercise($event)"
    />
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMainStore } from 'stores/main-store';
import type TrainingExerciseModel from 'src/core/entities/training/TrainingExerciseModel';
import TrainingExerciseDialog from 'components/TrainingExerciseDialog.vue';

defineOptions({
  name: 'TrainingExerciseCard',
});

const emit = defineEmits<{
  'bind-next': [void]
  'unbind-next': [void]
  'bind-prev': [void]
  'unbind-prev': [void]
  delete: [void]
}>();

const props = defineProps<{
  hasNext?: boolean
  hasPrev?: boolean
  item: TrainingExerciseModel
}>();

const mainStore = useMainStore();

const dialogExercise = ref(false);

const insertItem = ref(props.item);
const exerciseName = computed(() => (
  mainStore.exercises.find((e) => e.id === insertItem.value.exercise_id)?.name || ''
));

const setExercise = (id: number) => {
  insertItem.value.exercise_id = id;
};

const setBindPrev = () => {
  if (insertItem.value.bind_prev) {
    emit('unbind-prev');
  } else {
    emit('bind-prev');
  }
};

const setBindNext = () => {
  if (insertItem.value.bind_next) {
    emit('unbind-next');
  } else {
    emit('bind-next');
  }
};

const classesCard = computed(() => {
  const ret: string[] = ['no-radius'];
  if (!insertItem.value.bind_prev) ret.push('radius-top');
  if (!insertItem.value.bind_next) ret.push('radius-bottom');
  return ret.join(' ');
});
</script>

<style scoped lang="scss">
.no-radius { border-radius: 0; }

.radius-top {
  border-top-left-radius: $generic-border-radius;
  border-top-right-radius: $generic-border-radius;
}

.radius-bottom {
  border-bottom-left-radius: $generic-border-radius;
  border-bottom-right-radius: $generic-border-radius;
}
</style>
