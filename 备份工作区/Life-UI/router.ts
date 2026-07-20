import { createMemoryHistory, createRouter } from 'vue-router';
import HomeView from './views/HomeView.vue';
import DialogueView from './views/DialogueView.vue';
import MapView from './views/MapView.vue';
import TimelineView from './views/TimelineView.vue';
import ReviewView from './views/ReviewView.vue';

export const navItems = [
  { name: 'home', path: '/', label: '主页', icon: 'home', key: '1' },
  { name: 'dialogue', path: '/dialogue', label: '对话', icon: 'chat', key: '2' },
  { name: 'map', path: '/map', label: '地图', icon: 'map', key: '3' },
  { name: 'timeline', path: '/timeline', label: '时间轴', icon: 'timeline', key: '4' },
  { name: 'review', path: '/review', label: '回顾', icon: 'review', key: '5' },
] as const;

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/dialogue', name: 'dialogue', component: DialogueView },
    { path: '/map', name: 'map', component: MapView },
    { path: '/timeline', name: 'timeline', component: TimelineView },
    { path: '/review', name: 'review', component: ReviewView },
  ],
});
