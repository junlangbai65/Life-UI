import { mockResponses } from '../data/dialogue';
import type { DialogueMessage } from '../types';

/**
 * LLM 服务抽象层（接入点）
 * --------------------------------------------------
 * 当前为纯前端 mock 实现：根据用户输入/选项返回预置回复，并以打字机方式逐字「流式」输出。
 * 未来接入真实 LLM 时，只需替换 `streamReply` 的内部实现（例如改为调用酒馆助手的
 * `generate({ should_stream: true })` 并监听 STREAM_TOKEN 事件），上层 UI 无需改动。
 */

export interface StreamHandlers {
  onMessageStart: (message: DialogueMessage) => void;
  onToken: (messageId: string, fullText: string) => void;
  onMessageEnd: (messageId: string) => void;
  onComplete: () => void;
}

export interface StreamOptions {
  choiceId?: string;
  userInput?: string;
  signal?: { canceled: boolean };
}

function pickResponse(options: StreamOptions): DialogueMessage[] {
  if (options.choiceId && mockResponses[options.choiceId]) {
    return mockResponses[options.choiceId];
  }
  return mockResponses.default;
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/** 模拟「思考」延迟，便于展示生成中骨架态 */
export async function streamReply(options: StreamOptions, handlers: StreamHandlers): Promise<void> {
  const messages = pickResponse(options);

  // 思考停顿
  await delay(620);
  if (options.signal?.canceled) return;

  for (const template of messages) {
    if (options.signal?.canceled) return;

    const message: DialogueMessage = { ...template, text: '', streaming: true };
    handlers.onMessageStart(message);

    const chars = Array.from(template.text);
    let buffer = '';
    for (const ch of chars) {
      if (options.signal?.canceled) return;
      buffer += ch;
      handlers.onToken(message.id, buffer);
      // 标点处稍作停顿，模拟自然节奏
      await delay(/[。！？、，「」…—.!?]/.test(ch) ? 60 : 22);
    }
    handlers.onMessageEnd(message.id);
    await delay(260);
  }

  handlers.onComplete();
}
