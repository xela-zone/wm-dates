<template>
  <div>
    <!-- Backdrop overlay -->
    <div
      v-if="isOpen"
      class="overlay active"
      @click="$emit('close')"
    ></div>

    <!-- Slide-out dialog drawer -->
    <dialog class="left" :class="{ active: isOpen }">
      <header>
        <nav>
          <button class="circle transparent" @click="$emit('close')">
            <i>close</i>
          </button>
          <h5 class="max">Store Tools</h5>
        </nav>
      </header>

      <div class="padding">
        <h6>Bottom Navigation</h6>
        <p class="small-text">Pin up to {{ maxBottomNav }} quick-access tools ({{ bottomNavIds.length }}/{{ maxBottomNav }}):</p>
        <div class="bottom-nav-chips row wrap" style="gap: 8px;">
          <button
            v-for="tool in tools"
            :key="tool.id"
            class="chip"
            :class="{ fill: isPinned(tool.id), border: !isPinned(tool.id) }"
            @click="$emit('toggle-bottom-nav', tool.id)"
            :disabled="!isPinned(tool.id) && bottomNavIds.length >= maxBottomNav"
          >
            <i>{{ isPinned(tool.id) ? 'check' : 'add' }}</i>
            <span>{{ tool.short }}</span>
          </button>
        </div>

        <div class="divider margin"></div>

        <h6>Appearance</h6>
        <p class="small-text">Adjust screen lighting and contrast.</p>
        <div class="row wrap" style="gap: 8px;">
          <button
            class="chip"
            :class="{ fill: currentMode === 'auto', border: currentMode !== 'auto' }"
            @click="$emit('select-mode', 'auto')"
          >
            <i>brightness_auto</i>
            <span>Auto</span>
          </button>
          <button
            class="chip"
            :class="{ fill: currentMode === 'light', border: currentMode !== 'light' }"
            @click="$emit('select-mode', 'light')"
          >
            <i>light_mode</i>
            <span>Light</span>
          </button>
          <button
            class="chip"
            :class="{ fill: currentMode === 'dark', border: currentMode !== 'dark' }"
            @click="$emit('select-mode', 'dark')"
          >
            <i>dark_mode</i>
            <span>Dark</span>
          </button>
        </div>

        <div class="divider margin"></div>

        <h6>All Tools</h6>
        <nav class="vertical">
          <a
            v-for="tool in tools"
            :key="tool.id"
            :class="{ active: activeTool === tool.id }"
            @click="$emit('select-tool', tool.id)"
            role="button"
            style="display: flex; align-items: center;"
          >
            <i>{{ tool.icon }}</i>
            <span class="max">{{ tool.name }}</span>
            <span v-if="tool.isStub" class="chip small surface-variant" style="margin: 0 4px;">Soon</span>
            <button
              class="circle transparent small"
              @click.stop="$emit('toggle-bottom-nav', tool.id)"
              :title="isPinned(tool.id) ? 'Unpin from bottom bar' : (bottomNavIds.length >= maxBottomNav ? 'Max pinned reached' : 'Pin to bottom bar')"
              :disabled="!isPinned(tool.id) && bottomNavIds.length >= maxBottomNav"
              style="margin: 0; flex-shrink: 0;"
            >
              <i :class="{ 'primary-text': isPinned(tool.id) }">{{ isPinned(tool.id) ? 'push_pin' : 'add' }}</i>
            </button>
          </a>
        </nav>

        <div class="divider margin"></div>

        <div class="center-align padding" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <button class="chip surface-variant" @click="$emit('open-share')">
            <i>qr_code</i>
            <span>Share This Tool</span>
          </button>
          <a
            class="chip transparent"
            href="https://github.com/xela-zone/wm-dates"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
          >
            <i>code</i>
            <span>Source on GitHub</span>
          </a>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script>
export default {
  name: 'SidebarDrawer',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    bottomNavIds: {
      type: Array,
      required: true
    },
    maxBottomNav: {
      type: Number,
      default: 4
    },
    tools: {
      type: Object,
      required: true
    },
    activeTool: {
      type: String,
      required: true
    },
    currentMode: {
      type: String,
      default: 'auto'
    }
  },
  emits: ['close', 'toggle-bottom-nav', 'select-tool', 'open-share', 'select-mode'],
  methods: {
    isPinned(toolId) {
      return this.bottomNavIds.includes(toolId);
    }
  }
};
</script>

<style scoped>
dialog.left {
  z-index: 200;
  max-width: 320px;
  width: 85vw;
}

.overlay {
  z-index: 199;
}
</style>
