/**
 * 阶段三占位：完整管线见指南 unifiedRequestHandler（createChatMessages + generate + Mvu.parseMessage + assistant 楼层）
 */
export type GothUnifiedRequest = { type: 'option' | 'custom'; content: string };

export async function handleGothUnifiedRequest(_request: GothUnifiedRequest): Promise<boolean> {
  console.warn('[Goth] handleGothUnifiedRequest 尚未实现，请在阶段三扩展');
  return false;
}
