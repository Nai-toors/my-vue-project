import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Moveable from '../views/Moveable.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/moveable',
    name: 'Moveable',
    component: Moveable,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
