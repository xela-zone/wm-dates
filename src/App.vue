<template>
  <div class="app-layout">
    <!-- Top App Bar -->
    <header class="fixed top primary surface" style="z-index: 50;">
      <nav class="padding">
        <button class="circle transparent" @click="isDrawerOpen = true" aria-label="Open menu">
          <i>menu</i>
        </button>
        <h6 class="max bold no-margin" style="font-size: 1.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ currentToolName }}</h6>
        <button class="circle transparent" @click="showQR = true" aria-label="Share tool" style="margin: 0; flex-shrink: 0;">
          <i>share</i>
        </button>
        <button class="chip surface-variant" @click="isDrawerOpen = true" style="margin: 0; flex-shrink: 0;">
          <i>badge</i>
          <span>{{ currentRoleConfig.short }}</span>
        </button>
      </nav>
    </header>

    <!-- Slide-over Drawer -->
    <SidebarDrawer
      :isOpen="isDrawerOpen"
      :roles="ROLES"
      :currentRole="currentRole"
      :tools="TOOLS"
      :activeTool="activeTool"
      @close="isDrawerOpen = false"
      @select-role="setRole"
      @select-tool="selectTool"
      @open-share="showQR = true; isDrawerOpen = false"
    />

    <!-- Main Viewport with safe-area spacing -->
    <main class="responsive main-content">
      <p class="warning" v-if="isLegacyHost">
        This version of the site is deprecated.<br>
        Please update your bookmarks and home screen shortcuts to
        <a href="https://wm.xela.zone">https://wm.xela.zone</a>.<br>
        See Xela @ Food &amp; Consumables in 2074 for more information.
      </p>

      <!-- Tool 1: OPD Pickable Dates -->
      <div v-show="activeTool === 'opd-dates'">
        <DateTable />
      </div>

      <!-- Tool 2: Tote Label Barcode Generator -->
      <div v-show="activeTool === 'tote-label'">
        <ToteLabelGenerator :prefersDark="prefersDark" />
      </div>

      <!-- Tool 3: PLU Lookup -->
      <div v-show="activeTool === 'plu-search'">
        <PLUSearcher />
      </div>

      <!-- Tool 4: Meat & Seafood Thaw Dates -->
      <div v-show="activeTool === 'meat-dates'">
        <MeatDateTable />
      </div>

      <!-- Tool 5: Vizpick Generator -->
      <div v-show="activeTool === 'vizpick'">
        <VizpickGenerator />
      </div>
    </main>

    <!-- Share Dialog Backdrop & Modal -->
    <div
      class="overlay"
      :class="{ active: showQR }"
      @click="showQR = false"
      style="z-index: 99; backdrop-filter: blur(2px);"
    ></div>
    <dialog
      :class="{ active: showQR }"
      style="z-index: 100; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 4px 12px rgba(0, 0, 0, 0.25);"
    >
      <h5 class="bold">Share Pickable Dates</h5>
      <div class="center-align padding">
        <qrcode-vue
          render-as="svg"
          background="transparent"
          :foreground="prefersDark ? '#ffffff' : '#000000'"
          :value="'https://wm.xela.zone'"
          :margin="2"
          :size="240"
        ></qrcode-vue>
        <p class="margin">https://wm.xela.zone</p>
        <p class="small-text secondary-text">Works completely offline once installed.</p>
      </div>
      <nav class="right-align">
        <button class="border" @click="showQR = false">Close</button>
      </nav>
    </dialog>

    <!-- Bottom Nav Bar -->
    <BottomNavBar
      :tools="bottomNavTools"
      :activeTool="activeTool"
      @select-tool="selectTool"
    />
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import DateTable from './components/DateTable.vue';
import PLUSearcher from './components/PLUSearcher.vue';
import ToteLabelGenerator from "./components/ToteLabelGenerator.vue";
import MeatDateTable from './components/MeatDateTable.vue';
import VizpickGenerator from './components/VizpickGenerator.vue';
import BottomNavBar from './components/BottomNavBar.vue';
import SidebarDrawer from './components/SidebarDrawer.vue';
import { useNavigation } from './composables/useNavigation.js';

export default {
  name: "App",
  components: {
    QrcodeVue,
    DateTable,
    PLUSearcher,
    ToteLabelGenerator,
    MeatDateTable,
    VizpickGenerator,
    BottomNavBar,
    SidebarDrawer
  },
  setup() {
    const nav = useNavigation();
    return { ...nav };
  },
  data() {
    return {
      host: window.location.host,
      prefersDark: true,
      showQR: false,
    };
  },
  computed: {
    currentToolName() {
      return this.TOOLS[this.activeTool]?.name || 'Pickable Dates';
    },
    isLegacyHost() {
      if (import.meta.env.DEV) return false;
      if (this.host.includes('.ts.net') || this.host.includes('.local')) return false;
      if (this.host.includes('10.') || this.host.includes('192.168.')) return false;
      return this.host !== 'wm.xela.zone' && !this.host.includes('localhost') && !this.host.includes('127.0.0.1');
    }
  },
  mounted() {
    this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.prefersDark = this._mediaQuery.matches;
    this._themeHandler = (e) => {
      this.prefersDark = e.matches;
    };
    this._mediaQuery.addEventListener('change', this._themeHandler);
  },
  beforeUnmount() {
    if (this._mediaQuery && this._themeHandler) {
      this._mediaQuery.removeEventListener('change', this._themeHandler);
    }
  }
};
</script>

<style scoped>
.main-content {
  padding-top: calc(64px + env(safe-area-inset-top, 0px));
  padding-bottom: calc(108px + env(safe-area-inset-bottom, 0px));
  max-width: 900px;
  margin: 0 auto;
}

.warning {
  background: #A61208;
  color: white;
  padding: 1em;
  margin: 1em 0;
  border-radius: 8px;
  text-align: center;
}

.warning > a {
  color: white;
  text-decoration: underline;
}
</style>