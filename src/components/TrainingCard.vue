<template>
  <q-card>
    <q-card-section
      class="flex items-baseline"
      :class="trainingTag ? `bg-${palette[trainingTag.color]}-9 text-${paletteText[trainingTag.color]}` : ''"
    >
      <div class="text-subtitle1 q-pr-md q-space ellipsis">
        {{ trainingTag?.name || current.name || '—' }}
      </div>
      <div class="text-no-wrap">
        {{ date.formatDate(current.date, 'DD.MM.YYYY, HH:mm') }}
      </div>
    </q-card-section>
    <q-card-section>
      Тоннаж {{ totalWeight }} кг
    </q-card-section>
    <q-card-actions>
      <q-btn
        label="Удалить"
        color="red"
        flat
        @click="$emit('delete', current.id)"
      />
      <q-space />
      <q-btn
        label="Изменить"
        color="secondary"
        flat
        @click="$emit('change', current.id)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { computed } from 'vue';
import { useMainStore } from 'stores/main-store';
import { palette, paletteText } from 'src/core/dictionaries/colors';
import TrainingModel from 'src/core/entities/training/TrainingModel';

const mainStore = useMainStore();

defineOptions({
  name: 'TrainingCard',
});

defineEmits<{
  delete: [number]
  change: [number]
}>();
const props = defineProps<{
  training: TrainingModel
}>();

const current = computed(() => (props.training));

const trainingTag = computed(() => (
  mainStore.tags.find((e) => e.id === current.value.tag_id)
));

const totalWeight = computed(() => (
  mainStore.trainingExercises
    .filter((e) => e.training_id === current.value.id)
    .reduce((acc, cur) => (acc + (cur.approaches * cur.repetitions * cur.weight)), 0)
    .toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
));
</script>
