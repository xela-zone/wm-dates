import { ref, computed, onMounted, onUnmounted } from 'vue';
import { TOOLS, ROLES, DEFAULT_ROLE } from '../constants/roles.js';

export function useNavigation() {
  const storedRole = localStorage.getItem('wm-dates:role');
  const initialRole = (storedRole && ROLES[storedRole]) ? storedRole : DEFAULT_ROLE;
  const currentRole = ref(initialRole);

  const initialHash = window.location.hash.replace(/^#/, '');
  const initialTool = (initialHash && TOOLS[initialHash])
    ? initialHash
    : ROLES[currentRole.value].defaultTool;

  const activeTool = ref(initialTool);
  const isDrawerOpen = ref(false);

  const bottomNavTools = computed(() => {
    const roleConfig = ROLES[currentRole.value] || ROLES[DEFAULT_ROLE];
    return roleConfig.bottomNav.map(id => TOOLS[id]).filter(Boolean);
  });

  const currentRoleConfig = computed(() => {
    return ROLES[currentRole.value] || ROLES[DEFAULT_ROLE];
  });

  function selectTool(toolId) {
    if (!TOOLS[toolId]) return;
    activeTool.value = toolId;
    window.location.hash = toolId;
    isDrawerOpen.value = false;
  }

  function setRole(roleId) {
    if (!ROLES[roleId]) return;
    currentRole.value = roleId;
    localStorage.setItem('wm-dates:role', roleId);

    const roleConfig = ROLES[roleId];
    if (!roleConfig.bottomNav.includes(activeTool.value)) {
      selectTool(roleConfig.defaultTool);
    }
  }

  function onHashChange() {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && TOOLS[hash] && activeTool.value !== hash) {
      activeTool.value = hash;
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
    ROLES,
    currentRole,
    currentRoleConfig,
    activeTool,
    isDrawerOpen,
    bottomNavTools,
    selectTool,
    setRole
  };
}
