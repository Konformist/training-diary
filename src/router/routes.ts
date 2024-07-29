import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';
import GeneralLayout from 'layouts/GeneralLayout.vue';
import AboutPage from 'pages/AboutPage.vue';
import EquipmentPage from 'pages/EquipmentPage.vue';
import EquipmentsPage from 'pages/EquipmentsPage.vue';
import TagPage from 'pages/TagPage.vue';
import TagsPage from 'pages/TagsPage.vue';
import ErrorNotFound from 'pages/ErrorNotFound.vue';
import ExercisePage from 'pages/ExercisePage.vue';
import ExercisesPage from 'pages/ExercisesPage.vue';
import MainPage from 'pages/MainPage.vue';
import MusclePage from 'pages/MusclePage.vue';
import MusclesPage from 'pages/MusclesPage.vue';
import SettingsPage from 'pages/SettingsPage.vue';
import StatisticsPage from 'pages/StatisticsPage.vue';
import TrainingPage from 'pages/TrainingPage.vue';
import TrainingsPage from 'pages/trainings-page/TrainingsPage.vue';

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
    ],
  },
  {
    path: '/',
    component: GeneralLayout,
    children: [
      {
        name: 'Trainings',
        path: 'trainings',
        component: TrainingsPage,
        meta: {
          page: 'Список тренировок',
        },
      },
      {
        name: 'Training',
        path: 'trainings/:id',
        component: TrainingPage,
        meta: {
          page: 'Тренировка',
        },
      },
      {
        name: 'Tags',
        path: 'tags',
        component: TagsPage,
        meta: {
          page: 'Справочник меток',
        },
      },
      {
        name: 'Tag',
        path: 'tags/:id',
        component: TagPage,
        meta: {
          page: 'Метка',
        },
      },
      {
        name: 'Muscles',
        path: 'muscles',
        component: MusclesPage,
        meta: {
          page: 'Справочник мышц',
        },
      },
      {
        name: 'Muscle',
        path: 'muscles/:id',
        component: MusclePage,
        meta: {
          page: 'Мышца',
        },
      },
      {
        name: 'Equipments',
        path: 'equipments',
        component: EquipmentsPage,
        meta: {
          page: 'Справочник экипировки',
        },
      },
      {
        name: 'Equipment',
        path: 'equipments/:id',
        component: EquipmentPage,
        meta: {
          page: 'Экипировка',
        },
      },
      {
        name: 'Exercises',
        path: 'exercises',
        component: ExercisesPage,
        meta: {
          page: 'Справочник упражнений',
        },
      },
      {
        name: 'Exercise',
        path: 'exercises/:id',
        component: ExercisePage,
        meta: {
          page: 'Упражнение',
        },
      },
      {
        name: 'Statistics',
        path: 'statistics',
        component: StatisticsPage,
        meta: {
          page: 'Статистика',
        },
      },
      {
        name: 'Settings',
        path: 'settings',
        component: SettingsPage,
        meta: {
          page: 'Настройки',
        },
      },
      {
        name: 'About',
        path: 'about',
        component: AboutPage,
        meta: {
          page: 'О приложении',
        },
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
