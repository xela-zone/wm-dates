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
        <h6>Your Role</h6>
        <p class="small-text">Configures your 3 quick-access tools in the bottom bar.</p>
        <div class="row wrap" style="gap: 8px;">
          <button
            v-for="role in roles"
            :key="role.id"
            class="chip"
            :class="{ fill: currentRole === role.id, border: currentRole !== role.id }"
            @click="$emit('select-role', role.id)"
          >
            <i>badge</i>
            <span>{{ role.label }}</span>
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
          >
            <i>{{ tool.icon }}</i>
            <span class="max">{{ tool.name }}</span>
            <span v-if="tool.isStub" class="chip small surface-variant" style="margin: 0;">Soon</span>
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
    roles: {
      type: Object,
      required: true
    },
    currentRole: {
      type: String,
      required: true
    },
    tools: {
      type: Object,
      required: true
    },
    activeTool: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'select-role', 'select-tool', 'open-share']
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
