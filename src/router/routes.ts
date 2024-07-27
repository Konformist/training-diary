import AboutPage from 'pages/AboutPage.vue';
import EquipmentPage from 'pages/EquipmentPage.vue';
import EquipmentsPage from 'pages/EquipmentsPage.vue';
import TagPage from 'pages/TagPage.vue';
import TagsPage from 'pages/TagsPage.vue';
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
        name: 'Tags',
        path: 'tags',
        component: TagsPage,
      },
      {
        name: 'Tag',
        path: 'tags/:id',
        component: TagPage,
      },
      {
        name: 'Muscles',
        path: 'muscles',
        component: MusclesPage,
      },
      {
        name: 'Muscle',
        path: 'muscles/:id',
        component: MusclePage,
      },
      {
        name: 'Equipments',
        path: 'equipments',
        component: EquipmentsPage,
      },
      {
        name: 'Equipment',
        path: 'equipments/:id',
        component: EquipmentPage,
      },
      {
        name: 'Exercises',
        path: 'exercises',
        component: ExercisesPage,
      },
      {
        name: 'Exercise',
        path: 'exercises/:id',
        component: ExercisePage,
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
      {
        name: 'About',
        path: 'about',
        component: AboutPage,
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
