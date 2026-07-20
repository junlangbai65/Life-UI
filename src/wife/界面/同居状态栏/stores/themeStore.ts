const THEME_KEY = 'wife-cohab-status:theme';

const ThemeSettings = z
  .object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
  })
  .prefault({});

type ThemeMode = z.infer<typeof ThemeSettings>['theme'];

function resolveEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

/** 状态栏运行在消息 iframe 内，不可用 getScriptId()；与 uiStore 一样用 localStorage */
export const useThemeStore = defineStore('wife-status-theme', () => {
  const settings = useLocalStorage(THEME_KEY, ThemeSettings.parse({}), {
    mergeDefaults: (storage, defaults) => ThemeSettings.parse({ ...defaults, ...storage }),
  });

  const effectiveTheme = computed(() => resolveEffectiveTheme(settings.value.theme));

  function applyTheme(theme: 'light' | 'dark') {
    document.documentElement.dataset.theme = theme;
  }

  watchEffect(() => {
    applyTheme(effectiveTheme.value);
  });

  if (settings.value.theme === 'system') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', () => applyTheme(resolveEffectiveTheme('system')));
  }

  function setTheme(theme: ThemeMode) {
    settings.value.theme = theme;
  }

  return { settings, effectiveTheme, setTheme };
});
