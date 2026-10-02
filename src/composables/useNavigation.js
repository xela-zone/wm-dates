import { ref, computed, onMounted, onUnmounted } from 'vue';
import { TOOLS, DEFAULT_TOOL, DEFAULT_BOTTOM_NAV, MAX_BOTTOM_NAV } from '../constants/tools.js';

const STORAGE_KEY_BOTTOM_NAV = 'wm-dates:bottom-nav';
const LEGACY_STORAGE_KEY_ROLE = 'wm-dates:role';

export function useNavigation() {
  function getInitialBottomNav() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BOTTOM_NAV);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(id => TOOLS[id]).slice(0, MAX_BOTTOM_NAV);
          if (valid.length > 0) return valid;
        }
      }

      // Migrate from legacy role if present
      const legacyRole = localStorage.getItem(LEGACY_STORAGE_KEY_ROLE);
      if (legacyRole) {
        localStorage.removeItem(LEGACY_STORAGE_KEY_ROLE);
        if (legacyRole === 'fresh') {
          return ['meat-dates', 'plu-search', 'vizpick', 'opd-dates'];
        } else if (legacyRole === 'salesfloor') {
          return ['plu-search', 'opd-dates', 'meat-dates', 'vizpick'];
        }
      }
    } catch (e) {
      console.warn('Failed to load bottom nav config', e);
    }
    return [...DEFAULT_BOTTOM_NAV];
  }

  const bottomNavIds = ref(getInitialBottomNav());

  const initialHash = window.location.hash.replace(/^#/, '');
  const initialToolId = initialHash.split('?')[0];
  const initialTool = (initialToolId && TOOLS[initialToolId])
    ? initialToolId
    : (bottomNavIds.value[0] || DEFAULT_TOOL);

  const activeTool = ref(initialTool);
  const isDrawerOpen = ref(false);

  const bottomNavTools = computed(() => {
    return bottomNavIds.value.map(id => TOOLS[id]).filter(Boolean);
  });

  function saveBottomNav() {
    try {
      localStorage.setItem(STORAGE_KEY_BOTTOM_NAV, JSON.stringify(bottomNavIds.value));
    } catch (e) {
      console.warn('Failed to save bottom nav config', e);
    }
  }

  function toggleBottomNavTool(toolId) {
    if (!TOOLS[toolId]) return;
    const idx = bottomNavIds.value.indexOf(toolId);
    if (idx !== -1) {
      if (bottomNavIds.value.length <= 1) return; // Keep at least 1 tool
      bottomNavIds.value.splice(idx, 1);
    } else {
      if (bottomNavIds.value.length >= MAX_BOTTOM_NAV) return; // Max 4 tools
      bottomNavIds.value.push(toolId);
    }
    saveBottomNav();
  }

  function isBottomNavPinned(toolId) {
    return bottomNavIds.value.includes(toolId);
  }

  function selectTool(toolId) {
    if (!TOOLS[toolId]) return;
    activeTool.value = toolId;
    window.location.hash = toolId;
    isDrawerOpen.value = false;
  }

  function onHashChange() {
    const hash = window.location.hash.replace(/^#/, '');
    const toolId = hash.split('?')[0];
    if (toolId && TOOLS[toolId] && activeTool.value !== toolId) {
      activeTool.value = toolId;
    }
  }

  onMounted(() => {
    window.addEventListener('hashchange', onHashChange);
  });

  onUnmounted(() => {
    window.removeEventListener('hashchange', onHashChange);
  });

  return {
    TOOLS,
    MAX_BOTTOM_NAV,
    activeTool,
    isDrawerOpen,
    bottomNavIds,
    bottomNavTools,
    selectTool,
    toggleBottomNavTool,
    isBottomNavPinned
  };
}

