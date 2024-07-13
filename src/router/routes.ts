import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'Main',
        path: '',
        component: () => import('pages/MainPage.vue'),
      },
      {
        name: 'Trainings',
        path: 'trainings',
        component: () => import('pages/TrainingsPage.vue'),
      },
      {
        name: 'Training',
        path: 'trainings/:id',
        component: () => import('pages/TrainingPage.vue'),
      },
      {
        name: 'Statistics',
        path: 'statistics',
        component: () => import('pages/StatisticsPage.vue'),
      },
      {
        name: 'Settings',
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
