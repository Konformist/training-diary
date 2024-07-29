<template>
  <q-card :class="classesCard">
    <q-card-section class="q-pa-sm">
      <q-card-section class="q-mb-sm" horizontal>
        <div class="q-space" @click="dialogExercise = true">
          <q-field
            label="Упражнение"
            dense
            :stack-label="!!exerciseName"
          >
            <template #control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ exerciseName }}
              </div>
            </template>
          </q-field>
        </div>
        <q-icon
          v-if="insertItem.bind_prev || insertItem.bind_next"
          class="q-ml-md self-center"
          name="link"
          size="24px"
        />
        <q-btn-dropdown
          class="q-ml-sm"
          round
          dense
          flat
          size="small"
          dropdown-icon="more_vert"
          no-icon-animation
        >
          <q-list v-close-popup>
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
            <q-item clickable v-ripple @click="dialogHistory = true">
              <q-item-section>
                История
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
          label="Отдых"
          mask="##:##"
          dense
          v-model="insertItem.rest_time"
          @update:model-value="$emit('changed')"
        />
        <q-input
          class="q-space q-mr-sm text-right"
          label="Подходы"
          type="number"
          dense
          v-model.number="insertItem.approaches"
          @update:model-value="$emit('changed')"
        />
        <q-input
          class="q-space q-mr-sm"
          label="Повторы"
          type="number"
          dense
          v-model.number="insertItem.repetitions"
          @update:model-value="$emit('changed')"
        />
        <q-input
          class="q-space"
          label="Вес, кг"
          type="number"
          dense
          v-model.number="insertItem.weight"
          @update:model-value="$emit('changed')"
        />
      </q-card-section>
    </q-card-section>
    <TrainingExerciseDialog
      v-model="dialogExercise"
      @send="setExercise($event)"
    />
    <q-dialog
      full-width
      v-model="dialogHistory"
    >
      <q-card>
        <q-list separator>
          <q-item-label header>
            {{ exerciseName }}
          </q-item-label>
          <q-item class="text-right">
            <q-item-section>Отдых</q-item-section>
            <q-item-section>Подходы</q-item-section>
            <q-item-section>Повторы</q-item-section>
            <q-item-section>Вес, кг</q-item-section>
          </q-item>
          <q-item
            v-for="exercise in exercises"
            :key="exercise.id"
            class="text-right"
            :class="exercise.id === item.id ? 'bg-green-9' : ''"
          >
            <q-item-section>{{ exercise.rest_time || '-' }}</q-item-section>
            <q-item-section>{{ exercise.approaches || '-' }}</q-item-section>
            <q-item-section>{{ exercise.repetitions || '-' }}</q-item-section>
            <q-item-section>{{ exercise.weight || '-' }}</q-item-section>
          </q-item>
        </q-list>
        <q-card-actions>
          <q-btn
            label="Закрыть"
            color="secondary"
            flat
            @click="dialogHistory = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMainStore } from 'stores/main-store';
import type TrainingExerciseModel from 'src/core/entities/training-exercise/TrainingExerciseModel';
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
  changed: [void]
}>();

const props = defineProps<{
  hasNext?: boolean
  hasPrev?: boolean
  item: TrainingExerciseModel
}>();

const mainStore = useMainStore();

const dialogExercise = ref(false);

const dialogHistory = ref(false);

const getExercise = (value: number) => (mainStore.exercises.find((e) => e.id === value)?.name || '');
const exercises = computed(() => (
  mainStore.trainingExercises
    .filter((e) => (e.exercise_id === props.item.exercise_id))
    .reverse()
));

const insertItem = ref(props.item);
const exerciseName = computed(() => (getExercise(insertItem.value.exercise_id)));

const setExercise = (id: number) => {
  insertItem.value.exercise_id = id;
  emit('changed');
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
