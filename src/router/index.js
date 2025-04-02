import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import List from '@/views/List.vue';
import Graphs from '@/views/Graphs.vue';
import ChartsComponent from '@/components/ChartsComponent.vue';

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
    path: '/list',
    name: 'List',
    component: List,
  },
  {
    path: '/plots',
    name: 'Graphs',
    component: Graphs,
  },
  {
    path: '/plots1',
    name: 'Graphs1',
    component: ChartsComponent,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
