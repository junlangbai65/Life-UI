import './styles/main.css';
import './styles/components.css';
import './styles/animations.css';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { reloadOnChatChange } from '../../util/script';
import { attachGothChatRawTextHider } from './tavernChatHide';

$(() => {
  const chatReload = reloadOnChatChange();
  const detachChatHide = attachGothChatRawTextHider();
  const app = createApp(App).use(createPinia()).use(router);
  app.mount('#app');
  $(window).on('pagehide', () => {
    detachChatHide();
    chatReload.stop();
    app.unmount();
  });
});
