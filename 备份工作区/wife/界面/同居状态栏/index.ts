import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

function hasStatData(): boolean {
  try {
    const messageId = getCurrentMessageId();
    if (messageId >= 0 && _.has(getVariables({ type: 'message', message_id: messageId }), 'stat_data')) {
      return true;
    }
    return _.has(getVariables({ type: 'message' }), 'stat_data');
  } catch {
    return false;
  }
}

$(async () => {
  await waitGlobalInitialized('Mvu');

  try {
    await waitUntil(() => hasStatData(), {
      timeout: 15000,
      intervalBetweenAttempts: 250,
    });
  } catch {
    console.warn('[wife/同居状态栏] 等待 stat_data 超时，使用 schema 默认值启动');
  }

  const pinia = createPinia();
  const app = createApp(App).use(pinia);
  app.mount('#app');

  $(window).on('pagehide', () => app.unmount());
});
