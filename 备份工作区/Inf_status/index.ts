import { waitUntil } from 'async-wait-until';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './styles/index.scss';
import { resolveAssistantMessageId } from './utils/messageParser';
import { readStatDataForFloor } from './utils/statCompare';

$(async () => {
  await waitGlobalInitialized('Mvu');

  try {
    await waitUntil(
      () => {
        const resolvedId = resolveAssistantMessageId(null);
        if (resolvedId >= 0 && readStatDataForFloor(resolvedId)) return true;

        try {
          return _.has(getVariables({ type: 'message', message_id: getCurrentMessageId() }), 'stat_data');
        } catch {
          return false;
        }
      },
      { timeout: 15000, intervalBetweenAttempts: 250 },
    );
  } catch {
    console.warn('[Inf_status] 等待 stat_data 超时，使用 schema 默认值启动');
  }

  const pinia = createPinia();
  const app = createApp(App).use(pinia);
  app.mount('#app');

  $(window).on('pagehide', () => app.unmount());
});
