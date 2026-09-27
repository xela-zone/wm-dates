<template>


  <h2>Generate a PLU Barcode</h2>
  <vueBarcode :value="showenPlu" v-if="showenPlu" :options="{ width: 2, text: showenPlu, format: 'UPC' }"
    @click="() => { showenPlu = null }" />
  <p v-else>Click an Entry from search to generate a barcode for it!</p>
  <Searcher @showBarcode="showBarcode" />

  <br>

</template>

<script>
import Searcher from "./searcher.vue";
import vueBarcode from '@chenfengyuan/vue-barcode';

export default {
  name: "PLUSearcher",
  components: {
    Searcher,
    vueBarcode,
  },
  data() {
    return {
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
