import { createApp } from 'vue';
import App from './App.vue';
import './adven.css';
import { router } from './router';

$(() => {
  const app = createApp(App).use(createPinia()).use(router);
  app.mount('#app');
  $(window).on('pagehide', () => app.unmount());
});
