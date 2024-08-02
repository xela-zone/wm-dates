<template>
  <p class="warning" v-if="host == 'alext.duckdns.org'">
    this version of the site is going to be removed at some point.<br>please update your bookmarks to
    <a href="https://alexfromalaska.xyz/wm-date">https://alexfromalaska.xyz/wm-date</a>.
    see Alex @ OPD in 2074 for more information.
  </p>
  <DateTable />
  <PLUSearcher :perfersDark="perfersDark" />
  <br>
  <ToteLableGenerator :perfersDark="perfersDark" />
  <br>
  <div @click="e => { showQR = !showQR }" style="display: flex; justify-content: center;">
    Share this webtool By Clicking Here
  </div>
  <div v-if="showQR" style="display: flex; justify-content: center;">
    <qrcode-vue :background="perfersDark ? '#202b38' : '#fff'" :foreground="perfersDark ? '#dbdbdb' : '#363636'"
      :value="windowLocation" :margin="2" :size="350"></qrcode-vue>
  </div>
  <br>

</template>

<script>


import QrcodeVue from 'qrcode.vue'
import DateTable from './components/DateTable.vue'
import PLUSearcher from './components/PLUSearcher.vue'
import ToteLableGenerator from "./components/ToteLableGenerator.vue";

export default {
  name: "App",
  components: {
    QrcodeVue,
    DateTable,
    PLUSearcher,
    ToteLableGenerator

  },
  data() {
    return {
      windowLocation: window.location.href.split('#')[0],
      host: window.location.host,
      perfersDark: true,
      showQR: false,
    }
  },

  mounted() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    this.perfersDark = prefersDarkScheme.matches;
    prefersDarkScheme.addEventListener('change', (e) => {
      this.perfersDark = e.matches;
    });
  },
  methods: {

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