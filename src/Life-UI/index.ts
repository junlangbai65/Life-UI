import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import './styles/index.scss';

$(() => {
  const app = createApp(App).use(createPinia()).use(router);
  router.replace('/');
  app.mount('#app');
  $(window).on('pagehide', () => app.unmount());
});
