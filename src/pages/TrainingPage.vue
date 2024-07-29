<template>
  <q-page padding>
    <q-input
      class="q-mb-sm"
      label="Название тренировки"
      standout
      v-model.lazy.trim="current.name"
      @update:model-value="changed = true"
    />
    <TdSelect
      class="q-mb-sm"
      label="Метка"
      :options="tagsItems"
      v-model="current.tag_id"
      @update:model-value="changed = true"
    />
    <q-input
      class="q-mb-sm"
      label="Дата и время тренировки"
      type="datetime-local"
      standout
      v-model="dateTime"
      @change="dateTimeInput()"
      @update:model-value="changed = true"
    />
    <q-input
      class="q-mb-sm"
      label="Комментарий к тренировке"
      type="textarea"
      autogrow
      standout
      v-model.lazy.trim="current.comment"
      @update:model-value="changed = true"
    />
    <TrainingExerciseCard
      v-for="(item, index) in trainingExercises"
      :key="item.id"
      :class="!item.bind_next ? 'q-mb-sm' : ''"
      :has-prev="index !== 0"
      :has-next="index !== trainingExercises.length - 1"
      :item="item"
      @bind-next="bindExerciseNext(item.id)"
      @unbind-next="unbindExerciseNext(item.id)"
      @bind-prev="bindExercisePrev(item.id)"
      @unbind-prev="unbindExercisePrev(item.id)"
      @delete="delExercise(item.id)"
    />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="addExercise()"
      />
    </q-page-sticky>
    <TdFooter
      :buttons="[
        { icon: 'save', text: 'Сохранить', emit: 'save' },
        { icon: 'content_copy', text: 'Копировать', emit: 'copy' },
      ]"
      @save="save()"
      @copy="copy()"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { date, Notify } from 'quasar';
import { DATE_TIME_MASK } from 'src/core/dictionaries/dates';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { useMainStore } from 'stores/main-store';
import TdFooter from 'components/UI/TdFooter.vue';
import TdSelect from 'components/UI/TdSelect.vue';
import TrainingExerciseCard from 'components/TrainingExerciseCard.vue';

defineOptions({
  name: 'TrainingPage',
});

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();

const tagsItems = computed(() => [
  { id: 0, name: 'Не выбрано' },
  ...mainStore.tags,
]);

/** Что-то было изменено */
const changed = ref(false);
const current = computed(() => (
  mainStore.trainings.find((e) => e.id === +route.params.id)
  || new TrainingModel()
));

const dateTime = ref(date.formatDate(current.value.date, DATE_TIME_MASK));
const dateTimeInput = () => {
  if (dateTime.value) {
    current.value.date = date.extractDate(dateTime.value, DATE_TIME_MASK).getTime();
  }
};

const trainingExercises = computed(() => (
  mainStore.trainingExercises.filter((e) => e.training_id === current.value.id)
));

const addExercise = () => {
  mainStore.addTrainingExercise(current.value.id);
  changed.value = true;
};

const delExercise = (value: number) => {
  mainStore.delTrainingExercise(value);
  changed.value = true;
};

const bindExerciseNext = (id: number) => {
  const curIndex = trainingExercises.value.findIndex((e) => e.id === id);
  const curExercise = trainingExercises.value[curIndex];
  const nextExercise = trainingExercises.value[curIndex + 1];

  if (!nextExercise || !curExercise) return;

  curExercise.bind_next = nextExercise.id;
  nextExercise.bind_prev = id;
  changed.value = true;
};

const unbindExerciseNext = (id: number) => {
  const curIndex = trainingExercises.value.findIndex((e) => e.id === id);
  const curExercise = trainingExercises.value[curIndex];
  const nextExercise = trainingExercises.value[curIndex + 1];

  if (!nextExercise || !curExercise) return;

  curExercise.bind_next = 0;
  nextExercise.bind_prev = 0;
  changed.value = true;
};

const bindExercisePrev = (id: number) => {
  const curIndex = trainingExercises.value.findIndex((e) => e.id === id);
  const curExercise = trainingExercises.value[curIndex];
  const prevExercise = trainingExercises.value[curIndex - 1];

  if (!prevExercise || !curExercise) return;

  curExercise.bind_prev = prevExercise.id;
  prevExercise.bind_next = id;
  changed.value = true;
};

const unbindExercisePrev = (id: number) => {
  const curIndex = trainingExercises.value.findIndex((e) => e.id === id);
  const curExercise = trainingExercises.value[curIndex];
  const prevExercise = trainingExercises.value[curIndex - 1];

  if (!prevExercise || !curExercise) return;

  curExercise.bind_prev = 0;
  prevExercise.bind_next = 0;
  changed.value = true;
};

const save = async () => {
  await mainStore.saveTrainings();
  changed.value = false;
  Notify.create('Успешно сохранено');
  return true;
};

const copy = async () => {
  const id = mainStore.copyTraining(current.value.id);
  await save();
  Notify.create('Успешно скопировано');
  await router.replace({ name: 'Training', params: { id } });
};

onBeforeRouteLeave(async () => !changed.value || save());
</script>
