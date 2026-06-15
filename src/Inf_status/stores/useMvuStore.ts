import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Schema } from '../schema';
import { createFallbackStatData } from '../utils/mvuDisplay';
import { readStatDataForFloor } from '../utils/statCompare';

/** 从指定 assistant 楼层读取 stat_data 供界面展示（只读，不写回酒馆变量） */
export const useMvuStore = defineStore('inf-mvu', () => {
  const data = ref(Schema.parse(createFallbackStatData()));
  const sourceMessageId = ref(-1);

  function syncFromMessage(messageId: number) {
    if (messageId < 0) {
      data.value = Schema.parse(createFallbackStatData());
      sourceMessageId.value = -1;
      return;
    }

    const stat = readStatDataForFloor(messageId);
    if (stat) {
      data.value = stat;
      sourceMessageId.value = messageId;
      return;
    }

    if (sourceMessageId.value !== messageId) {
      data.value = Schema.parse(createFallbackStatData());
      sourceMessageId.value = messageId;
    }
  }

  return { data, sourceMessageId, syncFromMessage };
});
