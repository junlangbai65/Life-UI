import { createMemoryHistory, createRouter } from 'vue-router';
import InteractionPage from './pages/InteractionPage.vue';
import NarrativePage from './pages/NarrativePage.vue';

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', redirect: '/narrative' },
    { path: '/narrative', component: NarrativePage },
    { path: '/interaction', component: InteractionPage },
    { path: '/:pathMatch(.*)*', redirect: '/narrative' },
  ],
});
