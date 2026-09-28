<template>
  <div class="app-layout">
    <!-- Top App Bar -->
    <header class="fixed top primary surface" style="z-index: 50;">
      <nav class="padding">
        <button class="circle transparent" @click="isDrawerOpen = true" aria-label="Open menu">
          <i>menu</i>
        </button>
        <h5 class="max bold">{{ currentToolName }}</h5>
        <button class="chip surface-variant" @click="isDrawerOpen = true">
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

      <!-- Tool 5: Julian Calendar -->
      <div v-show="activeTool === 'julian'">
        <div class="card padding">
          <h4>Julian Date Calculator</h4>
          <p>Current day-of-year used for meat and perishable date codes:</p>
          <table class="border">
            <tbody>
              <JulianComponent />
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tool 6: Vizpick Stub -->
      <div v-show="activeTool === 'vizpick'">
        <div class="card padding center-align">
          <i class="extra">inventory_2</i>
          <h4>Vizpick Barcode Tools</h4>
          <p class="secondary-text">Backroom bin and aisle location barcode generator.</p>
          <p><span class="badge surface-variant">Under Development</span></p>
        </div>
      </div>

      <!-- Tool 7: Share Tool View -->
      <div v-show="activeTool === 'share'">
        <div class="card padding center-align">
          <h4>Share This Webtool</h4>
          <qrcode-vue
            :background="prefersDark ? '#202b38' : '#fff'"
            :foreground="prefersDark ? '#dbdbdb' : '#363636'"
            :value="'https://wm.xela.zone'"
            :margin="2"
            :size="280"
          ></qrcode-vue>
          <p class="margin">https://wm.xela.zone</p>
          <p class="secondary-text">Works completely offline once installed.</p>
        </div>
      </div>
    </main>

    <!-- Share Dialog Modal -->
    <dialog :class="{ active: showQR }">
      <h5>Share Pickable Dates</h5>
      <div class="center-align padding">
        <qrcode-vue
          :background="prefersDark ? '#202b38' : '#fff'"
          :foreground="prefersDark ? '#dbdbdb' : '#363636'"
          :value="'https://wm.xela.zone'"
          :margin="2"
          :size="260"
        ></qrcode-vue>
        <p class="margin">https://wm.xela.zone</p>
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
import JulianComponent from './components/julian-date.vue';
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
    JulianComponent,
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
  padding-bottom: calc(84px + env(safe-area-inset-bottom, 0px));
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