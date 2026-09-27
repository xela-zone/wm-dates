<template>
  <p class="warning" v-if="isLegacyHost">
    This version of the site is deprecated.<br>
    Please update your bookmarks and home screen shortcuts to
    <a href="https://wm.xela.zone">https://wm.xela.zone</a>.<br>
    See Xela @ Food & Consumables in 2074 for more information.
  </p>
  <DateTable />
  <PLUSearcher />
  <br>
  <ToteLabelGenerator :prefersDark="prefersDark" />
  <br>
  <h3>
    <a @click="showQR = !showQR" style="cursor: pointer;">
      Share this webtool By Clicking Here
    </a>
  </h3>
  <div v-if="showQR">
    <qrcode-vue :background="prefersDark ? '#202b38' : '#fff'" :foreground="prefersDark ? '#dbdbdb' : '#363636'"
      :value="'https://wm.xela.zone'" :margin="2" :size="350"></qrcode-vue>
  </div>
  <br>
  <MeatDateTable />

</template>

<script>
import QrcodeVue from 'qrcode.vue'
import DateTable from './components/DateTable.vue'
import PLUSearcher from './components/PLUSearcher.vue'
import ToteLabelGenerator from "./components/ToteLabelGenerator.vue"
import MeatDateTable from './components/MeatDateTable.vue'

export default {
  name: "App",
  components: {
    QrcodeVue,
    DateTable,
    PLUSearcher,
    ToteLabelGenerator,
    MeatDateTable
  },
  data() {
    return {
      host: window.location.host,
      prefersDark: true,
      showQR: false,
    }
  },
  computed: {
    isLegacyHost() {
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


<style src="water.css">
/* from npm ; water.css */
</style>

<style scoped>
/* the above tailered for a light theme */
.warning {
  background: #A61208;
  color: white;
  padding: 1em;
  margin: 1em;
  border-radius: 5px;
  text-align: center;
}

.warning>a {
  color: white
}
</style>