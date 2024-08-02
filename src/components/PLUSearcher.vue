<template>

  <div style="display: flex; justify-content: center;">

    <vueBarcode :value="showenPlu" v-if="showenPlu" :options="{ width: 2, text: showenPlu, format: 'UPC' }"
      @click="() => { showenPlu = null }" />
    <p v-else>Click an Entry from search to generate a barcode for it!</p>
  </div>
  <Searcher @showBarcode="showBarcode" />

  <br>

</template>

<script>
import Searcher from "./searcher.vue";

import vueBarcode from '@chenfengyuan/vue-barcode';


export default {
  name: "PLU Searcher",
  props: {
    perfersDark: Boolean,
  },
  components: {
    Searcher,
    vueBarcode,
  },
  data() {
    return {
      windowLocation: window.location.href.split('#')[0],
      host: window.location.host,
      showenPlu: null,
    }
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
