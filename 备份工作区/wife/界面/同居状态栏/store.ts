import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

function resolveMessageId(): number {
  try {
    return getCurrentMessageId();
  } catch {
    const mesid = window.frameElement?.getAttribute('data-mesid');
    if (mesid != null && mesid !== '') {
      const parsed = Number(mesid);
      if (Number.isFinite(parsed)) return parsed;
    }
    return -1;
  }
}

export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: resolveMessageId() });
