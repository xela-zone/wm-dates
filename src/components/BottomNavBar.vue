<template>
  <nav class="bottom fixed surface">
    <a
      v-for="tool in tools"
      :key="tool.id"
      :class="{ active: activeTool === tool.id }"
      @click="$emit('select-tool', tool.id)"
      role="button"
    >
      <i>{{ tool.icon }}</i>
      <div>{{ tool.short }}</div>
    </a>
  </nav>
</template>

<script>
export default {
  name: 'BottomNavBar',
  props: {
    tools: {
      type: Array,
      required: true
    },
    activeTool: {
      type: String,
      required: true
    }
  },
  emits: ['select-tool']
};
</script>

<style scoped>
nav.bottom {
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
