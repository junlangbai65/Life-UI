import gsap from 'gsap';

const METER_DURATION = 0.45;
const METER_EASE = 'power2.out';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useAnimatedNumber(source: () => number, duration = METER_DURATION) {
  const display = ref(source());
  let tween: gsap.core.Tween | null = null;

  watch(
    source,
    (next, prev) => {
      if (next === prev) return;
      if (prefersReducedMotion()) {
        display.value = next;
        return;
      }
      const proxy = { value: display.value };
      tween?.kill();
      tween = gsap.to(proxy, {
        value: next,
        duration,
        ease: METER_EASE,
        onUpdate: () => {
          display.value = Math.round(proxy.value);
        },
      });
    },
    { immediate: true },
  );

  return display;
}

/** GSAP-driven 0–100 width for meters (same timing as numeric displays). */
export function useAnimatedPercent(source: () => number, duration = METER_DURATION) {
  const display = ref(source());
  let tween: gsap.core.Tween | null = null;

  watch(
    source,
    (next, prev) => {
      if (next === prev) return;
      if (prefersReducedMotion()) {
        display.value = next;
        return;
      }
      const proxy = { value: display.value };
      tween?.kill();
      tween = gsap.to(proxy, {
        value: next,
        duration,
        ease: METER_EASE,
        onUpdate: () => {
          display.value = proxy.value;
        },
      });
    },
    { immediate: true },
  );

  return display;
}

export function useAnimatedMeterWidth(source: () => number, duration = METER_DURATION) {
  return useAnimatedPercent(source, duration);
}
