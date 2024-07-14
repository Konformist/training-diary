import { RouteRecordRaw } from 'vue-router';
import ErrorNotFound from 'pages/ErrorNotFound.vue';
import ExercisePage from 'pages/ExercisePage.vue';
import ExercisesPage from 'pages/ExercisesPage.vue';
import MainPage from 'pages/MainPage.vue';
import MusclePage from 'pages/MusclePage.vue';
import MusclesPage from 'pages/MusclesPage.vue';
import SettingsPage from 'pages/SettingsPage.vue';
import StatisticsPage from 'pages/StatisticsPage.vue';
import TrainingPage from 'pages/TrainingPage.vue';
import TrainingsPage from 'pages/TrainingsPage.vue';
import MainLayout from 'layouts/MainLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        name: 'Main',
        path: '',
        component: MainPage,
      },
      {
        name: 'Trainings',
        path: 'trainings',
        component: TrainingsPage,
      },
      {
        name: 'Training',
        path: 'trainings/:id',
        component: TrainingPage,
      },
      {
        name: 'Exercises',
        path: 'exercises',
        component: () => ExercisesPage,
      },
      {
        name: 'Exercise',
        path: 'exercises/:id',
        component: ExercisePage,
      },
      {
        name: 'Muscles',
        path: 'muscles',
        component: () => MusclesPage,
      },
      {
        name: 'Muscle',
        path: 'muscles/:id',
        component: MusclePage,
      },
      {
        name: 'Statistics',
        path: 'statistics',
        component: StatisticsPage,
      },
      {
        name: 'Settings',
        path: 'settings',
        component: SettingsPage,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
  },
];

export default routes;
