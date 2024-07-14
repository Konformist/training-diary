<template>
  <q-page padding>
    <q-select
      class="q-mb-sm"
      label="Упражнение"
      :options="mainStore.exercises"
      option-value="id"
      option-label="name"
      standout
      emit-value
      map-options
      v-model="exercise"
      @update:model-value="updateCharts()"
    />
    <q-card class="q-mb-sm">
      <q-card-section>
        <div class="q-mb-sm">Вес, кг</div>
        <canvas
          ref="chartWeightRef"
          style="width: 100%; height: 200px;"
        />
      </q-card-section>
    </q-card>
    <q-card class="q-mb-sm">
      <q-card-section>
        <div class="q-mb-sm">Повторы</div>
        <canvas
          ref="chartRepetitionsRef"
          style="width: 100%; height: 200px;"
        />
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <div class="q-mb-sm">Подходы</div>
        <canvas
          ref="chartApproachesRef"
          style="width: 100%; height: 200px;"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {
  Chart, LinearScale, CategoryScale, LineController, LineElement, PointElement, Tooltip,
} from 'chart.js';
import { DefaultDataPoint } from 'chart.js/dist/types';
import { date } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import { useMainStore } from 'stores/main-store';

Chart.registry.add(Tooltip);
Chart.registry.addControllers(LineController);
Chart.registry.addScales(LinearScale, CategoryScale);
Chart.registry.addElements(LineElement, PointElement);
Chart.defaults.color = '#fff';
Chart.defaults.locale = 'ru-RU';
Chart.defaults.datasets.line.backgroundColor = '#ff6a6a';
Chart.defaults.datasets.line.borderColor = '#ff6a6a';
Chart.defaults.scale.min = 0;
Chart.defaults.scale.grid.color = '#666';

const mainStore = useMainStore();

defineOptions({
  name: 'StatisticsPage',
});

const exercise = ref(mainStore.exercises[0]?.id || 0);

interface IChartData {
  /** Дата Timestamp */
  date: number
  /** Количество подходов */
  approaches: number
  /** Количество повторений */
  repetitions: number
  /** Вес в подходе */
  weight: number
}

const chartData = computed(() => mainStore.trainings.reduce((acc, training) => {
  training.exercises.forEach((item) => {
    if (item.exercise_id === exercise.value) {
      acc.push({
        date: training.date,
        approaches: item.approaches,
        repetitions: item.repetitions,
        weight: item.weight,
      });
    }
  });

  return acc;
}, [] as IChartData[]));

const trainingDates = computed(() => (
  [...new Set(chartData.value.map((e) => date.formatDate(e.date, 'DD.MM.YYYY')))]
));

let chartWeight: Chart<'line', DefaultDataPoint<'line'>, string>;
let chartRepetitions: Chart<'line', DefaultDataPoint<'line'>, string>;
let chartApproaches: Chart<'line', DefaultDataPoint<'line'>, string>;

const updateCharts = () => {
  if (chartWeight) {
    chartWeight.data.labels = trainingDates.value;
    chartWeight.data.datasets[0].data = chartData.value.map((e) => ({ x: e.date, y: e.weight }));
    chartWeight.update();
  }

  if (chartRepetitions) {
    chartRepetitions.data.labels = trainingDates.value;
    chartRepetitions.data.datasets[0].data = chartData.value.map((e) => ({ x: e.date, y: e.repetitions }));
    chartRepetitions.update();
  }

  if (chartApproaches) {
    chartApproaches.data.labels = trainingDates.value;
    chartApproaches.data.datasets[0].data = chartData.value.map((e) => ({ x: e.date, y: e.approaches }));
    chartApproaches.update();
  }
};

const chartWeightRef = ref<HTMLCanvasElement>();
const chartRepetitionsRef = ref<HTMLCanvasElement>();
const chartApproachesRef = ref<HTMLCanvasElement>();

onMounted(() => {
  if (chartWeightRef.value) {
    chartWeight = new Chart<'line', DefaultDataPoint<'line'>, string>(chartWeightRef.value, {
      type: 'line',
      data: {
        labels: trainingDates.value,
        datasets: [{
          label: 'Вес, кг',
          data: chartData.value.map((e) => ({ x: e.date, y: e.weight })),
        }],
      },
      options: {
        locale: 'ru-RU',
        scales: {
          x: {
            ticks: { align: 'inner' },
          },
          y: {
            ticks: { align: 'inner', stepSize: 10 },
          },
        },
      },
    });
  }

  if (chartRepetitionsRef.value) {
    chartRepetitions = new Chart<'line', DefaultDataPoint<'line'>, string>(chartRepetitionsRef.value, {
      type: 'line',
      data: {
        labels: trainingDates.value,
        datasets: [{
          label: 'Повторы',
          data: chartData.value.map((e) => ({ x: e.date, y: e.repetitions })),
        }],
      },
      options: {
        scales: {
          x: {
            ticks: { align: 'inner' },
          },
          y: {
            ticks: { align: 'inner', stepSize: 1 },
          },
        },
      },
    });
  }

  if (chartApproachesRef.value) {
    chartApproaches = new Chart<'line', DefaultDataPoint<'line'>, string>(chartApproachesRef.value, {
      type: 'line',
      data: {
        labels: trainingDates.value,
        datasets: [{
          label: 'Подходы',
          data: chartData.value.map((e) => ({ x: e.date, y: e.approaches })),
        }],
      },
      options: {
        scales: {
          x: {
            ticks: { align: 'inner' },
          },
          y: {
            ticks: { align: 'inner', stepSize: 1 },
          },
        },
      },
    });
  }
});
</script>
