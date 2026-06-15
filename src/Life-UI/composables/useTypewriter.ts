import { gsap } from 'gsap';
import { onUnmounted, ref, type Ref } from 'vue';

/**
 * 基于 gsap 的打字机/数值滚动工具。
 * 用于标题、旁白入场等需要细腻节奏的文字动画。
 */
export function useTypewriter(fullText: Ref<string> | (() => string)) {
  const output = ref('');
  let tween: gsap.core.Tween | null = null;

  function play(durationPerChar = 0.03) {
    const text = typeof fullText === 'function' ? fullText() : fullText.value;
    const state = { count: 0 };
    tween?.kill();
    output.value = '';
    tween = gsap.to(state, {
      count: text.length,
      duration: text.length * durationPerChar,
      ease: 'none',
      onUpdate: () => {
        output.value = text.slice(0, Math.round(state.count));
      },
    });
  }

  function finish() {
    tween?.kill();
    output.value = typeof fullText === 'function' ? fullText() : fullText.value;
  }

  onUnmounted(() => tween?.kill());

  return { output, play, finish };
}
