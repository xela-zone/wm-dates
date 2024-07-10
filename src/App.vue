<template>
  <p class="warning" v-if="host == 'alext.duckdns.org'">
    this version of the site is going to be removed at some point.<br>please update your bookmarks to
    <a href="https://alexfromalaska.xyz/wm-date">https://alexfromalaska.xyz/wm-date</a>.
    see Alex @ OPD in 2074 for more information.
  </p>
  <table>
    <thead>
      <td>Category</td>
      <td>Earliest Expiration</td>
      <td>Days</td>
    </thead>
    <tbody>
      <DateComponent :days="0" msg="today" />
      <DateComponent :days="1" msg="Doughnuts" />
      <DateComponent :days="2" msg="Deli meat, fresh sea food, Bakery bread" />
      <DateComponent :days="3" msg="produce" />
      <DateComponent :days="5" msg="Commercial bread" />
      <DateComponent :days="7" msg="Dairy, 97 wall" />
      <DateComponent :days="30" msg="Frozen, Pharmacy, Dry Grocery" />
      <JulianComponent />
    </tbody>
  </table>
  <br>
  <div style="display: flex; justify-content: center;">

    <vueBarcode :value="showenPlu" v-if="showenPlu"
      :options="{ background: perfersDark ? '#202b38' : '#fff', lineColor: perfersDark ? '#dbdbdb' : '#363636', width: 2, text: showenPlu, format: 'UPC' }"
      @click="() => { showenPlu = null }" />
    <p v-else>Click an Entry from search to generate a barcode for it!</p>
  </div>
  <Searcher @showBarcode="showBarcode" />
  <br>
  <div style="display: flex; justify-content: center;">
    <qrcode-vue :background="perfersDark ? '#202b38' : '#fff'" :foreground="perfersDark ? '#dbdbdb' : '#363636'"
      :value="windowLocation" :margin="2" :size="350"></qrcode-vue>
  </div>
  <br>

</template>

<script>
import DateComponent from "./components/date.vue";
import Searcher from "./components/searcher.vue";
import JulianComponent from "./components/julian-date.vue";

import vueBarcode from '@chenfengyuan/vue-barcode';

import QrcodeVue from 'qrcode.vue'

export default {
  name: "App",
  components: {
    DateComponent,
    Searcher,
    JulianComponent,
    QrcodeVue,
    vueBarcode
  },
  data() {
    return {
      windowLocation: window.location.href.split('#')[0],
      host: window.location.host,
      perfersDark: true,
      showenPlu: null,
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
    showBarcode(pluNumber) {
      this.showenPlu = pluNumber.toString().padStart(11, '0')
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