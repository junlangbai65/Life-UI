const OPEN_KEY = 'wife-cohab-status:accordion';

export const useUiStore = defineStore('wife-status-ui', () => {
  const openSection = useLocalStorage<string | null>(OPEN_KEY, 'relationship');

  function toggleSection(id: string) {
    openSection.value = openSection.value === id ? null : id;
  }

  function isOpen(id: string) {
    return openSection.value === id;
  }

  return { openSection, toggleSection, isOpen };
});
