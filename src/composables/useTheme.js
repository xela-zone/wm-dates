import { ref, onMounted, onUnmounted } from 'vue';

const STORAGE_KEY = 'wm-dates:theme-mode';
export const WALMART_BLUE = '#0071dc';

export function useTheme() {
  const mode = ref(localStorage.getItem(STORAGE_KEY) || 'auto');
  const isDark = ref(false);

  let mediaQuery = null;
  let mediaListener = null;

  function resolveIsDark() {
    if (mode.value === 'auto') {
      return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return mode.value === 'dark';
  }

  function applyTheme() {
    isDark.value = resolveIsDark();
    const effectiveMode = isDark.value ? 'dark' : 'light';

    if (typeof window !== 'undefined' && typeof window.ui !== 'undefined') {
      window.ui('mode', effectiveMode);
      window.ui('theme', WALMART_BLUE);
    } else if (typeof document !== 'undefined') {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(effectiveMode);
    }
  }

  function setMode(newMode) {
    if (!['auto', 'light', 'dark'].includes(newMode)) return;
    mode.value = newMode;
    localStorage.setItem(STORAGE_KEY, newMode);
    applyTheme();
  }

  onMounted(() => {
    applyTheme();

    if (typeof window !== 'undefined' && window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaListener = () => {
        if (mode.value === 'auto') {
          applyTheme();
        }
      };
      mediaQuery.addEventListener('change', mediaListener);
    }
  });

  onUnmounted(() => {
    if (mediaQuery && mediaListener) {
      mediaQuery.removeEventListener('change', mediaListener);
    }
  });

  return {
    mode,
    isDark,
    setMode,
    applyTheme
  };
}
