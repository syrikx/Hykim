import { createRouter, createWebHistory } from 'vue-router';
import Math2 from './components/Math2.vue';
import Math from './components/Math.vue';

const routes = [
  {
    path: '/math2',
    name: 'Math2',
    component: Math2
  },

  {
    path: '/math',
    name: 'Math',
    component: Math
  }
  // 기타 라우트
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
