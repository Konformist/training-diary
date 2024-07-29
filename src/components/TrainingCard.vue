<template>
  <q-item>
    <q-item-section
      v-if="trainingTag?.color"
      thumbnail
    >
      <div
        class="full-height"
        :class="`bg-${palette[trainingTag?.color]}`"
        style="width: 8px;"
      />
    </q-item-section>
    <q-item-section>
      {{ trainingTag ? trainingTag.name : current.name }}
    </q-item-section>
    <q-item-section side>
      {{ date.formatDate(current.date, 'HH:mm') }}
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { computed } from 'vue';
import { useMainStore } from 'stores/main-store';
import { palette } from 'src/core/dictionaries/colors';
import TrainingModel from 'src/core/entities/training/TrainingModel';

const mainStore = useMainStore();

defineOptions({
  name: 'TrainingCard',
});

const props = defineProps<{
  trainingId: number
}>();

const current = computed(() => (
  mainStore.trainings.find((e) => e.id === props.trainingId)
  || new TrainingModel()
));

const trainingTag = computed(() => (
  mainStore.tags.find((e) => e.id === current.value.tag_id)
));
</script>
