<template>
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
      :options="{ background: perfersDark ? '#202b38' : '#fff', lineColor: perfersDark ? 'white' : '#363636', width: 2, text: showenPlu, format: 'UPC' }" />
    <p v-else>Click an Entry from search to generate a barcode for it!</p>
  </div>
  <Searcher @showBarcode="showBarcode" />
  <br>
  <div style="display: flex; justify-content: center;">
    <qrcode-vue :background="perfersDark ? '#202b38' : '#fff'" :foreground="perfersDark ? 'white' : '#363636'"
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

    if (window.location.hostname === "alext.duckdns.org") {
      window.location = "https://alexfromalaska.xyz/wm-date/#forwarded=true"
    }

    setTimeout(() => {
      if (window.location.hash.includes("forwarded=true")) {
        //  send a http post req
        fetch("https://ha.kbrt.xyz/api/webhook/-qVe9DvVGllrCRdwOfqEoaHRa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: "Someone is using the old link",
          })
        })
        alert("This page is being moved, please update your bookmarks / installed app to https://alexfromalaska.xyz/wm-date/\n\n Find Alex if you need help :)")
        window.location.hash = ""
      }
    }, 5000)
  },
  methods: {
    showBarcode(pluNumber) {
      this.showenPlu = pluNumber.toString().padStart(11, '0')
    }
  }



};
</script>
